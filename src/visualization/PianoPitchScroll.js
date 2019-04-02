import { PitchScroll } from './PitchScroll'
import { Piano } from './Piano'
import { Grid } from './Grid'

export class PianoPitchScroll {
	constructor(source){
		this._pitchScroll = new PitchScroll(source)
		this._pitchScroll.midiOnly = true
		this._piano = new Piano(source)
		this._grid = new Grid(true)
	}

	//assumes the entire canvas is passed in
	resize(width, height){
		this.width = width
		this.height = height
		this._piano.resize(width, height)
		this._pitchScroll.resize(width, height)
		this._grid.resize(width, height)
	}

	clear(){
		this._pitchScroll.clear()
		this._piano.clear()
	}

	set fullColor(f){
		this._piano.fullColor = f
		this._pitchScroll.fullColor = f
	}

	get fullColor(){
		return this._piano.fullColor
	}

	set showGrid(s){
		this._piano.showGrid = s
	}

	get showGrid(){
		return this._piano.showGrid
	}

	drawTo(context){
		context.clearRect(0, 0, this.width, this.height)
		this._pitchScroll.drawTo(context, 0, 0)
		this._piano.drawTo(context, 0, 0)
		if (this.showGrid){
			this._grid.drawTo(context, 0, 0)
		}
	}
}
