import gsap from 'gsap'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Type definition for the parameters used in the `useAnimation` hook.
 * @typedef {Object} UseAnimationType
 * @property {number} start - The starting value of the animation.
 * @property {number} end - The ending value of the animation.
 * @property {number} duration - The duration of the animation in seconds.
 * @property {string} [ease='expo.inOut'] - The easing function for the animation.
 * @property {boolean} [rounded] - Flag to determine if the value should be rounded during the animation.
 */
export type UseAnimationType = {
  start: number
  end: number
  duration: number
  ease?: string
  rounded?: boolean
}

/**
 * Custom hook to create an animation using GSAP.
 * @param {UseAnimationType} params - The parameters for the animation.
 * @returns {number} The current value of the animation.
 */
export const useAnimation = ({ start, end, duration, ease = 'expo.inOut', rounded }: UseAnimationType): number => {
  const [val, setVal] = useState(end)

  const startValueRef = useRef(start)

  useEffect(() => {
    startValueRef.current = val
  }, [val])

  useLayoutEffect(() => {
    const valObj = { val: startValueRef.current }

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
