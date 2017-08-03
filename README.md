# WebAudioVisualizer

Simple Oscilloscope, volume and frequency visualizers

#### Add the script to your project. Also needs jQuery, 
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
<script src="scripts/webAudioVisualizer.min.js"></script>
```
#### Add containers in your HTML
```html
<div id="volumeID"></div>
<div id="freqID"></div>
<div id="scopeID"></div>
```

#### Create a visualizer object
```javascript
let context = new AudioContext
//Params fall back on default values. 
let audioVisualizerVolume = new AudioVisualizer({context:context,
	divID:'volumeID',
	type:'Volume', //type can be Volume/Frequency/Oscilloscope
	width:400,
	height:220,
	fftSize:2048})
	
//Connect it to the desired web audio node and start drawing
audioVisualizerVolume.connectAndDraw(node)

```

And here you go.
![result](/img/Capture.PNG)



Visit the [webAudioVisualizer page](https://atactionpark.github.io/WebAudioVisualizer/) for more info.