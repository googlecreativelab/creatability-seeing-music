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

import { OnionSkinVisualization } from './OnionSkinVisualization'
import { amp2Color } from '../data/Color'

export class Oscilloscope extends OnionSkinVisualization {
	constructor(source){
		super('Oscilloscope')

		this._source = source

		this.history = 0.85

		this.fullColor = false
	}

	draw(context, width, height){
		
		//get the latest values
		const values = this._source.getWaveform()

		const oscWidth = Math.clamp(width * 0.4, 300, 600)

		context.beginPath()
		values.forEach((v, i) => {
			const percent = 0.25
			const x = Math.scale(i, 0, values.length, 0, width)
			const y = Math.scale(values[i], -1, 1, height * (0.5 - percent), height * (0.5 + percent))
			if (i === 0){
				context.moveTo(x, y)
			} else {
				context.lineTo(x, y)
			}
		})
		context.lineWidth = 3
		/*if (this.fullColor){
			context.strokeStyle = amp2Color(this._source.getAmplitude(), true)
		} else {
		}*/
		context.strokeStyle = 'white'
		context.stroke()
	}
}
