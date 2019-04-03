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

import { PitchScroll } from './PitchScroll'
import { HilbertPitch } from './HilbertPitch'
import { Grid } from './Grid'

export class HilbertPitchScroll {
	constructor(source){
		this._pitchScroll = new PitchScroll(source)
		this._hilbertPitch = new HilbertPitch(source)
		this._grid = new Grid(true)
	}

	//assumes the entire canvas is passed in
	resize(width, height){
		this.width = width
		this.height = height
		this._pitchScroll.resize(width, height)
		this._hilbertPitch.resize(width, height)
		this._grid.resize(width, height)
	}

	clear(){
		this._pitchScroll.clear()
		this._hilbertPitch.clear()
	}

	set fullColor(f){
		this._pitchScroll.fullColor = f
		this._hilbertPitch.fullColor = f
	}

	get fullColor(){
		return this._pitchScroll.fullColor
	}

	drawTo(context){
		this._pitchScroll.drawTo(context, 0, 0)
		this._hilbertPitch.drawTo(context, this.width/2, 0)
		if (this.showGrid){
			this._grid.drawTo(context, 0, 0)
			this._pitchScroll.drawText(context)
		}
	}
}
