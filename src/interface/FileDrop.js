import { EventEmitter } from 'events'
import './file.scss'
import toHtml from 'string-to-dom'
import Tone, { Buffer } from 'tone'
import FileReader from 'promise-file-reader'
import dragDrop from 'drag-drop'

export class FileDrop extends EventEmitter {
	constructor(returnType='url'){
		super()

		this.returnType = returnType

		this.element = document.body.querySelector('#file-drop')
		this.button = this.element.querySelector('#uploadButton')
		this.status = this.element.querySelector('#uploadedFile')
		/**
		 * DRAG DROP HANDLING
		 */
		dragDrop('body', (files) => {
			const file = files[0]
			this._getFile(file)
			
		})

		/**
		 * FILE UPLOAD BUTTON CLICK
		 */
		this.fileDialog = this.element.querySelector('.file-input')
		this.fileDialog.addEventListener('change', e => {
			// console.log(e)
			if (e.target.files && e.target.files[0]){
				this._getFile(e.target.files[0])
			}
		})

		this.button.addEventListener('click', () => this.openDialog())
		this.status.addEventListener('click', () => {
			this.clear()
			this.emit('clear')
		})

		this.on('file', f => this.currentFile = f.name)

		this.on('error', e => {
			document.querySelector('acc-snackbar').message = e
			document.querySelector('acc-snackbar').show()
			this.clear()
		})
	}

	openDialog(){
		this.fileDialog.click()
	}

	clear(){
		this.fileDialog.value = ''
		this.currentFile = ''
	}

	get value(){
		return this.fileDialog.value
	}

	set value(v){
		this.fileDialog.value = v
	}

	set currentFile(f){
		const uploadedFile = this.status
		if (f === ''){
			uploadedFile.textContent = 'no file chosen'
			uploadedFile.classList.add('nofile')
			uploadedFile.setAttribute('aria-label', 'no chosen file')
			uploadedFile.setAttribute('tabindex', '-1')
			uploadedFile.setAttribute('role', 'status')
		} else {
			uploadedFile.textContent = f
			uploadedFile.setAttribute('tabindex', '0')
			uploadedFile.classList.remove('nofile')
			uploadedFile.setAttribute('aria-label', `clear uploaded file ${f}`)
			uploadedFile.setAttribute('role', 'button')
		}
	}

	_canPlayFile(f){
		const audio = document.createElement('audio')
		return audio.canPlayType(f.type) !== ''
	}

	async _getFile(f){
		this.emit('dropped')
		if (this._canPlayFile(f)){
			if (this.returnType === 'url'){
				const src = window.URL.createObjectURL(f)
				this.emit('file', f, src)
			} else {
				const results = await FileReader.readAsArrayBuffer(f)
				const buffer = await Tone.context.decodeAudioData(results)
				this.emit('file', f, buffer)
			}
		} else {
			this.emit('error', `Sorry cannot play file type ${f.name}.`)
		}
	}
}
