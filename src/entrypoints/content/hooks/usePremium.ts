// show alternate links to premium questions

import { Question } from '@/types'
import { getScreenshotLink } from '@/utils/api'
import { makeSignal, searchGfG, searchLintCode } from '@/utils/lib'

import { useFeatureEnabled } from '@/utils/useStore'
import elementReady from 'element-ready'

export default function usePremium(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('premiumQuestion')

	useEffect(() => {
		if (isEnabled === false || question == null || !question.premium) return

		const { controller, signal } = makeSignal()

		let subBtn: HTMLAnchorElement | undefined
		let btnDiv: HTMLDivElement | undefined

			// Find the "subscribe" button, hide it
			// Create a clones for other button
		;(async () => {
			subBtn = await elementReady<HTMLAnchorElement>('a[href^="/subscribe"]', {
				predicate: (a) => a.textContent === 'Subscribe',
				signal,
				stopOnDomReady: false,
			})

			if (!subBtn) return

			const btn1 = document.createElement('a')
			btn1.textContent = 'View screenshot'
			btn1.className = subBtn.className
			btn1.target = '_blank'
			btn1.href = getScreenshotLink(question.id, question.title)

			const btn2 = document.createElement('a')
			btn2.textContent = 'View question'
			btn2.className = subBtn.className
			btn2.target = '_blank'
			btn2.href = `https://leetcode.ca/all/${question.id}.html`

			const btn3 = document.createElement('button')
			btn3.className = subBtn.className
			btn3.textContent = 'Search on GfG'
			btn3.onclick = () => {
				searchGfG(question.title)
			}

			const btn4 = document.createElement('button')
			btn4.className = subBtn.className
			btn4.textContent = 'Search on LintCode'
			btn4.onclick = () => {
				searchLintCode(question.title)
			}

			btnDiv = document.createElement('div')
			btnDiv.classList.add('gap-2', 'flex')
			btnDiv.appendChild(btn2)
			btnDiv.appendChild(btn1)
			btnDiv.appendChild(btn3)
			btnDiv.appendChild(btn4)

			if (signal.aborted) return

			subBtn.after(btnDiv)
			subBtn.hidden = true
		})()

		return () => {
			controller.abort()
			btnDiv?.remove()
			if (subBtn) subBtn.hidden = false
		}
	}, [question, isEnabled])
}
