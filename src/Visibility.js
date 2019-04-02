import { Master } from 'tone'

let hidden, visibilityChange
if (typeof document.hidden !== 'undefined'){ // Opera 12.10 and Firefox 18 and later support
	hidden = 'hidden'
	visibilityChange = 'visibilitychange'
} else if (typeof document.msHidden !== 'undefined'){
	hidden = 'msHidden'
	visibilityChange = 'msvisibilitychange'
} else if (typeof document.webkitHidden !== 'undefined'){
	hidden = 'webkitHidden'
	visibilityChange = 'webkitvisibilitychange'
}

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener !== 'undefined' && typeof document.hidden !== 'undefined'){

	let wasMuted = false
	document.addEventListener(visibilityChange, () => {
		if (document[hidden]){
			//hide
			wasMuted = Master.mute
			Master.mute = true
		} else {
			//show
			Master.mute = wasMuted
		}
	}, false)
}
