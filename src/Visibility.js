/**
 * Copyright 2019 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */

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
