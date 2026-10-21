// my custom hook that runs useEffect with an AbortSignal

import type { AbortableEffect } from '@/types'
import { useEffect, type DependencyList } from 'react'
import { makeSignal } from './lib'

export default function useSignalEffect(
	setup: AbortableEffect,
	deps: DependencyList,
) {
	useEffect(() => {
		const { controller, signal } = makeSignal()

		const cleanup = setup(signal)

		return () => {
			controller.abort()
			cleanup?.()
		}
	}, deps)
}
