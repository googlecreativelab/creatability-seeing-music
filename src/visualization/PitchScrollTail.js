import { ScrollingVisualization } from './ScrollingVisualization'
import { scaleFreq, scaleMidi } from '../data/Position'
import { freq2Color, midi2Color } from '../data/Color'
// import chroma from 'chroma-js'

export class PitchScrollTail extends ScrollingVisualization {
	constructor(source){
		super('Pitch Scroll')
		this._pitchTracker = source

		this._lastPos = [-1, -1]

		this.thickness = 0

		this.round = true

		this.midiOnly = false
	}

	resize(width, height){
		//pitch scroll starts at the center
		super.resize(Math.round(width/2), height)
	}

	draw(context, width, height){

		if (!this.midiOnly){
			
			const { frequency, confidence, midi } = this._pitchTracker.getPitch()

			const startX = -width

			this.midi = midi

			if (midi > 0){
				const yPos = Math.scale(scaleFreq(frequency), 0, 1, height, 0)
				const opacity = Math.clamp(Math.scale(confidence, 0.8, 1, 0, 1), 0, 1)
				const thickness = Math.scale(Math.pow(opacity, 3), 0, 1, 3, 16)
				if (this.fullColor){
					context.fillStyle = freq2Color(frequency).css()
				} else {
					context.fillStyle = 'white'
				}

				const newY0 = Math.round(yPos - thickness/2)

				this.thickness = thickness
				this.y = yPos
				this.color = context.fillStyle

				if (this._lastPos[0] === -1 || Math.abs(this._lastPos[0] - yPos) > 20){
					context.fillRect(startX, newY0, width, thickness)
				} else {
					//draw a parallelagram between the last points to the current points
					const [y0, y1] = this._lastPos
					context.beginPath()
					context.moveTo(startX, y0)
					context.lineTo(width, newY0)
					context.lineTo(width, newY0 + thickness)
					context.lineTo(startX, y1)
					context.lineTo(startX, y0)
					context.fill()
				}
				this._lastPos = [newY0, newY0 + thickness]

			} else {
				this._lastPos = [-1, -1]
				this.thickness = 0
			}
			
		} else {
			this.drawMidi(context, width, height)
		}

	} 

	drawMidi(context, width, height){
		const notes = this._pitchTracker.getPolyphonic()
		notes.forEach(({ midi, velocity }) => {
			const yPos = Math.scale(scaleMidi(midi), 0, 1, height, 0)
			const thickness = Math.scale(velocity, 0, 1, 3, 20)
			// const color = chroma.mix('black', this.fullColor ? midi2Color(midiNote) : 'white', velocity).css()
			if (this.fullColor){
				context.fillStyle = midi2Color(midi).css()
			} else {
				context.fillStyle = 'white'
			}
			context.fillRect(-width, yPos - thickness/2, width*2, thickness)
		})
	}
}
