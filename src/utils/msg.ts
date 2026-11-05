// message handlers used in background script

import type { Message } from '@/types'
import { scheduleContestReminders } from './reminder'

function searchWeb(msg: Message) {
	return browser.search.query({
		text: msg.query!,
		disposition: 'NEW_TAB',
	})
}

async function reloadTabs() {
	const tabs = await browser.tabs.query({ url: 'https://leetcode.com/*' })

	for (const tab of tabs) {
		browser.tabs.reload(tab.id!)
	}
}

export const handlers = {
	SEARCH: searchWeb,
	RELOAD_TAB: reloadTabs,
	CONTEST_REMINDERS: scheduleContestReminders,
}

// todo: use an existing library:
// https://wxt.dev/guide/essentials/messaging.html
