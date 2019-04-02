import { Spectrum } from './Spectrum'
import { Amplitude } from './Amplitude'
import { Pitch } from './Pitch'
import { Midi } from './Midi'
import { Polyphonic } from './Polyphonic'
import { Waveform } from 'tone'

export class Analyser {
	constructor(source){
		this._spectrum = new Spectrum(source)
		this._pitch = new Pitch(source)
		this._amp = new Amplitude(source)
		this._waveform = new Waveform(256)
		this._midi = new Midi()
		this._polyphonic = new Polyphonic()

		source.connect(this._waveform)

		this._source = source

		this._analyses = {}

		this.loop()
	}

	get polyphonic(){
		return this._polyphonic
	}

	//reset the values every frame
	//this makes it so it only grabs one analysis per animation frame
	loop(){
		requestAnimationFrame(this.loop.bind(this))
		Object.keys(this._analyses).forEach(key => {
			this._analyses[key] = -1
		})
	}

	//invoke the callback only if the analysis has not been run this loop
	getAnalysis(name, cb){
		if (this._analyses[name] === -1 || typeof this._analyses[name] === 'undefined'){
			this._analyses[name] = cb()
		}
		return this._analyses[name]
	}
	
	getPitch(){
		return this.getAnalysis('pitch', () => this._pitch.getPitch())
	}

	getSpectrum(){
		return this.getAnalysis('spectrum', () => this._spectrum.getSpectrum())
	}

	getAmplitude(){
		return this.getAnalysis('amp', () => this._amp.getAmplitude())
	}

	getWaveform(){
		return this.getAnalysis('waveform', () => this._waveform.getValue())
	}

	getMidi(){
		return this.getAnalysis('midi', () => this._midi.getMidi())
	}

	getPolyphonic(){
		const polyphonicNotes = this.getAnalysis('notes', () => this._polyphonic.getNotes())
		const midiNotes = this.getMidi()
		return [...midiNotes, ...polyphonicNotes]
	}

	connect(to){
		this._source.connect(to)
	}
}
