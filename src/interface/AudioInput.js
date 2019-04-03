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

import { Gain } from 'tone'
import { File } from './File'
import { Microphone } from './Mic'

export class AudioInput {
	constructor(selectGroup, audioFiles, mic, fileDrop, inputSelect){
		this.output = new Gain()

		this.selectGroup = selectGroup
		this.audioFiles = audioFiles
		this.fileDrop = fileDrop

		/**
		 * Respond to radio selection
		 */
		this.select = inputSelect

		/**
		 * The microphone input
		 */
		this.mic = new Microphone(mic)
		this.mic.on('open', () => this._select('None'))		
		this.mic.connect(this.output)

		/**
		 * File selection and playback
		 */
		this.file = new File()
	}

	initialize(){
		this.file.initialize()
		this.file.connect(this.output)
		document.querySelector('acc-quiet-group').addEventListener('pause', ({ detail }) => {
			if (detail.paused){
				this.pause()
			} else {
				this.play()
			}
		})
		//stop the audio when teh tutorial screen comes up
		document.querySelector('acc-learn-more-group').addEventListener('tutorial', () => {
			this.clearFile()
		})

		this.select.addEventListener('change', e => {
			this._select(e.detail.value)
		})
	}

	async _select(item){

		if (item === 'None'){
			this.file.stop()
			this.mic.open()
			this.select.selectedIndex = 0
			this.fileDrop.clear()
		} else if (item === 'Upload File'){
			//disable the mic
			this.mic.close()
			this.select.selectedIndex = 0
		} else {
			this.mic.close()
			if (item){
				this.fileDrop.clear()
				this.file.playFile(item)
			}
		}
	}

	pause(){
		this.file.pause()
	}

	play(){
		this.file.play()
	}

	off(){
		this.file.stop()
		// this.file.fileDrop.clear()
		this.select.selectedIndex = 0
		this.mic.disabled = false
	}

	setFile(f, url){
		this.file._readFile(f, url)
		this._select('Upload File')
	}

	clearFile(){
		this.file.stop()
		this._select('None')
	}
}
