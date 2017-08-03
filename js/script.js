"use strict";

$(document).ready(function(){
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
})


















