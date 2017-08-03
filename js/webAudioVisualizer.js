(function(){

	AudioVisualizer = function(params){
		//create a context if none is passed
		if(params.context)
			this.context = params.context 
		else
			this.context = new AudioContext

		//user params with defautl values
		this.divID = params.divID || 'defaultAudioVisualizerID';
		this.type = params.type || 'Oscilloscope';
		this.WIDTH = params.width || 400;
		this.HEIGHT = params.height ||220;
		this.fftSize = params.fftSize || 2048;
		this.panelSize = params.panelSize ||100;
		this.topSize = params.topSize ||20;
		this.bottomSize = params.bottomSize ||20;
		this.leftSize = params.leftSize ||20;
		this.panelColor = params.panelColor || 'rgb(15, 15, 15)'
		this.panelTextColor = params.panelTextColor || 'rgb(0, 200, 0)'
		this.backgroundColor = params.backgroundColor || 'rgba(0, 40, 0, 0.5)'
		this.strokeStyle = params.strokeStyle || 'rgb(0, 200, 0)'
		this.fillStyle = params.fillStyle || 'rgb(0, 200, 0)'
		//Sliders params
		this.params = {
			yScaleVolume: 1,
			xScaleVolume:200,
			maxXScaleVolume:400,
			precisionVolume:2,
			yScaleFrequencies:10.0,
			nbOfBarsFrequencies:50,
			xScaleFrequencies:1,
			yScaleOscilloscope:50.0,
			xScaleOscilloscope:50.0,
		}
		this.analyser;
		this.canvasCtx;
		this.dataArray;
		this.bufferLength;
		this.frameCount = 0;
		this.volumeArray = [];
		this.panel;
		this.width = this.WIDTH-this.panelSize - this.leftSize;
		this.height = this.HEIGHT-this.topSize - this.bottomSize;
		this.freqAxisLegend = 'Axis:1000Hz / tick';
		this.freeze = false;
		this.maxNbOfBars = 0
		
		this.init()
	}
	AudioVisualizer.prototype.connectAndDraw = function(source,destination){
		source.connect(this.analyser)
		//Can be connected between sources or to a single source
		if(destination)
			this.analyser.connect(destination)
		this.draw()
	}
	AudioVisualizer.prototype.init = function(){
		//Create and set up analyser
		this.analyser = this.context.createAnalyser();
		this.analyser.fftSize = this.fftSize;
		this.analyser.smoothingTimeConstant = 0.3;
		this.bufferLength = this.analyser.frequencyBinCount;

		//For better display limit the max number of bars for the freq graph to either
		//2 pixels wide each or the buffer length
		this.maxNbOfBars = Math.min(this.width/2,this.bufferLength)

		//If no container has been created beforehand, create a default one
		if(this.divID == 'defaultAudioVisualizerID')
			$('body').append('<div id="defaultAudioVisualizerID"></div>')

		//Create a style all parts of the audiovisualizer
		//Main container
		let div = $('#' + this.divID)
		div.height(this.HEIGHT)
		div.width(this.WIDTH)
		div.css('display','inline-block')
		div.css('border','1px solid black')
		div.css('backgroundColor',this.panelColor)
		div.css('position','relative')
		div.addClass('webAudioVisualizer')

		//Top Border & title
		div.append('<div style="position:absolute;width:'+this.width+'px;text-align:center;margin:auto;color:'+this.panelTextColor+';"><b>'+ this.type+'</b></div>')
		//Bottom border
		if(this.type=='Frequency')
			div.append('<div style="position:absolute;bottom:0px;width:'+this.width+'px;color:'+this.panelTextColor+';">'+this.freqAxisLegend+'</div>')
		else
			div.append('<div style="position:absolute;bottom:0px;width:'+this.width+'px;color:'+this.panelTextColor+';"></div>')
		//Left border
		div.append('<div style="position:absolute;top:0px;width:'+this.leftSize+'px;height:'+this.HEIGHT+'px;color:'+this.panelTextColor+';"></div>')

		let canvas = document.createElement('canvas');
		this.canvasCtx = canvas.getContext("2d");
		canvas.width = this.width;
    	canvas.height = this.height;
    	canvas.style.cssText = ('position:absolute;top:'+this.topSize+'px;left:'+this.leftSize+'px;')
		div.append(canvas)
		
		//Right side control panel
		let panel = '<div id = "' + this.divID + 'Panel" class="panel" style=" display:inline-block;position:absolute;right:0px; width:' + this.panelSize + 'px; height:' + this.HEIGHT + 'px;"></div>'
		div.append(panel)
		//Add all needed controls depending on type
		this.addControls(panel)
	}
	AudioVisualizer.prototype.draw = function(){
		if(this.freeze)
			return
		
		let drawVisual = requestAnimationFrame(AudioVisualizer.prototype.draw.bind(this));

		this.dataArray = new Uint8Array(this.bufferLength);

		this.canvasCtx.fillStyle = this.backgroundColor;
		this.canvasCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
		this.canvasCtx.lineWidth = 2;
		this.canvasCtx.strokeStyle = this.strokeStyle;
	  	this.canvasCtx.beginPath();

	    if(this.type == 'Volume')
	    	this.drawVolume()
	    else if (this.type == 'Frequency')
	    	this.drawFrequencies()
	    else if (this.type == 'Oscilloscope')
	    	this.drawOscilloscope()
	}
	//Add custom controls depending on type
	AudioVisualizer.prototype.addControls = function(panel){
		let self = this
		let d = $('#' + this.divID + 'Panel')
		let offset = this.HEIGHT/10
		let pos = (this.HEIGHT-offset)/3
		
		//Add freeze button for any type of visualizer
		d.append('<button id="' + this.type + 'Freeze" style="position:absolute;left:10px;top:'+(offset/2+3*pos-20)+'px;">Freeze</button>')
		$('#'+this.type+'Freeze').click(function(){
	        self.freeze = !self.freeze
	        self.draw()
		});

		if(this.type == 'Volume'){
			d.append(this.addControl('yScale','yScaleVolume',offset/2,1,10))
			d.append(this.addControl('Memory','xScaleVolume',offset/2+pos,3,this.params.maxXScaleVolume))
		}
		if(this.type == 'Frequency'){ 
			d.append(this.addControl('Resolution','nbOfBarsFrequencies',offset/2,4,this.maxNbOfBars))
			d.append(this.addControl('Zoom','xScaleFrequencies',offset/2+pos,1,10))
		}
		if(this.type == 'Oscilloscope'){
			d.append(this.addControl('yScale','yScaleOscilloscope',offset/2,1,200))
			d.append(this.addControl('Zoom','xScaleOscilloscope',offset/2+pos,1,100))
		}
	}
	//Add one control (slider)
	AudioVisualizer.prototype.addControl = function(name,control,pos,min,max){
		let self = this;
		let resultDiv = $('<div style="position:absolute; top:'+ pos+'px;"></div>')

		resultDiv.append('<p style="position:absolute;left:5px;margin:0px;padding:0px;color:'+this.panelTextColor+'">'+name+'</p>')

		let value = self.params[control]
		let sliderStyle = 'style="position:absolute; left:5px;top:15px;width:'+ (this.panelSize-10) + 'px"'
		let slider = $('<input id="' + name + 'Slider" class="slider" ' + sliderStyle + 'type="range" min="'+min+'" max="'+max+'" step="1" value="'+value+'"/>')
		
		//On change, overwrite the slider params
		slider.change(function(){
			self.params[control] = parseFloat($(this).val())
			//Volume specific, we keep track of an array of values. When changing the scale we need to redimension the array
			if(control == 'xScaleVolume'){
				self.volumeArray = self.volumeArray.slice(0,self.params[control])
			}
		})
		resultDiv.append(slider)
		return resultDiv
	}
	AudioVisualizer.prototype.drawVolume = function(){
		this.analyser.getByteFrequencyData(this.dataArray);

	    let v = this.getAverageVolume(this.dataArray)
	    //v will return a volume between 0 and 100 - we normalize to canvas height
	    let average = this.height - this.height*this.params.yScaleVolume*v/100

	    let zoom = this.params.xScaleVolume
	    
	    //We only sample every x Frames (precisionVolume param)
	    this.frameCount++
	    //When we sample, we add the average value to an array, and shift it if necessary to keep it constant length
	    if(this.frameCount >= this.params.precisionVolume){
	    	this.frameCount = 0
	    	this.volumeArray.push(average)
	    	if(this.volumeArray.length >zoom){
	    		this.volumeArray.shift()
	    	}
	    }
    	
    	//draw all the points in the array
		this.canvasCtx.moveTo(0, this.height/2)
    	for (let i = 1;i<zoom;i++){
    		this.canvasCtx.moveTo((i-1)*this.width/zoom, this.volumeArray[i-1])
    		this.canvasCtx.lineTo(i*this.width/zoom, this.volumeArray[i])
    	}
  		this.canvasCtx.stroke();
	}
	AudioVisualizer.prototype.drawFrequencies = function(){
		this.analyser.getByteFrequencyData(this.dataArray);

		let nbOfBar = this.params.nbOfBarsFrequencies
		let zoom = this.params.xScaleFrequencies

		let barWidth = this.width / nbOfBar;
	    let barHeight;
	    let currentBarX = 0;
	    //How many data points will we average to get the height of one point
	    let dataPerBar = Math.ceil(this.bufferLength/(nbOfBar*zoom))

	    let maxPointValue = Math.max.apply(null, this.dataArray);
	    let maxBarValue = 0
	    let bars = []

	    //need for 2 loops, we cant start drawing the bars until we know the max value for all bars
	    for(let i = 0; i < nbOfBar; i++) {
	    	barHeight = 0

	    	for(let j = 0; j < dataPerBar; j++)
	    		barHeight += this.dataArray[i*dataPerBar+j] ;
	    	
	    	barHeight = barHeight/dataPerBar  

	    	if(barHeight>maxBarValue)
	    		maxBarValue = barHeight

	    	bars.push(barHeight)    
	    }

	    for(let i = 0; i < nbOfBar; i++) {
	    	//normalize, 255 = 85% of screen
	    	let h = 0.85*this.height*bars[i]/255
	    	//normalize - make sure that the highest value is always the same even when changing sampling resolution
	    	h *=(maxPointValue/maxBarValue)

	    	this.canvasCtx.fillStyle = this.fillStyle;
	        this.canvasCtx.fillRect(currentBarX,this.height-10-h,barWidth,h);

	        currentBarX += barWidth + 1;
	    }

	    //axis: 1 tick every 1000Hz
	    this.canvasCtx.font = "12px Arial";
	    for(let i = 1000;i<this.context.sampleRate/2;i+=1000)
			this.canvasCtx.fillText('|',(barWidth+1)*this.getIndexFromFrequencies(i,dataPerBar)- barWidth/2,this.height);
	}
	AudioVisualizer.prototype.drawOscilloscope = function(){
		this.analyser.getByteTimeDomainData(this.dataArray); 

		//getByteTimeDomainData maps to 0 -> 256,  128 being the value for 0
		//We check the first time we find a zero crossing, if possible
  		let zeroCrossing = 0; 
     	for (let i = 0; i < (this.fftSize-this.width); i++) {
	        if ((this.dataArray[i] <= 128) && (this.dataArray[i+1]  > 128)) {
	          zeroCrossing = i;
	          break;
	        }
	    }

	    //scaled x
	    let x2 = 0
	    let delta = Math.round(10*this.fftSize /(2*this.width))/10
	    for (let x = 0; x2 < this.width; x++) {
	    	x2 += (this.params.xScaleOscilloscope/50)
	    	//when zooming, go back to start of te wave after displaying all points.
	    	//pretty ugly, not sure how to fix
	    	if(x > this.bufferLength){
	    		x-=this.bufferLength

	    	}
			//Scaling to fit on canvas
	        const y =this.params.yScaleOscilloscope/50*(this.dataArray[x+zeroCrossing]-128)/256*this.height + this.height/2;

	        if (x === 0) {
	            this.canvasCtx.moveTo(x2, y);
	        } else {
	            this.canvasCtx.lineTo(x2, y);
	        }
	    }
	    this.canvasCtx.stroke();
	}
	//Helpers
	AudioVisualizer.prototype.getAverageVolume = function(array) {
	    let values = 0;
	    let average;
	    let length = array.length;
	    // get all the frequency amplitudes
	    for (let i = 0; i < length; i++) {
	        values += array[i]/255*array[i]/255 
	    }
	    //get rms and normalize according to fftSize (scaled for 2048)
	    average = 100*Math.sqrt(values / length*(2048/this.fftSize)) ;

	    return average;
	}
	//Find the bar index where a speciic frequency will fit
	AudioVisualizer.prototype.getIndexFromFrequencies = function(freq,dataPerBar){
		let freqIncrement =  this.context.sampleRate/this.fftSize
		freqIncrement*=dataPerBar

		return (freq/freqIncrement) 
	}
})();


