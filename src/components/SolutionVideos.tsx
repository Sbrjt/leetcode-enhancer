import { Question } from '@/types'
import { LuExternalLink, LuYoutube } from 'react-icons/lu'

function SolutionVideos({ question, striverLink, neetcodeLink }: Props) {
	return (
		<>
			{neetcodeLink || striverLink ?
				<div
					className='bg-lc-layer-01 dark:bg-dark-lc-background-index mx-4 mt-5
						rounded-2xl border border-zinc-200 p-6'
				>
					<Search question={question} />
					<div className='mt-5 grid gap-5 lg:grid-cols-2'>
						{neetcodeLink && (
							<iframe
								className='aspect-video rounded-xl border'
								src={`https://www.youtube.com/embed/${neetcodeLink}`}
								allowFullScreen
							/>
						)}
						{striverLink && (
							<iframe
								className='aspect-video rounded-xl border'
								src={`https://www.youtube.com/embed/${striverLink}`}
								allowFullScreen
							/>
						)}
					</div>
				</div>
			:	<div className='mx-4 mt-6 mb-2'>
					<Search question={question} />
				</div>
			}
		</>
	)
}

function Search({ question }: Pick<Props, 'question'>) {
	return (
		<a
			href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
				`${question.id}. ${question.title} LeetCode`,
			)}`}
			target='_blank'
			className='bg-fill-secondary hover:bg-fill-primary inline-flex
				items-center gap-2 rounded-lg border px-3 py-2 transition'
		>
			<LuYoutube className='text-red-500' />
			Search on YouTube
			<LuExternalLink />
		</a>
	)
}

type Props = {
	question: Question
	striverLink?: string
	neetcodeLink?: string
}

export default SolutionVideos
