//modified from https://github.com/conundrumer/audioscope

import Tone, { Waveform, Gain } from 'tone'

export class HilbertScope {
	constructor(length=1024){
		this.length = length
		this.input = new Gain()

		this._time = new Waveform(length)
		this._quad = new Waveform(length)

		const [delay, hilbert] = this._createFilers()
		this.input.connect(delay)
		this.input.connect(hilbert)
		hilbert.connect(this._time)
		delay.connect(this._quad)
	}

	_createFilers(){
		let filterLength = 768
		// let filterLength = FFT_SIZE - N
		if (filterLength % 2 === 0){
			filterLength -= 1
		}
		let impulse = new Float32Array(filterLength)

		let mid = ((filterLength - 1) / 2) | 0

		for (let i = 0; i <= mid; i++){
			// hamming window
			let k = 0.53836 + 0.46164 * Math.cos(i * Math.PI / (mid + 1))
			if (i % 2 === 1){
				let im = 2 / Math.PI / i
				impulse[mid + i] = k * im
				impulse[mid - i] = k * -im
			}
		}

		let impulseBuffer = Tone.context.createBuffer(2, filterLength, Tone.context.sampleRate)
		impulseBuffer.copyToChannel(impulse, 0)
		impulseBuffer.copyToChannel(impulse, 1)
		let hilbert = Tone.context.createConvolver()
		hilbert.normalize = false
		hilbert.buffer = impulseBuffer

		let delayTime = mid / Tone.context.sampleRate
		let delay = Tone.context.createDelay(delayTime)
		delay.delayTime.value = delayTime

		return [delay, hilbert]
	}

	getValues(){
		const x = this._time.getValue()
		const y = this._quad.getValue()
		return [x, y]
	}
}
