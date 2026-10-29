import { links } from '@/../package.json'
import type { Message } from '@/types'
import { handlers } from '@/utils/msg'

export default defineBackground(() => {
	browser.runtime.onMessage.addListener((msg: Message) => {
		const handler = handlers[msg.type]
		return handler(msg)
	})

	browser.storage.session.setAccessLevel({
		accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
	})

	browser.runtime.onInstalled.addListener(async () => {
		browser.runtime.setUninstallURL(links.uninstall)
	})
})
