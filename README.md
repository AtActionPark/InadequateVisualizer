# InadequateVisualizer

Simple Oscilloscope, volume and frequency visualizers

#### Add the script to your project. 
```html
<script src="scripts/inadequateVisualizer.min.js"></script>
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
visualizerVolume = new InadequateVisualizer({context:context,
	divID:'volumeID',
	type:'Volume', //type can be Volume/Frequency/Oscilloscope
	width:400,
	height:220,
	fftSize:2048})
	
//Connect it to the desired web audio node and start drawing
visualizerVolume.connectAndDraw(node)

```

And here you go.
![result](/img/Capture.PNG)



Visit the [webAudioVisualizer page](https://atactionpark.github.io/InadequateVisualizer/) for more info.