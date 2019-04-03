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

import { WrapScrollingVisualization } from './WrapScrollingVisualization'
import { PitchScroll } from './PitchScroll'
import { Grid } from './Grid'
import { HilbertPitch } from './HilbertPitch'

export class WrapPitchScroll extends WrapScrollingVisualization {
	constructor(source){
		super()

		this._pitchScroll = new PitchScroll(source)

		this._hilbertPitch = new HilbertPitch(source)

		this._grid = new Grid(true, true, true)
	}

	set fullColor(c){
		this._pitchScroll.fullColor = c
		this._hilbertPitch.fullColor = c
	}

	get fullColor(){
		return this._pitchScroll.fullColor
	}

	clear(){
		super.clear()
		this._pitchScroll.clear()
		this._hilbertPitch.clear()
	}

	resize(width, height){
		super.resize(width, height)
		this._pitchScroll.resize(width, height)
		this._hilbertPitch.resize(width, height)
		this._grid.resize(width, height)
	}

	draw(context, width, height){
		this._pitchScroll.resize(width, height)
		this._pitchScroll.drawTo(context, 0, 0)
	}

	drawTo(context, x, y){
		context.clearRect(0, 0, this.width, this.height)
		super.drawTo(context, x, y)

		//draw the hilbert scope at the offset
		this._hilbertPitch.drawTo(context, this.offset, y)

		if (this.showGrid){
			this._grid.drawTo(context, 0, 0)
			this._pitchScroll.drawText(context, this.offset + 50)
		}
	}
}
