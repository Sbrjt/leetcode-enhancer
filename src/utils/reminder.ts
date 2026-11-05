import { fetchContests } from './apis'

const TEN_MIN = 10 * 60 * 1000
const WEEK_MIN = 7 * 24 * 60

export function toast(message: string) {
	browser.notifications.create({
		message,
		type: 'basic',
		iconUrl: browser.runtime.getURL('/icons/128.png'),
		title: 'LeetCode Enhancer',
	})
}

function createAlarm(name: string, options: Browser.alarms.AlarmCreateInfo) {
	browser.alarms.create(name, {
		...options,
		persistAcrossSessions: true,
	})

	// https://developer.chrome.com/docs/extensions/reference/api/alarms
	// persistAcrossSessions doesn't work in firefox!!
}

export function handleAlarms(alarm: Browser.alarms.Alarm) {
	if (alarm.name === 'weekly-contest') {
		toast('Get ready for your weekly contest!')
	}

	if (alarm.name === 'biweekly-contest') {
		toast('Get ready for your biweekly contest!')
	}
}

export async function scheduleContestReminders() {
	const contests = await fetchContests()

	if (!contests) {
		throw new Error('Failed to fetch contests')
	}

	createAlarm('weekly-contest', {
		when: contests.weekly.startTime * 1000 - TEN_MIN,
		periodInMinutes: WEEK_MIN,
	})

	createAlarm('biweekly-contest', {
		when: contests.biweekly.startTime * 1000 - TEN_MIN,
		periodInMinutes: 2 * WEEK_MIN,
	})

	// todo: allow user to customize reminder timing?

	// To see all alarms:
	// run this in service worker console
	// await browser.alarms.getAll()
}
