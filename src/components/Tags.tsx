import { FaChevronDown } from 'react-icons/fa'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ScrollArea } from './ui/scroll-area'

type Props = { companies: string[] }
const pill_class =
	'inline-flex w-auto items-center justify-center text-caption px-2 py-1 gap-2 rounded-full bg-fill-secondary cursor-pointer transition-colors hover:bg-fill-primary hover:text-text-primary text-sd-secondary-foreground hover:opacity-80 border'

function Tags({ companies }: Props) {
	const first4 = companies.slice(0, 4)
	const rest = companies.slice(4)

	return (
		<>
			{first4.map((company) => (
				<Pill company={company} key={company} />
			))}

			{rest.length !== 0 && <PopUp companies={rest} />}
		</>
	)
}

function PopUp({ companies }: Props) {
	return (
		<Popover>
			<PopoverTrigger className={pill_class}>
				More
				<FaChevronDown size={10} />
			</PopoverTrigger>
			<PopoverContent className='bg-lc-layer-01 dark:bg-dark-lc-background-index w-80'>
				<div className='flex'>
					<ScrollArea className='max-h-40'>
						<div className='flex flex-wrap justify-center gap-2'>
							{companies.map((company) => (
								<Pill company={company} key={company} />
							))}
						</div>
					</ScrollArea>
				</div>
			</PopoverContent>
		</Popover>
	)
}

function Pill({ company }: { company: string }) {
	return (
		<a
			href={`https://leetcode.com/company/${company}`}
			target='_blank'
			className={pill_class}
		>
			{/* Alternate: `https://logos-api.apistemic.com/linkedin:${company.toLowerCase()}` */}
			<img src={`https://img.loadlogo.com/name/${company}`} className='h-3.5' />
			{company}
		</a>
	)
}

export default Tags
