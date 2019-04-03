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

import Tone, { Master, Player } from 'tone'
import { EventEmitter } from 'events'
import { FILE_PLAYS_SOUND } from '../Config'
import './file.scss'

export class File extends EventEmitter {
	constructor(){
		super()

		/**
		 * The audio file player
		 */
		this.audioElement = document.createElement('audio')
		this.audioElement.autoplay = true
		this.audioElement.loop = true
		this.audioMediaSource = Tone.context.createMediaElementSource(this.audioElement)
		if (FILE_PLAYS_SOUND){
			this.audioMediaSource.connect(Master)
		}

		this.player = new Player()
		this.player.loop = true
		if (FILE_PLAYS_SOUND){
			this.player.toMaster()
		}

	}

	initialize(){
		this.loader = document.querySelector('acc-loader')

		this.videoGroup = document.body.querySelector('#video-group')

		this.videoElement = this.videoGroup.querySelector('video')
		this.videoMediaSource = Tone.context.createMediaElementSource(this.videoElement)
		if (FILE_PLAYS_SOUND){
			this.videoMediaSource.connect(Master)
		}

		this.videoElement.addEventListener('play', () => {
			this.videoControls.classList.add('playing')
			this.videoControls.setAttribute('aria-pressed', false)
		})

		this.videoElement.addEventListener('pause', () => {
			this.videoControls.classList.remove('playing')
			this.videoControls.setAttribute('aria-pressed', true)
		})

		this.videoControls = this.videoGroup.querySelector('#video-controls')
		this.videoControls.addEventListener('click', () => {
			if (this.videoControls.classList.contains('playing')){
				this.videoElement.pause()
			} else {
				this.videoElement.play()
			}
		})
	}

	set loading(l){
		this.loader.setAttribute('label', 'Loading File')
		if (l){
			this.loader.setAttribute('open', true)
		} else {
			this.loader.removeAttribute('open')
		}
	}

	playFile(url, mediaElement=this.videoElement){
		//stop the previous one
		this.loading = true
		this.stop()
		mediaElement.oncanplaythrough = () => {
			this.loading = false
			if (mediaElement === this.videoElement){
				this.videoGroup.classList.add('playing')
			}
		}

		mediaElement.onerror = async () => {
			mediaElement.src = ''
			//try with a web audio object instead
			if (mediaElement === this.videoElement){
				try {
					await this.player.load(url)
					this.player.start()
					this.loading = false
				} catch (e){
					this._showError('Cannot play file')
				}
			} else {
				this._showError('Cannot load file')
			}
		}

		mediaElement.onload = () => {
			window.URL.revokeObjectURL(url)
		}

		mediaElement.src = url
		mediaElement.load()
		return url
	}

	_showError(e){
		this.loading = false
		const snackbar = document.querySelector('acc-snackbar')
		snackbar.message = e
	}

	pause(){
		if (!this.audioElement.src !== ''){
			this.audioElement.pause()
		}
		if (!this.videoElement.src !== ''){
			this._wasPlaying = this.videoControls.classList.contains('playing')
			this.videoElement.pause()
		}
	}

	play(){
		if (this.audioElement.src !== ''){
			this.audioElement.play()
		}
		if (this.videoElement.src !== '' && this._wasPlaying){
			this.videoElement.play()
		}
	}

	stop(){
		this.audioElement.pause()
		this.videoElement.pause()
		this.player.stop()
		this.videoElement.removeAttribute('src')
		this.audioElement.removeAttribute('src')
		this.videoGroup.classList.remove('playing')
		this.videoControls.classList.remove('playing')
	}

	_readFile(file, url){
		this.stop()
		if (file){

			this.loading = true

			const mediaElement = file.type.includes('audio') ? this.audioElement : this.videoElement

			this.playFile(url, mediaElement)

			this.emit('file', file.name)

		} else {
			this._showError('Error: cannot play this file type')
		}

	}

	connect(node){
		this.audioMediaSource.connect(node)
		this.videoMediaSource.connect(node)
		this.player.connect(node)
	}

}
