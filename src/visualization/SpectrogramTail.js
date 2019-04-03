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

import { FFT } from 'tone'
import { SpectrumBar } from './SpectrumBar'
import { amp2Color } from '../data/Color'
import { scaleFreq, freqInRange } from '../data/Position'
import chroma from 'chroma-js'
import { ScrollingVisualization } from './ScrollingVisualization'

export class SpectrogramTail extends ScrollingVisualization {
	constructor(source){
		super('Spectrogram')

		this._source = source

		this.round = true
	}

	set fullColor(b){
		this._fullColor = b
	}

	get fullColor(){
		return this._fullColor
	}

	draw(context, width, height){

		const gradient = context.createLinearGradient(0, height, 0, 0)
		//add a color at the beginning and end
		gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
		gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

		//draw all of the bands of the spectrogram corresponding
		this._source.getSpectrum().forEach((val, i, { position }) => {
			let color = null
			// val = Math.pow(val, 2)
			if (this._fullColor){
				color = amp2Color(val)
			} else {
				color = chroma.mix('black', 'white', val)
			}
			gradient.addColorStop(1-position, color)
		})

		const overlap = 50
		context.fillStyle = gradient
		context.fillRect(-overlap, 0, width+overlap*2, height)
	}
}
