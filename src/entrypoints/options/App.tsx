import SettingSwitch from '@/components/SettingSwitch'

function App() {
	return (
		<div
			className='flex min-h-screen flex-col items-center justify-start
				bg-gray-900 p-8 text-white'
		>
			<div className='mb-6 flex items-center gap-3'>
				<img src='/icon.svg' alt='Logo' className='h-10 w-10' />
				<h1 className='text-2xl font-bold'>LeetCode Enhancer Options</h1>
			</div>
			<div className='mt-5 flex w-full max-w-md flex-col gap-4'>
				<SettingSwitch settingKey='enabled' reload />
				<SettingSwitch settingKey='showRating' />
				<SettingSwitch settingKey='formatOnRun' />
				<SettingSwitch settingKey='autoComplete' reload />
				<SettingSwitch settingKey='copyCode' />
				<SettingSwitch settingKey='showDislikes' />
				<SettingSwitch settingKey='premiumLinks' />
				<SettingSwitch settingKey='companyQuestions' />
				<SettingSwitch settingKey='videoSolutions' />
			</div>
		</div>
	)
}

export default App
