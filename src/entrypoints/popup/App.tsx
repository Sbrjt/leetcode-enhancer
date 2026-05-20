import {
	LuChevronRight,
	LuGithub,
	LuSettings,
	LuStar,
	LuTerminal,
} from 'react-icons/lu'
import { browser } from 'wxt/browser'
import pkg from '../../../package.json'

function App() {
	const [isEnabled, setIsEnabled] = useState(true)

	const toggleEnabled = () => {
		setIsEnabled(!isEnabled)
	}

	return (
		<div className='w-xs bg-[#1a1a1a] text-white p-6 font-sans flex flex-col items-center gap-6'>
			<Header />
			<EnableExtension isEnabled={isEnabled} onToggle={toggleEnabled} />
			<Settings />
			<BMC />
			<Pills />
			<Footer />
		</div>
	)
}

function Header() {
	return (
		<div className='flex items-center gap-3 self-start'>
			<img src='/icon.svg' alt='Logo' className='w-auto h-10' />
			<div className='flex flex-col'>
				<h1 className='text-lg font-bold'>LeetCode Enhancer</h1>
				<div className='text-xs text-white/40'>v{pkg.version}</div>
			</div>
		</div>
	)
}

function EnableExtension({
	isEnabled,
	onToggle,
}: {
	isEnabled: boolean
	onToggle: () => void
}) {
	return (
		<div className='w-full bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between'>
			<div className='flex flex-col'>
				<span className='font-bold text-[15px]'>Enable extension</span>
				<span className='text-xs text-white/40'>Active on this page</span>
			</div>
			<Switch checked={isEnabled} onChange={onToggle} />
		</div>
	)
}

function Settings() {
	return (
		<a
			href={browser.runtime.getURL('/options.html')}
			target='_blank'
			className='w-full bg-white/5 border border-white/5 hover:bg-white/10 text-white/90 text-sm font-bold p-4 rounded-2xl transition-all flex items-center justify-between'
		>
			<div className='flex items-center gap-3'>
				<LuSettings size={18} className='text-white/60' />
				Settings
			</div>
			<LuChevronRight
				size={16}
				className='text-white/30 group-hover:text-white/60'
			/>
		</a>
	)
}

function BMC() {
	return (
		<a
			href={pkg.links.funding}
			target='_blank'
			className='w-full rounded-xl h-12 bg-[#FFDD00]'
		>
			<img
				src='/bmc.svg'
				alt='Buy Me A Coffee'
				className='h-full w-full object-contain'
			/>
		</a>
	)
}

function Pills() {
	return (
		<div className='flex flex-wrap justify-center gap-2 mt-1'>
			<a href={pkg.homepage} target='_blank' className='pill'>
				<LuGithub size={12} />
				GitHub
			</a>

			{/* <a
				href={`${pkg.homepage}/issues/new`}
				target='_blank'
				className='pill'
			>
				<LuMessageSquareWarning size={12} />
				Report Issue
			</a> */}

			<a
				href={
					import.meta.env.CHROME ?
						pkg.links.chromeWebStore
					:	pkg.links.firefoxAddon
				}
				target='_blank'
				className='pill'
			>
				<LuStar size={12} />
				Rate Me
			</a>

			<button
				onClick={async () => {
					const info = await getBrowserDetails()
					navigator.clipboard.writeText(JSON.stringify(info, null, 2))
				}}
				className='pill'
			>
				<LuTerminal size={12} />
				Copy Logs
			</button>
		</div>
	)
}

function Footer() {
	return (
		<div className='text-xs text-white/40'>
			Made with <span className='text-red-500'>💖</span> by Shubhrajit Sadhukhan
		</div>
	)
}

export default App
