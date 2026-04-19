import usePremium from './hooks/usePremium'
import useQuestion from './hooks/useQuestion'
import useRating from './hooks/useRating'

function App() {
	const { question, url } = useQuestion()

	useRating(question)
	usePremium(question)

	return (
		<>
			{/* {question?.id}
			{question?.title} */}
		</>
	)
}

export default App
