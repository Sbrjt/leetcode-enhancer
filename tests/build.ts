import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

export default async function globalSetup() {
	const extension = resolve('.output/chrome-mv3')
	const manifest = join(extension, 'manifest.json')

	if (!existsSync(manifest)) {
		console.error(
			'\nExtension build not found.\nRun `npm run build` before testing!\n',
		)

		process.exit(0)
	}
}
