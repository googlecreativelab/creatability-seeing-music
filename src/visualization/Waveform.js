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
import { WaveformTail } from './WaveformTail'
import { Grid } from './Grid'

export class Waveform extends Visualization {
	constructor(source){
		super('Waveform')

		this._tail = new WaveformTail(source)

		this._grid = new Grid(true, false)
	}

	resize(width, height){
		super.resize(width, height)
		this._tail.resize(width, height)
		this._grid.resize(width, height)
	}

	set fullColor(f){
		this._tail.fullColor = f
	}

	get fullColor(){
		return this._tail.fullColor
	}

	clear(){
		this._tail.clear()
	}

	drawTo(context, x, y){

		this._tail.drawTo(context, x, y)
		
		// context.height = 
		context.fillStyle = this._tail.color
		const height = this._tail.ampHeight + 20
		const width = Math.scale(height, 0, 100, 2, 8)
		context.fillRect(this.width/2 - width/2, this.height/2 - height/2, width, height)

		if (this.showGrid){
			this._grid.drawTo(context, x, y)
		}
	}
}
