import { Visualization } from './Visualization'
import { amp2Color } from '../data/Color'

export class AmplitudeBar extends Visualization {
	constructor(source){
		super('Amplitude Bar')
		this._source = source
	}

	resize(width, height){
		super.resize(width, height)
	}

	draw(context, width, height){
		const max = 20
		context.clearRect(0, 0, width, height)
		const amp = this._source.getAmplitude()
		const barWidth = Math.scale(amp, 0, 2, 1, max)
		context.fillStyle = this.fullColor ? amp2Color(amp) : 'white'
		context.fillRect(width/2 - barWidth/2, 0, barWidth, height)
	} 
}
