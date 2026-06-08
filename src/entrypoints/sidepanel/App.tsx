import pkg from '@/../package.json'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Notion from './components/Notion'

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/notion' element={<Notion />} />
			</Routes>
		</HashRouter>
	)
}

function Home() {
	return (
		<div className='flex flex-col gap-6 p-6 text-white bg-[#1a1a1a] min-h-screen font-sans'>
			<div className='flex items-center gap-3'>
				<img src='/icon.svg' alt='Logo' className='w-auto h-10' />
				<div className='flex flex-col'>
					<h1 className='text-lg font-bold'>LeetCode Enhancer</h1>
					<div className='text-xs text-white/40'>v{pkg.version}</div>
				</div>
			</div>
			<div className='text-white/60 text-sm'>
				Configure your settings and integrations here.
			</div>
		</div>
	)
}

export default App
