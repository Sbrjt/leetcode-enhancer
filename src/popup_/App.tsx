import { browser } from 'wxt/browser'

function App() {
	const changeColor = async () => {
		const [tab] = await browser.tabs.query({
			active: true,
			currentWindow: true,
		})
		if (!tab.id) return

		const randomColor = `hsl(${Math.random() * 360}, 70%, 50%)`

		await browser.scripting.executeScript({
			target: { tabId: tab.id },
			func: (color: string) => {
				document.body.style.backgroundColor = color
			},
			args: [randomColor],
		})
	}

	return (
		<div className='p-20 text-7xl'>
			<button onClick={changeColor}>click</button>
		</div>
	)
}

export default App
