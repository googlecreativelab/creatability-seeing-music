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

import { Visualization } from './Visualization'
import { PIXELS_PER_SECOND } from '../Config'

//the time of one frame at 60fps
// const frameMilliseconds = 1000/60
const RESOLUTION_SCALAR = 8

export class ScrollingVisualization extends Visualization {
	constructor(name){
		super(name)

		this._swapViz = new Visualization('swap')

		//pixels per ms
		// this.scrollSpeed = PIXELS_PER_SECOND

		this._lastUpdate = performance.now()

		this.round = true
	}

	resize(width, height){
		width *= RESOLUTION_SCALAR
		super.resize(width, height)
		this._swapViz.resize(width, height)
	}

	drawTo(context, x, y){
		if (this.width && this.height){
			const diff = performance.now() - this._lastUpdate
			this._lastUpdate = performance.now()
			//16ms per pixel
			// let pixels = Math.round(this.scrollSpeed * (diff / frameMilliseconds))
			// const pixels = Math.round(RESOLUTION_SCALAR * PIXELS_PER_SECOND * (diff / 1000))
			const pixels = 10
			/*if (this.round){
				pixels = Math.round(pixels)
			}*/
			//draw the previous canvas onto the swap
			this._swapViz.clear()
			this._swapViz.context.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
			//clear the old one
			super.clear()
			//draw onto the end of the swap
			this._swapViz.context.save()
			this._swapViz.context.translate(this.width - pixels, 0)
			if (diff < 100){
				this.draw(this._swapViz.context, pixels, this.height)
			}
			this._swapViz.context.restore()

			//draw the whole thing onto the canvas
			this._context.save()
			this._context.translate(-pixels, 0)
			this._context.drawImage(this._swapViz.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
			this._context.restore()

			//draw the canvas onto the context
			context.drawImage(this._swapViz.canvas, 0, 0, this.width, this.height, 0, 0, this.width/RESOLUTION_SCALAR, this.height)
		}

	}

	clear(){
		super.clear()
		this._swapViz.clear()
	}
}
