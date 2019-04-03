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

export class OnionSkinVisualization extends Visualization {
	constructor(name){
		super(name)

		this._swapViz = new Visualization('swap canvas')

		this.history = 0.95
	}

	resize(width, height){
		super.resize(width, height)
		this._swapViz.resize(width, height)
	}

	drawTo(context, x=0, y=0){

		if (this.history > 0){
			this.context.clearRect(0, 0, this.width, this.height)
			this.context.globalAlpha = this.history
			this.context.drawImage(this._swapViz.canvas, 0, 0, this.width, this.height)
			this.context.globalAlpha = 1

			//clear the previous frame by redrawing it at a lower opacity
			// this.context.fillStyle = `rgba(0, 0, 0, ${1 - this.history})`
			// this.context.fillRect(0, 0, this.width, this.height)

			//draw the frame
			this.draw(this.context, this.width, this.height)

			//clear the canvas
			this._swapViz.context.clearRect(0, 0, this.width, this.height)

			//draw the canvas onto the swap canvas
			this._swapViz.context.drawImage(this.canvas, 0, 0, this.width, this.height)
			context.drawImage(this.canvas, x, y, this.width, this.height)

		} else {
			this.context.clearRect(0, 0, this.width, this.height)
			super.drawTo(context, x, y)
		}
	}
}
