import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

export function useRefresh(timeout = 6000, init = true): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [reload, setReload] = useState<boolean>(init)
  const timer = useRef(0)
  useEffect(() => {
    window.clearInterval(timer.current)
    timer.current = window.setInterval(() => setReload(true), timeout)
    return () => window.clearInterval(timer.current)
  }, [timeout])
  return [reload, setReload]
}
