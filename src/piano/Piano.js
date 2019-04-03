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

import { MidiKeyboard } from './Keyboard'
import { Sampler, immediate } from 'tone'

export class Piano {
	constructor(){
		this.keyboard = new MidiKeyboard()
		this.keyboard.on('keyDown', (e, v) => {
			if (this._enabled){
				this._sampler.triggerAttack(e, immediate(), v)
			}
		})
		this.keyboard.on('keyUp', (e, v) => {
			if (this._enabled){
				this._sampler.triggerRelease(e)
			}
		})
		this._loaded = false
		this._enabled = false
	}

	async load(){
		const baseUrl = '/assets/audio/piano/'
		await new Promise(onload => {
			this._sampler = new Sampler({
				C1 : 'C1.mp3',
				'D#1' : 'Ds1.mp3',
				'F#1' : 'Fs1.mp3',
				A1 : 'A2.mp3',
				C2 : 'C2.mp3',
				'D#2' : 'Ds2.mp3',
				'F#2' : 'Fs2.mp3',
				A2 : 'A2.mp3',
				C3 : 'C3.mp3',
				'D#3' : 'Ds3.mp3',
				'F#3' : 'Fs3.mp3',
				A3 : 'A3.mp3',
				C4 : 'C4.mp3',
				'D#4' : 'Ds4.mp3',
				'F#4' : 'Fs4.mp3',
				A4 : 'A4.mp3',
				C5 : 'C5.mp3',
				'D#5' : 'Ds5.mp3',
				'F#5' : 'Fs5.mp3',
				A5 : 'A5.mp3',
				C6 : 'C6.mp3',
				'D#6' : 'Ds6.mp3',
				'F#6' : 'Fs6.mp3',
				A6 : 'A6.mp3',
				C7 : 'C7.mp3',
				'D#7' : 'Ds7.mp3',
				'F#7' : 'Fs7.mp3',
				A7 : 'A7.mp3',
			}, {
				onload, baseUrl,
				release : 0.4,
				attack : 0,
				curve : 'exponential',
				volume : 3
			}).toMaster()
		})
		this._loaded = true
		return
	}

	set enabled(e){
		this._enabled = e
		if (!e && this._loaded){
			this._sampler.releaseAll()
		}
	}
}
