import { Visualization } from './Visualization'
import { scaleMidi } from '../data/Position'
import { Midi } from 'tone'
import { PIXELS_PER_SECOND } from '../Config'

export class Grid extends Visualization {
	constructor(){
		super()

		this.padding = 10
		this.lineWidth = 2
		this.dashLen = 5
	}

	draw(context, width, height){

		context.clearRect(0, 0, width, height)
		context.fillStyle = 'white'
		context.font = '12px sans-serif'

		//draw a white bar along the right side
		context.fillRect(width - this.padding, this.padding, this.lineWidth, height - this.padding * 2)

		//draw the number text
		this.drawNote('C2', context, width, height)
		this.drawNote('C4', context, width, height)
		this.drawNote('C6', context, width, height)
		this.drawNote('C8', context, width, height)
	}

	drawNote(note, context, width, height){
		context.textAlign='right'
		context.textBaseline='bottom' 
		const y = height - scaleMidi(Midi(note).toMidi()) * height
		context.fillStyle = 'white'
		context.fillText(note, width - this.padding - this.dashLen, y)		
		// context.fillRect(width - this.padding - this.dashLen, y, this.dashLen, this.lineWidth)

		//fill a faint line all the way across
		context.fillStyle = 'rgba(255, 255, 255, 0.1)'
		context.fillRect(this.padding, y, width - this.padding*2, this.lineWidth)
	}
}
