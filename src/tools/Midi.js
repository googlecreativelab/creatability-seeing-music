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

import { MidiKeyboard } from '../piano/Keyboard'
import { Midi as ToneMidi } from 'tone'

export class Midi {
	constructor(){

		this._notes = []

		this._keyboard = new MidiKeyboard()
		this._keyboard.on('keyDown', (note, velocity) => {
			const midi = ToneMidi(note).toMidi()
			this._notes.push({ velocity, midi })
		})

		this._keyboard.on('keyUp', (note, velocity) => {
			const midiNum = ToneMidi(note).toMidi()
			this._notes = this._notes.filter(({ midi }) => midi !== midiNum)
		})

	}

	getMidi(){
		return this._notes
	}
}
