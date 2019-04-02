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
