import { Client } from '@notionhq/client'

export async function initNotion(token: string) {
	// create a template for pages (kinda like a schema for metadata)

	try {
		const notion = new Client({ auth: token })

		const res = await notion.databases.create({
			parent: {
				type: 'workspace',
				workspace: true,
			},

			title: [{ text: { content: 'Leetcode' } }],

			initial_data_source: {
				properties: {
					Name: { title: {} },

					URL: { url: {} },

					Level: {
						select: {
							options: [
								{ name: 'Easy', color: 'green' },
								{ name: 'Medium', color: 'yellow' },
								{ name: 'Hard', color: 'red' },
							],
						},
					},

					Tags: {
						multi_select: {
							options: [
								{ name: 'Math' },
								{ name: 'String' },
								{ name: 'Array' },
								{ name: 'Matrix' },
								{ name: 'Hashing' },
								{ name: 'Two Pointers' },
								{ name: 'Sliding Window' },
								{ name: 'Prefix Sum' },
								{ name: 'Stack' },
								{ name: 'Queue' },
								{ name: 'Heap' },
								{ name: 'Bit Manipulation' },
								{ name: 'Binary Search' },
								{ name: 'Greedy' },
								{ name: 'Recursion' },
								{ name: 'Dynamic Programming' },
								{ name: 'Linked List' },
								{ name: 'Tree' },
								{ name: 'BST' },
								{ name: 'Graph' },
								{ name: 'Trie' },
								{ name: 'RMQ' },
								{ name: 'Misc' },
							],
						},
					},

					Review: { checkbox: {} },

					'First Attempt': { checkbox: {} },
				},
			},
		})

		return { success: true, databaseId: res.id }
	} catch (error: any) {
		return { success: false, error: error.message }
	}
}

export async function addPageToDatabase(
	databaseId: string,
	token: string,
	data: {
		title: string
		url: string
		level: 'Easy' | 'Medium' | 'Hard'
		tags: string[]
	},
) {
	try {
		const notion = new Client({ auth: token })

		const response = await notion.pages.create({
			parent: {
				type: 'database_id',
				database_id: databaseId,
			},
			properties: {
				Name: {
					title: [
						{
							text: {
								content: data.title,
							},
						},
					],
				},
				URL: {
					url: data.url,
				},
				Level: {
					select: {
						name: data.level,
					},
				},
				Tags: {
					multi_select: data.tags.map((tag) => ({ name: tag })),
				},
				Review: {
					checkbox: false,
				},
				'First Attempt': {
					checkbox: false,
				},
			},
		})
		return { success: true, pageId: response.id }
	} catch (error: any) {
		return { success: false, error: error.message }
	}
}
