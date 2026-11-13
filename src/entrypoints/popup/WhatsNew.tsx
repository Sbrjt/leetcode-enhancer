import ReactMarkdown from 'react-markdown'
import { useSearchParams } from 'react-router-dom'

function WhatsNew() {
	useEffect(() => {
		// reset the popup to its default page after opening #/whats-new
		browser.action.setPopup({ popup: 'popup.html' })
	}, [])

	const [searchParams] = useSearchParams()
	const whatsNew = searchParams.get('message')

	return (
		<div
			className='flex flex-col gap-4 rounded-2xl border-2 border-transparent
				px-5 py-6 shadow-lg shadow-purple-500/30'
			style={{
				background: `
						linear-gradient(#111827 0 0) padding-box,
						linear-gradient(135deg, deeppink, mediumorchid, deepskyblue, mediumseagreen) border-box`,
			}}
		>
			{/* <div
				className='flex size-10 items-center justify-center rounded-xl
					bg-radial-[at_90%_75%] from-sky-200 via-blue-500 to-violet-600 to-80%
					text-2xl text-white'
			>
				<RiMegaphoneFill className='-rotate-20' />
			</div> */}

			<a
				href='https://github.com/Sbrjt/leetcode-enhancer/releases/'
				target='blank'
				className='text-center text-2xl font-bold decoration-pink-500/30
					underline-offset-8 hover:underline'
			>
				What's New 🎉
			</a>

			{/* <div
				className='flex w-full items-center gap-2 rounded-xl bg-green-900/40
					px-3 py-2 text-xs text-green-100'
			>
				<FaCheckCircle className='shrink-0 text-base text-green-500' />
				Your extension was updated!
			</div> */}

			<div
				className='prose dark:prose-invert max-w-none text-xs leading-relaxed
					tracking-widest'
			>
				<ReactMarkdown>{whatsNew}</ReactMarkdown>
			</div>
		</div>
	)
}

export default WhatsNew

// page url: chrome-extension://cpoclfijojgjiafnlgnhjalkaiabcjch/popup.html#/whats-new
