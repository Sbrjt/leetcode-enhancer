import { links } from '@/../package.json'

export default defineBackground(() => {
	browser.runtime.onMessage.addListener(async (msg, _sender, _sendResponse) => {
		if (msg.type === 'SEARCH') {
			browser.search.query({
				text: msg.query,
				disposition: 'NEW_TAB',
			})

			return
		}

		if (msg.type === 'RELOAD_TAB') {
			const tabs = await browser.tabs.query({ url: 'https://leetcode.com/*' })

			for (const tab of tabs) {
				browser.tabs.reload(tab.id!)
			}
		}

		if (msg.type === 'NOTIFY') {
			const granted = await browser.permissions.request({
				permissions: ['notifications', 'alarms'],
			})

			// https://developer.chrome.com/docs/extensions/reference/api/alarms

			browser.alarms.create('weekly-reminder', {
				delayInMinutes: 10080,
				periodInMinutes: 10080,
				persistAcrossSessions: true,
			})

			browser.alarms.onAlarm.addListener((alarm) => {
				if (alarm.name !== 'weekly-reminder') return

				browser.notifications.create({
					type: 'basic',
					iconUrl: browser.runtime.getURL('/icons/128.png'),
					title: 'LeetCode Enhancer',
					message: 'Your weekly reminder!',
				})
			})

			if (granted) {
				await browser.notifications.create({
					type: 'basic',
					iconUrl: browser.runtime.getURL('/icons/128.png'),
					title: 'LeetCode Enhancer',
					message: 'Your feature has finished loading!',
				})
			}
		}
	})

	browser.storage.session.setAccessLevel({
		accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
	})

	browser.runtime.onInstalled.addListener(async () => {
		browser.runtime.setUninstallURL(links.uninstall)

		// temporary
		browser.storage.sync.set({
			premiumScreenshots: true,
			companyQuestions: true,
		})
	})
})
