/*
 * @Author: xiongman
 * @Date: 2023-12-20 14:29:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-10 16:23:45
 * @Description:
 */

import { useCallback, useEffect, useRef } from "react"

export default function usePageResize(fun: () => void, waitTime = 200) {
  const timer = useRef(0)
  const funRef = useRef(fun)
  funRef.current = fun
  const waitTimeRef = useRef(waitTime)
  waitTimeRef.current = waitTime
  const onResize = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => funRef.current(), waitTimeRef.current)
  }, [])
  useEffect(() => {
    onResize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      window.clearTimeout(timer.current)
    }
  }, [onResize])
}
