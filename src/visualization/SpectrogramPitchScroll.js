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
import { Spectrogram } from './Spectrogram'
import { Grid } from './Grid'

export class SpectrogramPitchScroll {
	constructor(source){
		this._pitchScroll = new PitchScroll(source)
		this._pitchScroll.fullColor = true
		this._spectrogram = new Spectrogram(source)
		this._spectrogram.fullColor = false
		this._grid = new Grid(true)
	}

	resize(width, height){
		this._pitchScroll.resize(width, height)
		this._spectrogram.resize(width, height)
		this._grid.resize(width, height)
	}

	clear(){
		this._pitchScroll.clear()
		this._spectrogram.clear()
	}

	drawTo(context, width, height){
		context.globalAlpha = 0.85
		this._spectrogram.drawTo(context, width, height)
		context.globalAlpha = 1
		this._pitchScroll.drawTo(context, width, height)

		if (this.showGrid){
			this._grid.drawTo(context, 0, 0)

			this._pitchScroll.drawText(context)
		}
	}
}
