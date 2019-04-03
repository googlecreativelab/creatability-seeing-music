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
import { amp2Color } from '../data/Color'

export class HilbertAmplitude extends Hilbert {
	constructor(source){
		super(source)

		this.history = 0.85
	}

	draw(context, width, height){

		if (this.fullColor){
			const amp = this._source.getAmplitude()
			this.color = amp2Color(amp, false, 0.5).css()
		} else {
			this.color = 'white'
		}

		super.draw(context, width, height)
	}
}
