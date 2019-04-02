import { Visualization } from './Visualization'
import { PIXELS_PER_SECOND } from '../Config'

export class WrapScrollingVisualization extends Visualization {
	constructor(name){
		super(name)

		this._swapViz = new Visualization('swap')

		//pixels per ms
		// this.scrollSpeed = (10/MS_PER_PIXEL)

		this._lastUpdate = performance.now()

		this._offset = 0

		this._frame = 0
	}

	resize(width, height){
		super.resize(width, height)
		this._swapViz.resize(width, height)
	}

	clear(){
		super.clear()
		this._offset = 0
		this._frame = 0
		this._lastUpdate = performance.now()
	}

	draw(context, width, height){
		context.fillStyle = 'blue'
		context.fillRect(0, 100, width, 100)
	}

	get offset(){
		return this._offset % this.width
	}

	drawTo(context, x, y){
		if (this.width && this.height){
			this._frame++

			//every few frames fade it out slightly)
			if (this._frame % Math.round(this.width / 100) === 0){
				this.context.fillStyle = 'rgba(0, 0, 0, 0.05)'
				this.context.fillRect(0, 0, this.width, this.height)
			}

			//compute the amount of move
			const diff = performance.now() - this._lastUpdate
			this._lastUpdate = performance.now()
			
			//draw something
			const pixels = Math.round(PIXELS_PER_SECOND * (diff / 1000))
			this.context.save()
			this.context.translate(this._offset % this.width, 0)
			if (diff < 100){
				this.draw(this.context, pixels, this.height)
			}
			this.context.restore()
			this._offset += pixels
			context.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)

			/*if (this.round){
				pixels = Math.round(pixels)
			}*/
			//draw the previous canvas onto the swap
			/*this._swapViz.clear()
			this._swapViz.context.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
			//clear the old one
			this.clear()
			//draw onto the end of the swap
			this._swapViz.context.save()
			this._swapViz.context.translate(this.width - pixels, 0)
			this.draw(this._swapViz.context, pixels, this.height)
			this._swapViz.context.restore()

			//draw the whole thing onto the canvas
			this._context.save()
			this._context.translate(-pixels, 0)
			this._context.drawImage(this._swapViz.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
			this._context.restore()*/

			//draw the canvas onto the context
			// context.drawImage(this._swapViz.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
		}

	}
}
