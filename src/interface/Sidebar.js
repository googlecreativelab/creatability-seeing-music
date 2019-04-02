import './sidebar.scss'
import { EventEmitter } from 'events'
import { AudioInput } from './AudioInput'
import { html, render } from 'lit-html'
import videoFiles from '../../assets/video/videos.json'
import { Model } from '../piano/Model'
import { FileDrop } from './FileDrop'

export class Sidebar extends EventEmitter {
	constructor(){
		super()

		this.element = document.body.querySelector('acc-side-panel')

		this.fileDrop = new FileDrop()
		this.fileDrop.on('file', this.setFile.bind(this))
		this.fileDrop.on('clear', this.clearFile.bind(this))
		this.fileDrop.on('dropped', () => this.element.dispatchEvent(new CustomEvent('dropped')))

		// render(this._html(), this.element)

		this.audioInputs = new AudioInput(this.element.querySelector('#audioInput'), videoFiles, this.element.querySelector('#mic'), this.fileDrop, this.element.querySelector('#inputSelect'))

		/**
		 * The aggregated audio output
		 */
		this.audio = this.audioInputs.output

		/**
		 * The visualizations
		 */
		this.visualizers = this.element.querySelector('#visualizer')
		this.visualizers.addEventListener('change', e => {
			this._updateOptions()
		})

		//the visualizer drop down
		//the color checkbox
		this.colorCheckbox = this.element.querySelector('#color')
		this.colorCheckbox.addEventListener('change', e => {
			this.color = e.detail.checked
		})

		//the grid checkbox
		this.gridCheckbox = this.element.querySelector('#grid')
		this.gridCheckbox.addEventListener('change', e => {
			this.grid = e.detail.checked
		})

		this.element.addEventListener('skiptocontent', () => document.body.querySelector('#main-canvas').focus())

		/**
		 * THE MAGENTA TRANSCRIPTION MODEL
		 */
		this.model = new Model()
		this.model.on('error', () => {
			this.element.querySelector('#piano-enable').checked = false
			this.element.querySelector('#piano-enable').setAttribute('disabled', '')
		})
		this.model.on('clear', () => this.fileDrop.currentFile = '')

		//add all of the videos into the select
		const remoteUrl = 'https://storage.googleapis.com/gweb-access-music.appspot.com/'
		Object.keys(videoFiles).map(key => {
			const select = this.element.querySelector('#inputSelect')
			const group = document.createElement('acc-optgroup')
			group.setAttribute('label', key)
			select.appendChild(group)
			// const prefix = window.location.href.includes('gweb') ? '' : remoteUrl
			videoFiles[key].map((item, i) => {
				const itemElement = document.createElement('acc-item')
				const url = `/assets/video/${key}/${item}`
				itemElement.setAttribute('url', url)
				itemElement.setAttribute('value', url)
				itemElement.setAttribute('label', `${key} ${(i+1).toString()}`)
				group.appendChild(itemElement)
			})
		})

	}

	initialize(){

		this.audioInputs.initialize()
		this.model.initialize()
		//initially not enabled
		this._polyphonicMode = false
		this.enablePolyphonic = false
		this.element.querySelector('#piano-enable').addEventListener('change', ({ detail }) => this.enablePolyphonic = detail.checked)
		this.element.querySelector('acc-learn-more-group').addEventListener('tutorial', () => this.fileDrop.clear())
		//emit the first option
		setTimeout(() => this.emit('visualization', this.active), 100)
	}

	set enablePolyphonic(enabled){
		if (enabled){
			this.audioInputs.off()
		}

		this._polyphonicMode = enabled

		this.model.enabled = enabled
		this.audioInputs.enabled = !enabled

		this.fileDrop.clear()
		this.model.clearFile()
		this.audioInputs.clearFile()

		document.querySelectorAll('.yesPiano').forEach(el => {
			if (enabled){
				el.removeAttribute('disabled')
			} else {
				el.setAttribute('disabled', true)
			}
		})
		document.querySelectorAll('.noPiano').forEach(el => {
			if (!enabled){
				el.removeAttribute('disabled')
			} else {
				el.setAttribute('disabled', true)
			}
		})
		
		if (enabled){
			const item = document.createElement('acc-item')
			item.label = 'Polyphonic Piano'
			item.id = 'polypiano'
			this._previouslySelected = this.visualizers.selectedIndex
			this.visualizers.appendChild(item)
			//get the last item
			setTimeout(async () => {
				await this.visualizers.updateComplete
				this.visualizers.selectedIndex = this.visualizers.items.length-1
				this._updateOptions()
			}, 1)
		} else {
			const item = this.visualizers.querySelector('#polypiano')
			if (item){
				this.visualizers.removeChild(item)
			}
			if (!isNaN(this._previouslySelected)){
				this.visualizers.selectedIndex = this._previouslySelected
				this._updateOptions()
				this._previouslySelected = null
			}
		}

	}

	setFile(...args){
		if (this._polyphonicMode){
			this.model.setFile(...args)
		} else {
			this.audioInputs.setFile(...args)
		}
	}

	clearFile(){
		if (this._polyphonicMode){
			this.model.clearFile()
		} else {
			this.audioInputs.clearFile()
		}	
	}

	set grid(g){
		if (this._options){
			this._options.forEach(({ viz, grid }) => viz.showGrid = g && grid !== false)
		}
	}

	set color(f){
		if (this._options){
			this._options.forEach(({ viz, color }) => {
				viz.clear()
				viz.fullColor = f
			})
		}
	}

	/**
	 * add visualizer options
	 */
	async addOptions(options){
		this._options = options

		const groups = {}
		options.forEach(({ name, group }) => {
			const element = document.createElement('acc-optgroup')
			element.setAttribute('label', group)
			if (!groups[group]){
				groups[group] = element
				this.visualizers.appendChild(element)
			}
		})

		//add the items to the corresponding group
		options.forEach(({ name, group, hide, alt }) => {
			const element = document.createElement('acc-item')
			element.label = name
			element.setAttribute('value', name.split(' ').join(''))
			element.setAttribute('description', alt)
			if (!hide){
				if (groups[group]){
					groups[group].appendChild(element)
				} else {
					this.visualizers.appendChild(element)
				}
			}
		})
		await this.visualizers.updateComplete
		this._updateOptions(this._options[0].name)
		//initially set the values
		this.grid = this.gridCheckbox.checked
		this.color = true
	}

	/**
	 * The selected name
	 */
	set active(name){
		// this.visualizers.value = name
		// this._updateOptions(name)
	}

	get active(){
		return this._options[this.visualizers.selectedIndex]
	}

	async _updateOptions(){
		// await this.visualizers.updateComplete
		const selected = this.active

		if (!selected){
			return
		}

		//clear it initially
		selected.viz.clear()

		//enable/disable the color checkbox
		if (selected.color === false){
			this.colorCheckbox.setAttribute('disabled', true)
		} else {
			this.colorCheckbox.removeAttribute('disabled')
		}
		//enable/disable the grid checkbox
		if (selected.grid === false){
			this.gridCheckbox.setAttribute('disabled', true)
		} else {
			this.gridCheckbox.removeAttribute('disabled')
		}

		this.emit('visualization', selected)
	}
}
