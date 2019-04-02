//base class for visualization
export class Visualization {
	constructor(name){
		this._canvas = document.createElement('canvas')

		this._context = this._canvas.getContext('2d')

		//when the update was last invoked
		this._lastUpdate = performance.now()

		this.name = name
	}

	get opacity(){
		return this._context.globalAlpha
	}

	set opacity(o){
		this._context.globalAlpha = o
	}

	get canvas(){
		return this._canvas
	}

	get context(){
		return this._context
	}

	clear(){
		this._context.clearRect(0, 0, this.width, this.height)
	}

	resize(width, height){
		this.width = width
		this.height = height
		this._canvas.width = this.width
		this._canvas.height = this.height
	}

	//override
	draw(){}

	drawTo(context, x=0, y=0){
		this.draw(this._context, this.width, this.height)
		context.drawImage(this.canvas, x, y, this.width, this.height)
	}
}
