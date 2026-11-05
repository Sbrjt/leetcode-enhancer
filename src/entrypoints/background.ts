import { links } from '@/../package.json'
import type { Message } from '@/types'
import { handlers } from '@/utils/msg'
import { handleAlarms } from '@/utils/reminder'

export default defineBackground(() => {
	browser.runtime.onMessage.addListener((msg: Message) => {
		const handler = handlers[msg.type]
		return handler(msg)
	})

	browser.alarms.onAlarm.addListener(handleAlarms)

	browser.storage.session.setAccessLevel({
		accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
	})

	browser.runtime.onInstalled.addListener(async () => {
		browser.runtime.setUninstallURL(links.uninstall)
	})
})
