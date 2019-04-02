import { WrapScrollingVisualization } from './WrapScrollingVisualization'
import { SpectrogramTail } from './SpectrogramTail'
import { Grid } from './Grid'

export class WrapSpectrogram extends WrapScrollingVisualization {
	constructor(source){
		super()
		this._spectrogram = new SpectrogramTail(source)
		this._grid = new Grid(true, true, true)
	}

	set fullColor(c){
		this._spectrogram.fullColor = c
	}

	get fullColor(){
		return this._spectrogram.fullColor
	
	}

	clear(){
		super.clear()
		this._spectrogram.clear()
	}

	resize(width, height){
		super.resize(width, height)
		this._spectrogram.resize(width, height)
		this._grid.resize(width, height)
	}

	draw(context, width, height){
		this._spectrogram.resize(width, height)
		this._spectrogram.drawTo(context, 0, 0)

	}

	drawTo(context, x, y){
		context.clearRect(0, 0, this.width, this.height)
		super.drawTo(context, x, y)
		if (this.showGrid){
			this._grid.drawTo(context, 0, 0)
		}
	}
}
