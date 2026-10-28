import { links } from '@/../package.json'
import { handleReloadTabs, handleSearchWeb } from '@/utils/bg'

export default defineBackground(() => {
	browser.runtime.onMessage.addListener((msg, _sender, _sendResponse) => {
		switch (msg.type) {
			case 'SEARCH':
				return handleSearchWeb(msg.query)

			case 'RELOAD_TAB':
				return handleReloadTabs()
		}
	})

	browser.storage.session.setAccessLevel({
		accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
	})

	browser.runtime.onInstalled.addListener(async () => {
		browser.runtime.setUninstallURL(links.uninstall)
	})
})
