import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export type UseAnimationType = {
  start: number
  end: number
  duration: number
  ease?: string
  rounded?: boolean
}

export const useAnimation = ({ start, end, duration, ease = 'expo.inOut', rounded }: UseAnimationType): number => {
  const [val, setVal] = useState(end)

  const startValueRef = useRef(start)

  useEffect(() => {
    startValueRef.current = val
  }, [val])

  console.log('useAnimation(), startValueRef.current', startValueRef.current)

  useLayoutEffect(() => {
    const valObj = { val: startValueRef.current }

    console.log('useAnimation, useLayoutEffect, startValueRef.current', startValueRef.current)

    const gsapCtx = gsap.context(() => {
      gsap.to(valObj, duration, {
        val: end,
        ease,
        duration,
        ...(rounded ? { roundProps: 'val' } : {}),
        onUpdate () {
          setVal(valObj.val)
        },
      })
    })


    return (): void => gsapCtx.revert()
  }, [duration, ease, end, rounded, start])

  return val
}
