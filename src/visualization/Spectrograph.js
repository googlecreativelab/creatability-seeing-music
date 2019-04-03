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

import { SpectrumBar } from './SpectrumBar'
import { Visualization } from './Visualization'
import { Grid } from './Grid'

export class Spectrograph extends Visualization {
	constructor(source){

		super()

		this._spectrumBar = new SpectrumBar(source)
		this._spectrumBar.history = 0.9

		this._grid = new Grid()
	}

	set fullColor(f){
		this._spectrumBar.fullColor = f
	}

	get fullColor(){
		return this._spectrumBar.fullColor
	}

	clear(){
		this._spectrumBar.clear()
	}

	resize(width, height){
		super.resize(width, height)
		this._spectrumBar.resize(width/2, height)
		this._grid.resize(width, height)
	}

	drawTo(context, x, y){
		context.clearRect(0, 0, this.width, this.height)
		this._spectrumBar.drawTo(context, this.width/2, y)		
		//mirror the canvas
		context.save()
		context.translate(this.width, 0)
		context.scale(-1, 1)
		context.drawImage(this._spectrumBar.canvas, this.width/2, 0)
		context.restore()

		if (this.showGrid){
			this._grid.drawTo(context, x, y)
		}
	}
}
