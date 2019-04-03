/**
 * Copyright 2019 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 3 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 */

import { UserMedia } from 'tone'
import { EventEmitter } from 'events'

function wait(ms){
	return new Promise(done => setTimeout(done, ms))
}

export class Microphone extends EventEmitter {
	constructor(element){
		super()

		this.element = element

		this.userMedia = this.output = new UserMedia()

		if (!UserMedia.supported){
			this.element.classList.remove('noPiano')
			this.disabled = true
		}

		this._initialized = false

		this.element.addEventListener('change', () => {
			if (!this._initialized){
				return
			}
			if (this.element.checked && !this.element.disabled){
				this.open()
			} else {
				this.close()
			}
		})

		window.addEventListener('modal-close', () => {
			//open it initially
			if (!this._initialized){
				this._initialized = true
				if (UserMedia.supported){
					this.open()
				} else {
					this.disabled = true
				}
			} 
		})

	}

	async open(){
		if (this.state !== 'started' && UserMedia.supported && !this.disabled && this._initialized){
			try {
				document.querySelector('acc-snackbar').setAttribute('message', 'Please allow access to your microphone.')
				await wait(100)
				await this.userMedia.open()
				if (!this.element.checked){
					this.element.checked = true
				}
				this.emit('open')
				document.querySelector('acc-snackbar').hide()
			} catch (e){
				this.disabled = true
				this.element.checked = false
				document.querySelector('acc-snackbar').hide()
				setTimeout(() => {
					document.querySelector('#error-snack').setAttribute('message', 'Could not open microphone. You may have denied access.')
				}, 500)
			}
		} else {
			return Promise.resolve()
		}
	}

	get state(){
		return this.userMedia.state
	}

	set disabled(d){
		if (!UserMedia.supported){
			this.element.disabled = true
			this.element.checked = false
		} else if (d){
			this.userMedia.close()
			this.element.disabled = true
		} else {
			if (this.element.checked){
				this.open()				
			}
			this.element.disabled = false
		}
	}

	get disabled(){
		return this.element.disabled
	}

	close(){
		this.element.checked = false
		return this.userMedia.close()
	}

	connect(node){
		this.userMedia.connect(node)
	}
}
