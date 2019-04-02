import { PRODUCTION } from './Config'
import { render, html } from 'lit-html'

/**
 * All the visualizations
 */
import { HilbertAmplitude } from './visualization/HilbertAmp'
import { HilbertPitch } from './visualization/HilbertPitch'
import { HilbertPitchScroll } from './visualization/HilbertPitchScroll'
import { PianoPitchScroll } from './visualization/PianoPitchScroll'
import { SpectrogramPitchScroll } from './visualization/SpectrogramPitchScroll'
import { Spectrogram } from './visualization/Spectrogram'
import { Spectrograph } from './visualization/Spectrograph'
import { Waveform } from './visualization/Waveform'
import { Oscilloscope } from './visualization/Oscilloscope'
import { WrapPitchScroll } from './visualization/WrapPitchScroll'
import { WrapSpectrogram } from './visualization/WrapSpectrogram'

/**
 * CANVAS
 */
export const canvas = document.body.querySelector('#main-canvas')

const context = canvas.getContext('2d')

export function initializeVisualizations(sidebar, source){

	const visualizations = [
		//MELODIC
		{
			name : 'Hilbert + Melody',
			viz : new HilbertPitchScroll(source),
			group : 'Melodic',
			alt : 'The hilbert scope is a circular, squiggly object whose size and shape follow the volume and timbre of the sound. The hilbert scope moves up and down with pitch leaving a trace showing the pitch history which moves from the center of the screen towards the left'
		},
		{
			name : 'Hilbert Scope',
			viz : new HilbertAmplitude(source),
			grid : false,
			group : 'Melodic',
			alt : 'The hilbert scope is a circular, squiggly object whose size and shape follow the volume and timbre of the sound'
		},
		/*{
		name : 'Hilbert + Pitch',
		viz : new HilbertPitch(source),
		group : 'Melodic',
		alt : 'The hilbert scope is a circular, squiggly object whose size and shape follow the volume and timbre of the sound. The hilbert scope moves up and down with pitch. Higher pitch is higher on the screen'
	},*/
		{
			name : 'Hilbert Painter',
			viz : new WrapPitchScroll(source),
			group : 'Melodic',
			alt : 'The hilbert scope is a circular, squiggly object whose size and shape follow the volume and timbre of the sound. The hilbert scope moves up and down with pitch leaving a trace showing the pitch history which wraps around the screen from left to right'
		},
		/*{
		name : 'Piano + Meldoy',
		viz : new PianoPitchScroll(source),
		group : 'Melodic',
		alt : 'Recognized notes are highlighted on a piano keyboard. The active note leaves a trace showing the pitch history which moves from the center of the screen towards the left'
	},*/
		/*{
	name : 'Piano',
	viz : new Piano(source),
	group : 'Melodic'
},*/
		//HARMONIC
		{
			name : 'Spectrograph',
			viz : new Spectrograph(source),
			group : 'Harmonic',
			alt : 'The current amplitude of the sound at each frequency is represented by a color shift from black (silence) at that frequency to red (loud) and the width at that position on the screen. Higher pitch is higher on the screen'
		},
		{
			name : 'Spectrogram',
			viz : new Spectrogram(source),
			group : 'Harmonic',
			alt : 'The current amplitude of the sound at each frequency is represented by a color shift from black (silence) at that frequency to red (loud) which moves from the center of the screen towards to the left. Higher pitch is higher on the screen'
		},
		{
			name : 'Spectrogram + Melody',
			viz : new SpectrogramPitchScroll(source),
			group : 'Harmonic',
			color : false,
			alt : 'The current amplitude of the sound at each frequency is represented by a color shift from black (silence) at that frequency to white (loud) which moves from the center of the screen towards to the left. The tracked frequency is highlighted in color. Higher pitch is higher on the screen'
		},
		{
			name : 'Spectrogram Painter',
			viz : new WrapSpectrogram(source),
			group : 'Harmonic',
			alt : 'The current amplitude of the sound at each frequency is represented by a color shift from black (silence) at that frequency to red (loud) which wraps around the screen from left to right. Higher pitch is higher on the screen'
		},
		//TOOLS
		{
			name : 'Waveform',
			viz : new Waveform(source),
			group : 'Dynamic',
			grid : false,
			alt : 'The current amplitude of the sound is represented as the height of a bar which moves from the center towards the left'
		},
		{
			name : 'Oscilloscope',
			viz : new Oscilloscope(source),
			group : 'Dynamic',
			color : false,
			grid : false,
			alt : 'The oscilloscope is a squiggly line at the center of the screen which represents a slice of the incoming audio at the current time'
		},
		/**
	 * Additional
	 */
		{
			hide : true,
			name : 'Polyphonic Piano',
			viz : new PianoPitchScroll(source),
			group : 'Dynamic',
			alt : 'Recognized notes are highlighted on a piano keyboard. The active note leaves a trace showing the pitch history which moves from the center of the screen towards the left'
		}
	]

	//update the label text
	sidebar.on('visualization', ({ alt }) => canvas.textContent = alt)

	function resize(e){
		const path = e.path || (e.composedPath && e.composedPath())
		if (path[0] && path[0].tagName && path[0].tagName.toLowerCase() === 'acc-pause-screen'){
			return
		}
		const sidepanelWidth = document.querySelector('acc-side-panel').offsetWidth
		const canvasWidth = window.innerWidth - sidepanelWidth - 10
		canvas.width = canvasWidth
		canvas.style.width = `${canvasWidth}px`
		canvas.height = canvas.offsetHeight
		visualizations.forEach(({ viz }) => {
			viz.resize(canvas.width, canvas.height)
		})
	}

	function loop(){
		requestAnimationFrame(loop)
		const pauseGroup = document.body.querySelector('acc-quiet-group')
		//draw the visualization onto the canvas
		if (!pauseGroup.paused){
			context.clearRect(0, 0, canvas.width, canvas.height)
			const active = sidebar.active
			if (active){
				active.viz.drawTo(context)
			}
		}
	}
	//add all the options to the sidebar
	sidebar.addOptions(visualizations)
	// if (!PRODUCTION){
	//debug a specific one
	// sidebar.active = 'Piano + History'
	// }

	window.addEventListener('resize', resize)
	loop()
}
