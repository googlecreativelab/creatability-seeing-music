import { OnionSkinVisualization } from './OnionSkinVisualization'
import { amp2Color } from '../data/Color'
import chroma from 'chroma-js'

export class SpectrumBar extends OnionSkinVisualization {
	constructor(source){
		super('Spectrum Bar')

		this._source = source

		this.history = 0

	}

	draw(context, width, height){

		if (!height){
			return
		}

		//generate the gradient
		const gradient = context.createLinearGradient(0, height, 0, 0)
		gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
		gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
		this._source.getSpectrum().forEach((val, index, { position }) => {
			let color = null
			if (this.fullColor){
				color = amp2Color(val)
			} else {
				color = chroma.mix('black', 'white', val)
			}
			if (position > 0){
				gradient.addColorStop(1 - position, color)
			}
		})

		context.fillStyle = gradient

		//draw the bars
		context.beginPath()
		context.moveTo(0, height)
		this._source.getSpectrum().forEach((val, index, { centerPosition }) => {
			const barWidth = val * this.width
			if (barWidth > 1){
				context.lineTo(barWidth, Math.round(centerPosition * height))
			}
		})
		context.lineTo(0, 0)
		context.closePath()
		context.fill()
	} 
}
