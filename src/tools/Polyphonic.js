import { Draw } from 'tone'
import TWEEN, { Tween } from '@tweenjs/tween.js'

function loop(){
	requestAnimationFrame(loop)
	TWEEN.update()
}
loop()

export class Polyphonic {
	constructor(){

		this._notes = []

	}

	addNote(time, n){
		
		Draw.schedule(() => {
			const note = { velocity : 0, midi : n.pitch }

			this._notes.push(note)

			const releaseTween = new Tween(note).to({ velocity : 0 }, 50)
				.delay(n.duration*1000)
				.onComplete(() => {
					//remove it on completion
					const index = this._notes.indexOf(note)
					this._notes.splice(index, 1)
				})
				// .easing(TWEEN.Easing.Quadratic.In)

			const attackTween = new Tween(note).to({ velocity : n.velocity }, 50).start()
			attackTween.chain(releaseTween)
		}, time)
	}

	clear(){
		this._notes = []
	}

	getNotes(){
		return this._notes
	}
}
