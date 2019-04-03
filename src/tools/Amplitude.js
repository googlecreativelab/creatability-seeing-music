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

import { Meter, dbToGain } from 'tone'

export class Amplitude {
	constructor(source){
		this._meter = new Meter(0.01)
		source.connect(this._meter)
	}

	getAmplitude(){
		return Math.pow(dbToGain(this._meter.getLevel()), 0.8)
	}
}
