import "./index.less"

import { useEffect, useState } from "react"

interface IOption {
  name: string
  value: string
}
interface IProps {
  options: any | IOption
  onChange?: (key) => void
}
export default function ComRadioClk(props: IProps) {
  const { options, onChange } = props
  const [currentIdx, setCurrentIdx] = useState("")
  const changeIdx = (key) => {
    setCurrentIdx(key)
    onChange?.(key)
  }
  useEffect(() => {
    if (!options?.length) return
    setCurrentIdx(options[0].value)
  }, [options])
  return (
    <div className="nx-com-radio">
      {options?.map((i) => {
        return (
          <div
            key={i.value}
            onClick={() => changeIdx(i.value)}
            className={`choose-item ${currentIdx === i.value ? "active-i" : ""}`}
          >
            {i.name}
          </div>
        )
      })}
    </div>
  )
}
