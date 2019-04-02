import chroma from 'chroma-js'
import { Frequency } from 'tone'

export function ftom(freq){
	return 69 + 12 * Math.log2(freq / 440)
}

const frequencyColors = [
	'#e33059',
	'#f75839',
	'#f7943d',
	'#f3b72f',
	'#edd929',
	'#95c631',
	'#47ad4b',
	'#45b5a1',
	'#42acb0',
	'#4e61d8',
	'#9013fe',
	'#bd10e0',
].map(c => chroma(c))

//updated colors
const jayColors = [
	'#00FFFF',
	'#FF8000',
	'#FFFF00',
	'#FF337F',
	'#FFFFAA',
	'#009966',
	'#FF0000',
	'#80FF00',
	'#FF00FF',
	'#009999',
	'#9900FF',
	'#007FFF'
].map(c => chroma(c))

//old colors
/*const jayColors = [
	'#00cbe4', //C
	'#a70209',
	'#ffca37', //D
	'#781ce2',
	'#ff9824', //E
	'#4a932c', //F
	'#ed24ef',
	'#77d427', //G
	'#fc1890',
	'#5ddcbc', // A
	'#8906a4', 
	'#172efc', //B
].map(c => chroma(c))*/

const ampColors = [
	'#000000',
	'#56a754',
	'#edd929',
	'#e33059',
].map(c => chroma(c))

const ampColorsWhite = ampColors.slice()
ampColorsWhite[0] = chroma('#ffffff')

let colorMode = 'rainbow'

if (window.location.hash.includes('jay')){
	colorMode = 'jay'
}

window.addEventListener('hashchange', () => {
	if (window.location.hash.includes('jay')){
		colorMode = 'jay'		
	}
})

export function setColorMode(mode){
	colorMode = mode
}

export function midi2Color(midi){
	//mix the percentages
	const colorArr = colorMode === 'rainbow' ? frequencyColors : jayColors
	return colorArr[midi % colorArr.length]
}

export function note2Color(note){
	return midi2Color(Frequency(note).toMidi())
}

export function freq2Color(freq){
	if (freq === -1){
		return 'white'
	} else {
		//mix the percentages
		const fMidi = ftom(freq)
		const m0 = Math.floor(fMidi)
		const m1 = Math.ceil(fMidi)
		const percent = fMidi - m0
		return chroma.mix(midi2Color(m0).hex(), midi2Color(m1).hex(), percent)
	}
}

export function amp2Color(amp, noBlack = false, exp=0.7){
	const index = Math.scale(Math.clamp(Math.pow(amp, exp), 0, 1), 0, 1, 0, ampColors.length - 1)
	const a0 = Math.floor(index)
	const a1 = Math.ceil(index)
	const percent = a0 !== ampColors.length - 1 ? index - a0 : 1
	const colorsArray = noBlack ? ampColorsWhite : ampColors
	const a0Color = colorsArray[a0]
	const a1Color = colorsArray[a1]
	return chroma.mix(a0Color.hex(), a1Color.hex(), percent)
}
