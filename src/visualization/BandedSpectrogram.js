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

import { ScrollingVisualization } from './ScrollingVisualization'

export class BandedSpectrogram extends ScrollingVisualization {
	constructor(source){
		super('Banded Spectrogram')

		this._source = source
	}

	draw(context, width, height){
		const band1 = 500
		const band2 = 1200
		const bandEnergy = [{ value : 0, count : 0 }, { value : 0, count : 0 }, { value : 0, count : 0 }]
		this._source.getSpectrum().forEach((value, index, { frequency }) => {
			let bandNumber = 0
			if (band1 < frequency){
				bandNumber = 0
			} else if (band1 < frequency && frequency < band2){
				bandNumber = 1
			} else {
				bandNumber = 2
			}
			bandEnergy[bandNumber].value += value
			bandEnergy[bandNumber].count++
		})	
		const bandValues = bandEnergy.map(({ value, count }) => value / count)
		console.log(bandValues)
	}
}
