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
import { ScrollingVisualization } from './ScrollingVisualization'

export class LogScrollingVisualization extends Visualization {
	constructor(name){
		super(name)

		this._scrollMultiple = 4

		this._scrollCanvas = new ScrollingVisualization('swap')
		// this._scrollCanvas.scrollSpeed = 1
	}

	resize(width, height){
		super.resize(width, height)
		this._scrollCanvas.resize(width, height)
	}

	drawTo(context, x, y){
		if (this.width && this.height){
			this._scrollCanvas.drawTo(context, 0, 0)

			//draw the canvas onto the context
			// context.drawImage(this._scrollCanvas.canvas, 0, 0, this.width, this.height/*, 0, 0, this.width, this.height*/)
		}

	}
}
