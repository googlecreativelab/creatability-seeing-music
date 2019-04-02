import { Visualization } from './Visualization'
import chroma from 'chroma-js'
import { midi2Color } from '../data/Color'
import { scaleMidi, fontStyle } from '../data/Position'
import { Midi } from 'tone'
import { Grid } from './Grid'

const lowestNote = 24
const highestNote = 108

const octaveWidth = scaleMidi(24) - scaleMidi(12)

export class Piano extends Visualization {
	constructor(source){
		super('Piano')

		this._pitchTracker = source

		this._sharps = [1, 3, 6, 8, 10]
		//normalized note offsets
		this._noteOffsets = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(v => v/7)

		this._grid = new Grid()
	}

	resize(width, height){
		super.resize(width, height)
		this._grid.resize(width, height)
	}

	drawTo(context, x, y){
		super.drawTo(context, x, y)
		if (this.showGrid){
			this._grid.drawTo(context, x, y)
		}
	}

	draw(context, width, height){
		/*const { confidence, midi } = this._pitchTracker.getPitch()

		const velocity = Math.clamp(Math.scale(confidence, 0.8, 1, 0, 1), 0, 1)
		const notes = [{ velocity, midi }, ...this._pitchTracker.getPolyphonic()]*/

		const notes = this._pitchTracker.getPolyphonic()

		this.drawPiano(context, width, height, notes)
	}

	drawPiano(context, width, height, notes){
		fontStyle(context)

		context.clearRect(0, 0, width, height)

		for (let octave = 0; octave < this.octaves; octave++){
			this.drawOctave(context, octave, notes)
		}
	}

	get octaves(){
		return Math.floor((highestNote - lowestNote)/12)
	}

	get octaveWidth(){
		return this.height * octaveWidth
	}

	get noteWidth(){
		return this.octaveWidth/7
	}

	get noteHeight(){
		return this.noteWidth * 4
	}

	get pianoWidth(){
		return Math.clamp(this.height / 5, 60, 100)
	}

	drawOctave(context, octave, notes){
		const octaveStartNote = octave * 12 + lowestNote
		const octaveLeft = (scaleMidi(octaveStartNote)) * this.height + this.noteWidth/2
		
		context.fillStyle = 'white'
		context.strokeStyle = 'white'
		context.lineWidth = 2

		this.drawNotes(context, octaveLeft, octaveStartNote, false, notes)
		this.drawNotes(context, octaveLeft, octaveStartNote, true, notes)
	}

	//return the note and confidence
	containsNote(notes, midi){
		const note = notes.find(n => n.midi === midi)
		if (note){
			return note
		} else {
			return false
		}
	}

	drawNotes(context, left, rootNote, sharps, notes){
		const octaveWidth = this.octaveWidth
		const noteHeight = this.noteHeight
		const noteWidth = this.noteWidth
		this._noteOffsets.forEach((offset, index) => {
			const isSharp = this._sharps.includes(index)
			let draw = false
			let drawHeight = noteHeight
			let drawWidth = noteWidth
			if (sharps && isSharp){
				drawHeight *= 0.5
				drawWidth *= 0.75
				draw = true
			} else if (!sharps && !isSharp){
				draw = true
			}
			const midiNote = rootNote + index
			if (draw){
				context.beginPath()
				offset *= octaveWidth
				let drawText = false
				if (this.containsNote(notes, midiNote)){
					const { midi, velocity } = this.containsNote(notes, midiNote)
					
					const opacity = velocity
					const color = chroma.mix('black', this.fullColor ? midi2Color(midiNote) : 'white', opacity).css()
					context.fillStyle = color
					drawText = true
				} else {
					context.fillStyle = 'black'
				}
				const x = Math.round(this.width/2)
				const y = Math.round(this.height - (left + offset))
				context.rect(x, y, Math.round(drawHeight), Math.round(drawWidth))
				context.fill()
				context.stroke()
				if (drawText && this.showGrid){
					context.fillText(Midi(midiNote).toNote(), x + noteHeight + 20, y + noteWidth)
				}
			}
		})
	}
}
