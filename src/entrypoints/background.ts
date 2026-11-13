import { links } from '@/../package.json'
import type { Message } from '@/types'
import { openWhatsNew } from '@/utils/lib'
import { handlers } from '@/utils/msg'

export default defineBackground(() => {
	browser.runtime.onMessage.addListener((msg: Message) => {
		const handler = handlers[msg.type]
		return handler(msg)
	})

	browser.storage.session.setAccessLevel({
		accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
	})

	browser.runtime.onInstalled.addListener(async (details) => {
		browser.runtime.setUninstallURL(links.uninstall)

		if (details.reason === 'update') {
			await openWhatsNew()
		}
	})
})
