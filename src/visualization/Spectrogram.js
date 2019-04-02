import { FFT } from 'tone'
import { SpectrumBar } from './SpectrumBar'
import { amp2Color } from '../data/Color'
import { scaleFreq, freqInRange } from '../data/Position'
import { Visualization } from './Visualization'
import { SpectrogramTail } from './SpectrogramTail'
import { Grid } from './Grid'

export class Spectrogram extends Visualization {
	constructor(source){
		super('Spectrogram')

		this._spectrumBar = new SpectrumBar(source)

		this._tail = new SpectrogramTail(source)

		this._source = source

		this.spectrumWidth = 20

		this._grid = new Grid(true)
	}

	set fullColor(b){
		this._fullColor = b
		this._spectrumBar.fullColor = b
		this._tail.fullColor = b
	}

	get fullColor(){
		return this._fullColor
	}

	resize(width, height){
		//pitch scroll starts at the center
		super.resize(width, height)
		this._spectrumBar.resize(this.spectrumWidth, height)
		this._tail.resize(Math.round(width/2), height)
		this._grid.resize(width, height)
	}

	clear(){
		this._tail.clear()
		this._spectrumBar.clear()
	}

	drawTo(context, x, y){
		context.clearRect(0, 0, this.width, this.height)
		const padding = 0
		this._spectrumBar.drawTo(context, this.width/2-padding, y)
		// super.drawTo(context, x, y)
		this._tail.drawTo(context, x, y)

		if (this.showGrid){
			this._grid.drawTo(context, x, y)
		}
	}
}
