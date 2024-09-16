import { memo, FC } from 'react'

import { useAnimation, UseAnimationType } from '../../../../hooks'


export const AnimatedSnippet: FC<UseAnimationType> = memo<UseAnimationType>((props: UseAnimationType) => {
  const amountValue = useAnimation(props)

  return <span>{amountValue}</span>
})

export type AnimatedSnippetType = typeof AnimatedSnippet;

// Set display name for the component.
AnimatedSnippet.displayName = 'AnimatedSnippet'
