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
