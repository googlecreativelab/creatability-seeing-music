import { Meter, dbToGain } from 'tone'

export class Amplitude {
	constructor(source){
		this._meter = new Meter(0.01)
		source.connect(this._meter)
	}

	getAmplitude(){
		return Math.pow(dbToGain(this._meter.getLevel()), 0.8)
	}
}
