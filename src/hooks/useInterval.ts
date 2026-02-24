import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

export default function useInterval(timer): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [reload, setReload] = useState(true)
  const timeout = useRef(null)
  useEffect(() => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      setReload(true)
    }, timer)
    return () => clearTimeout(timeout.current)
  }, [reload])
  return [reload, setReload]
}
