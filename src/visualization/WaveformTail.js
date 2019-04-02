import { ScrollingVisualization } from './ScrollingVisualization'
import { amp2Color } from '../data/Color'

export class WaveformTail extends ScrollingVisualization {
	constructor(source){
		super('Waveform Tail')
		this._source = source

		this.maxHeight = 200
	}

	resize(width, height){
		super.resize(width/2, height)
		this.maxHeight = window.innerHeight
	}

	draw(context, width, height){
		
		//get the latest values
		const amp = this._source.getAmplitude()

		const ampHeight = Math.pow(amp, 0.8) * this.maxHeight

		this.ampHeight = ampHeight

		if (this.fullColor){
			this.color = amp2Color(amp, false, 0.5)
		} else {
			this.color = `rgba(255, 255, 255, ${amp})`
		}
		context.fillStyle = this.color

		const padding = 20

		context.fillRect(-padding, height/2 - ampHeight/2, width + padding, ampHeight)

	}
}
