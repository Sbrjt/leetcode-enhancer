// show alternate links to premium questions

import type { Question } from '@/types'
import { getScreenshotLink } from '@/utils/apis'
import { findElement, searchGfG, searchLintCode } from '@/utils/lib'
import useSignalEffect from '@/utils/useSignalEffect'
import { useFeatureEnabled } from '@/utils/useStore'

type Injected = {
	subBtn?: HTMLAnchorElement
	btnDiv?: HTMLDivElement
}

const SELECTOR = 'a[href^="/subscribe"]'

async function inject(
	question: Question,
	signal: AbortSignal,
	injected: Injected,
) {
	// Find the "subscribe" button, hide it
	// Create clones for other buttons

	const subBtn = await findElement<HTMLAnchorElement>(
		SELECTOR,
		signal,
		(a) => a.textContent === 'Subscribe',
	)

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

	const btnDiv = document.createElement('div')
	btnDiv.classList.add('gap-2', 'flex')
	btnDiv.appendChild(btn2)
	btnDiv.appendChild(btn1)
	btnDiv.appendChild(btn3)
	btnDiv.appendChild(btn4)

	if (signal.aborted) return

	subBtn.after(btnDiv)
	subBtn.hidden = true

	injected.subBtn = subBtn
	injected.btnDiv = btnDiv
}

export default function usePremium(question: Question | null) {
	const [isEnabled] = useFeatureEnabled('premiumLinks')

	useSignalEffect(
		(signal) => {
			if (isEnabled === false || question == null || !question.premium) return

			const injected: Injected = {}

			inject(question, signal, injected)

			return () => {
				injected.btnDiv?.remove()
				if (injected.subBtn) injected.subBtn.hidden = false
			}
		},
		[question, isEnabled],
	)
}
