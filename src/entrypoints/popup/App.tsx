import pkg from '@/../package.json'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import WhatsNew from './WhatsNew'

function App() {
	return (
		<HashRouter>
			<div
				className='flex w-xs flex-col items-center gap-6 bg-[#1a1a1a] p-6
					font-sans text-white'
			>
				<Header />

				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/whats-new' element={<WhatsNew />} />
				</Routes>

				<Footer />
			</div>
		</HashRouter>
	)
}

function Header() {
	return (
		<div className='flex items-center gap-3 self-start'>
			<img src='/icon.svg' alt='Logo' className='h-10 w-auto' />
			<div className='flex flex-col'>
				<h1 className='text-lg font-bold'>LeetCode Enhancer</h1>
				<div className='text-xs text-white/40'>v{pkg.version}</div>
			</div>
		</div>
	)
}

function Footer() {
	const ratingUrl =
		import.meta.env.CHROME ? pkg.links.chromeWebStore : pkg.links.firefoxAddon

	return (
		<div className='mt-1 flex flex-col items-center gap-4'>
			<a
				href={ratingUrl}
				target='_blank'
				className='text-center text-[11px] text-white/30 italic
					transition-colors hover:text-white/60'
			>
				Enjoyed my extension? <br />
				Don't forget to leave a rating, please :)
			</a>
			<div className='text-[10px] text-white/20'>
				Made with <span className='text-red-500/30'>💖</span> by Shubhrajit
				Sadhukhan
			</div>
		</div>
	)
}

export default App
