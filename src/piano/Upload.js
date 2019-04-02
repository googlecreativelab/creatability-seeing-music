import { EventEmitter } from 'events'
import Tone, { Buffer } from 'tone'
import FileReader from 'promise-file-reader'
import { html, render } from 'lit-html'
import { FileDrop } from '../interface/FileDrop'

export class Upload extends EventEmitter {
	constructor(){
		super()

		this.fileDrop = new FileDrop('buffer')
		this.fileDrop.on('dropped', () => this.emit('dropped'))
		this.fileDrop.on('file', this._readFile.bind(this))
	}

	click(){
		this.fileDrop.openDialog()
	}

	_readFile(file, buffer){
		this.emit('buffer', buffer)
	}

	set disabled(d){
		this.fileDrop.disabled = d
	}

	get buttonElement(){
		return this.fileDrop.element
	}
}
