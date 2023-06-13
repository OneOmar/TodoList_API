import { spawn } from 'node:child_process'
import { watch } from 'node:fs/promises'
const [node, _ , file] = process.argv

function spawnNode () {
	const processChild = spawn(node, [file])
	processChild.stdout.pipe(process.stdout)
	processChild.stderr.pipe(process.stderr)
	processChild.on('close', (code) => {
		if (code !== null) {
			process.exit(code)
		}
	})
	return processChild
}

let childNodeProcess = spawnNode()
const watcher = watch('./', {recursive: true})
for await (const event of watcher) {
	// console.log(event)
	if (event.filename === 'app.js' ) {
		childNodeProcess.kill()
		childNodeProcess = spawnNode()
	}
}
