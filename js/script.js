"use strict";

document.addEventListener('DOMContentLoaded', function(){ 
    hljs.initHighlightingOnLoad()

    //Set up the keyboard. settings are optional and will fall back on default values if needed
    let keyborad = new Keyborad()
	let c = keyborad.context
	let n = keyborad.mixNode

	let audioVisualizerVolume = new AudioVisualizer({context:c,
												divID:'volumeID',
												type:'Volume', //type can be Volume/Frequency/Oscilloscope
												width:400,
												height:220,
												fftSize:2048})
	audioVisualizerVolume.connectAndDraw(n)

	let audioVisualizerFreq = new AudioVisualizer({context:c,divID:'freqID',type:'Frequency'})
	audioVisualizerFreq.connectAndDraw(n)

	let audioVisualizerScope= new AudioVisualizer({context:c,divID:'scopeID',type:'Oscilloscope'})
	audioVisualizerScope.connectAndDraw(n)


}, false);









