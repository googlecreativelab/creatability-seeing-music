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

import { Hilbert } from './Hilbert'
import { Visualization } from './Visualization'
import { freq2Color } from '../data/Color'
import { scaleFreq, fontStyle } from '../data/Position'
import { Grid } from './Grid'
import { Frequency } from 'tone'

export class HilbertPitch extends Visualization {
	constructor(source){
		super('Pitch following Hilbert Scope')

		this._hilbert = new Hilbert(source)

		this._source = source

		this._lastFreq = 0.5

		this.color = true

		this._grid = new Grid()

		this.history = 0.7
	}

	set history(h){
		this._hilbert.history = h
	}

	get history(){
		return this._hilbert.history
	}

	resize(width, height){
		super.resize(width, height)
		//compute the size of the hilbert
		const size = Math.clamp(width * 5, 100, 500)
		this._hilbert.resize(size, size)
		this._grid.resize(width, height)
	}

	drawTo(context, x=this.width/2, y=0){

		const { frequency, confidence } = this._source.getPitch()

		this.clear()

		// context.globalAlpha = Math.scale(confidence, 0.5, 1, 0, 1)

		//map the midi to the height
		let yPos = this._lastFreq * this.height
		if (frequency !== -1){
			const scaledY = (1 - scaleFreq(frequency))
			yPos = scaledY * this.height
			this._lastFreq = scaledY
		}

		this._hilbert.color = this.fullColor ? freq2Color(frequency) : '#aaa'

		this._hilbert.drawTo(context, Math.round(x - this._hilbert.width/2), yPos - this._hilbert.height/2)
		context.globalAlpha = 1

		if (this.showGrid){
			this._grid.drawTo(context, 0, y)

			if (frequency > 0){
				fontStyle(context)
				context.fillStyle = this._hilbert.color
				context.textBaseline = 'middle'
				context.fillText(Frequency(frequency).toNote(), this.width * 0.6, yPos)
			}
		}
	}
}
