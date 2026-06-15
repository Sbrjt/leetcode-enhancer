import pkg from '@/../package.json'
import { Switch } from '@/components/switch'
import { useFeatureEnabled } from '@/utils/useStore'
import {
	LuChevronRight,
	LuGithub,
	LuSettings,
	LuStar,
	LuTerminal,
} from 'react-icons/lu'
import { browser } from 'wxt/browser'

function App() {
	const [isEnabled, setIsEnabled] = useFeatureEnabled('enabled')

	const toggleEnabled = () => {
		setIsEnabled(!isEnabled)
		browser.runtime.sendMessage({ type: 'RELOAD_TAB' })
	}

	return (
		<div
			className='flex w-xs flex-col items-center gap-6 bg-[#1a1a1a] p-6
				font-sans text-white'
		>
			<Header />
			<EnableExtension isEnabled={isEnabled ?? true} onToggle={toggleEnabled} />
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
			<img src='/icon.svg' alt='Logo' className='h-10 w-auto' />
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
		<div
			className='flex w-full items-center justify-between rounded-2xl border
				border-white/5 bg-white/5 p-4'
		>
			<div className='flex flex-col'>
				<span className='text-[15px] font-bold'>Enable extension</span>
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
			className='flex w-full items-center justify-between rounded-2xl border
				border-white/5 bg-white/5 p-4 text-sm font-bold text-white/90
				transition-all hover:bg-white/10'
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
			className='h-12 w-full rounded-xl bg-[#FFDD00]'
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
		<div className='mt-1 flex flex-wrap justify-center gap-2'>
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
