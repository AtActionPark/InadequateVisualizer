"use strict";

document.addEventListener('DOMContentLoaded', function(){ 
    hljs.initHighlightingOnLoad()

    //Set up the keyboard. settings are optional and will fall back on default values if needed
    let keyboard = new TolerableKeyboard({showKey:true})
	let c = keyboard.context
	let n = keyboard.mixNode

	let visualizerVolume = new InadequateVisualizer({context:c,
												divID:'volumeID',
												type:'Volume', //type can be Volume/Frequency/Oscilloscope
												width:400,
												height:220,
												fftSize:2048})
	visualizerVolume.connectAndDraw(n)

	let visualizerFreq = new InadequateVisualizer({context:c,divID:'freqID',type:'Frequency'})
	visualizerFreq.connectAndDraw(n)

	let visualizerScope= new InadequateVisualizer({context:c,divID:'scopeID',type:'Oscilloscope'})
	visualizerScope.connectAndDraw(n)


}, false);









