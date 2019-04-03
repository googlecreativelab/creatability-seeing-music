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

import { Upload } from './Upload'
import { Transport, Player, Part, Buffer } from 'tone'
import { FILE_PLAYS_SOUND } from '../Config'
import { EventEmitter } from 'events'
import { Piano } from './Piano'
import WebMidi from 'webmidi'
// const url = 'https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_htk1'
// const url = 'https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni'

Transport.loop = true

function wait(ms){
	return new Promise(done => setTimeout(done, ms))
}

export class Model extends EventEmitter {
	constructor(){

		super()

		this._enabled = false

		/**
		 * The part which plays the transcription
		 */
		this.part = new Part(this._playNote.bind(this)).start(0)

		/**
		 * The loaidng indicator
		 */
		this.loader = document.querySelector('acc-loader')

		this.notes = null

		this._wasPlaying = false

		this.piano = new Piano()

	}

	initialize(){
		document.querySelector('acc-quiet-group').addEventListener('pause', ({ detail }) => {
			if (detail.paused && Transport.state === 'started'){
				this._wasPlaying = true
				Transport.pause()
			} else if (this._wasPlaying){
				Transport.start()
				this._wasPlaying = false
			}
		})

		//stop the audio when teh tutorial screen comes up
		document.querySelector('acc-learn-more-group').addEventListener('tutorial', () => {
			this.clearFile()
		})
	}

	set enabled(e){
		// this.upload.disabled = !e
		if (!this._enabled && e){

			const fallbackTester = document.createElement('acc-fallback')
			if (!fallbackTester.hasWebGL()){
				setTimeout(() => {
					this.emit('error', e)
					document.querySelector('acc-snackbar').setAttribute('message', 'Cannot open WebGL context on this device.')
				}, 100)
				return
			}

			this.loader.setAttribute('label', 'Initializing Transcription Model')
			this.loading = true
			// dynamic imports
			require.ensure(['@magenta/music'], async () => {
				try {
					await this.piano.load()
					const { OnsetsAndFrames } = require('@magenta/music')
					this.model = new OnsetsAndFrames('/assets/model')
					await this.model.initialize()
					this.loading = false
					this._enabled = true
					//add a notification
					if (WebMidi.supported){
						document.querySelector('acc-snackbar').setAttribute('message', 'Choose an audio file to transcribe, or play live with a MIDI keyboard.')
					} else {
						document.querySelector('acc-snackbar').setAttribute('message', 'Choose an audio file to transcribe.')
					}
				} catch (e){
					this.loading = false
					this.emit('error', e)
					console.log(e)
					document.querySelector('#error-snack').setAttribute('message', 'Transcription not supported')
				}
			})
		}

		this.piano.enabled = e

		if (!e){
			this.clearFile()
		}
	}

	_playNote(time, event){
		if (this.notes){
			this.notes.addNote(time, event)
		}
	}

	addNotes(notes){
		//clear the previous notes
		this.part.removeAll()
		if (notes.length){
			const lastEvent = notes[notes.length-1].endTime
			notes.forEach(n => {
				n.time = n.startTime
				n.duration = n.endTime - n.startTime
				n.velocity = n.velocity / 127
				this.part.add(n)
			})
		}
	}

	async setFile(file, url){
		if (this._enabled){
			this.clearFile()
			this.loader.setAttribute('label', 'Transcribing Audio (this might take a while)')
			this.loader.setAttribute('spinner', 'false')
			await wait(100)
			this.loading = true
			try {
				let buffer
				try {
					buffer = await Buffer.fromUrl(url)
				} catch (e){
					throw new Error('could not load file.')
				}
				if (buffer.duration > 30){
					throw new Error('audio file must be under 30 seconds long.')
				}
				const fetchResponse = await fetch(url)
				const blob = await fetchResponse.blob()
				const transcription = await this.model.transcribeFromAudioFile(blob)
				this.player = new Player()
				if (FILE_PLAYS_SOUND){
					this.player.toMaster()
				}
				this.player.buffer = buffer
				this.player.sync().start(0)
				this.addNotes(transcription.notes)
				Transport.loopEnd = buffer.duration
				Transport.start()
			} catch (e){
				this.emit('clear')
				document.querySelector('acc-snackbar').setAttribute('message', e)
				document.querySelector('acc-snackbar').show()
			}
			this.loading = false
		}
	}

	clearFile(){
		this._wasPlaying = false
		if (this.player){
			this.player.dispose()
			this.player = null
		}
		Transport.stop()
		this.part.removeAll()
		if (this.notes){
			this.notes.clear()
		}
	}

	set loading(l){
		if (l){
			this.loader.setAttribute('open', 'true')
		} else {
			this.loader.removeAttribute('open')
			this.loader.setAttribute('spinner', 'true')
		}
	}
}
