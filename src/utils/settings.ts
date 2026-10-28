export const SETTINGS = {
	enabled: { label: 'Extension enabled', default: true },
	showRating: { label: 'Problem difficulty rating', default: true },
	formatOnRun: { label: 'Format on run', default: true },
	autoComplete: { label: 'Enable auto-complete', default: true },
	copyCode: { label: 'Copy code button', default: true },
	showDislikes: { label: 'Return dislike button', default: true },
	premiumLinks: {
		label: 'Alternate links of premium editorials/questions',
		default: true,
	},
	companyQuestions: { label: 'Company questions and tags', default: false },
	videoSolutions: {
		label: 'Video solutions from Neetcode and Striver',
		default: true,
	},
} as const
