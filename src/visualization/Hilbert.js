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
import { HilbertScope } from '../../third_party/audioscope/Audioscope'
import { Sigmoid } from '../tools/Sigmoid'
import { detect } from 'detect-browser'

export class Hilbert extends OnionSkinVisualization {
	constructor(source){

		super('Hilbert Scope')

		//safari runs slower, to gets less segments
		this._scope = new HilbertScope(detect().name === 'safari' ? 256 : 1024)

		source.connect(this._scope)

		this.history = 0.95

		this._sigmoid = Sigmoid(7)

		this.color = 'white'
		
		this._source = source
	}

	//scales the value in a sigmoid way so it doesn't clip along the edges
	_scaleVal(val){
		const scaledVal = Math.scale(val, -3, 3, 0, 1)
		return Math.scale(this._sigmoid(scaledVal), 0, 1, -1, 1)
	}

	draw(context, width, height){
		const [xVals, yVals] = this._scope.getValues()

		const amp = this._source.getAmplitude()

		context.beginPath()
		context.lineWidth = Math.scale(amp, 0, 1, 2, 10)
		xVals.forEach((x, i) => {
			let y = yVals[i]
			const centerX = width/2
			const centerY = height/2
			const scalar = height/2
			x = this._scaleVal(x) * scalar + centerX
			y = this._scaleVal(y) * scalar + centerY
			if (i === 0){
				context.moveTo(x, y)
			} else {
				context.lineTo(x, y)
			}
		})
		context.strokeStyle = this.color
		context.stroke()
	}
}
