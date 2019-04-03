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

import WebMidi from 'webmidi'
import { EventEmitter } from 'events'

export class MidiKeyboard extends EventEmitter {
	constructor(){
		super()

		this.connectedDevices = new Map()

		if (WebMidi.supported){
			this.ready = new Promise((done, error) => {
				WebMidi.enable((e) => {
					if (e){
						error(e)
					}
					WebMidi.inputs.forEach(i => this._addListeners(i))
					WebMidi.addListener('connected', (e) => {
						if (e.port.type === 'input'){
							this._addListeners(e.port)
						}
					})
					WebMidi.addListener('disconnected', (e) => {
						this._removeListeners(e.port)
					})
					done()
				})
			})
		} else {
			this.ready = Promise.resolve()
		}
	}

	_addListeners(device){

		if (!this.connectedDevices.has(device.id)){
			this.connectedDevices.set(device.id, device)

			device.addListener('noteon', 'all', (event) => {
				this.emit('keyDown', `${event.note.name}${event.note.octave}`, event.velocity)
			})
			device.addListener('noteoff', 'all', (event) => {
				this.emit('keyUp', `${event.note.name}${event.note.octave}`, event.velocity)
			})

			device.addListener('controlchange', 'all', (event) => {
				if (event.controller.name === 'holdpedal'){
					this.emit(event.value ? 'pedalDown' : 'pedalUp')
				}
			})
		}

	}

	_removeListeners(event){
		if (this.connectedDevices.has(event.id)){
			const device = this.connectedDevices.get(event.id)
			this.connectedDevices.delete(event.id)
			device.removeListener('noteon')
			device.removeListener('noteoff')
			device.removeListener('controlchange')
			
		}
	}
}
