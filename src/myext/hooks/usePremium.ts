// this hook provides alternate links to premium questions

import { Question } from '../types'
import {
	getScreenshotLink,
	observeElement,
	searchGfG,
	searchLintCode,
} from '../utils'

export default function usePremium(question: Question | null) {
	useEffect(() => {
		if (question == null || !question.premium) return

		const run = () => {
			console.log('premium:', question.id)

			const subBtn = Array.from(
				document.querySelectorAll<HTMLAnchorElement>('a[href^="/subscribe"]'),
			).find((a) => a.textContent === 'Subscribe')

			if (!subBtn) return false

			const btn2 = document.createElement('a')
			btn2.textContent = 'View screenshot'
			btn2.className = subBtn.className
			btn2.target = '_blank'
			btn2.href = getScreenshotLink(question.id, question.title)

			const btn1 = document.createElement('a')
			btn1.textContent = 'View question'
			btn1.className = subBtn.className
			btn1.target = '_blank'
			btn1.href = `https://leetcode.ca/all/${question.id}.html`

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
			btnDiv.appendChild(btn1)
			btnDiv.appendChild(btn2)
			btnDiv.appendChild(btn3)
			btnDiv.appendChild(btn4)

			subBtn.insertAdjacentElement('afterend', btnDiv)
			subBtn.remove()
			return true
		}

		if (run()) {
			return
		}

		const observer = observeElement(() => {
			if (run()) {
				observer.disconnect()
			}
		})

		return () => observer.disconnect()
	}, [question])
}
