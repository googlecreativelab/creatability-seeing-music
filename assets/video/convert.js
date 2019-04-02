const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const srcFolder = '/Users/ymann/Downloads/180914b/'

const destFolder = path.resolve(__dirname)

const VIDEO_WIDTH = '320'

function convertFile(f){

	const srcFile = path.resolve(srcFolder, f)
	const destFile = path.resolve(destFolder, f)

	child_process.execSync(`ffmpeg -y -i "${srcFile}" -vf scale=${VIDEO_WIDTH}:-1 ${destFile}`)
}

function convertAll(){
	const folders = fs.readdirSync(srcFolder).filter(f => !f.startsWith('.'))
	folders.forEach(inst => {
		convertInst(inst)
	})

	fs.writeFileSync(path.resolve(__dirname, './videos.json'), JSON.stringify(allFiles, undefined, '\t'))
}

const allFiles = []

convertAll()

function convertInst(inst){
	console.log('\n\n')
	console.log('starting', inst)

	const files = fs.readdirSync(path.resolve(srcFolder, inst)).filter(f => !f.startsWith('.'))

	files.forEach(file => {
		const fileName = `${inst}/${file}`
		console.log('converting', fileName)
		allFiles.push(fileName)
		// convertFile(fileName)
	})
}

// convertInst('vocal')
