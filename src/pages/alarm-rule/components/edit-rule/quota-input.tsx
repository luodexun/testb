/*
 * @Author: chenmeifeng
 * @Date: 2024-09-06 16:21:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-10 16:49:25
 * @Description:
 */
import { Input } from "antd"
import { useContext, useEffect, useRef, useState } from "react"
import PiontContext from "../../configs/use-point-check"

interface IProps {
  value?: string
  info?: {
    id: number
    key: string
  }
  defaultValue?: Array<number>
  onChange?: (val: any) => void
}
export default function RuleQuotaInput(props: IProps) {
  const { value, info, onChange } = props

  const inputRef = useRef(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [inputVal, setInputVal] = useState("")
  const timeoutRef = useRef(null)
  const { cursorInfo, setCursorInfo } = useContext(PiontContext)
  const changeValue = (e) => {
    setInputVal(e?.target?.value)
    onChange?.(e?.target?.value)
  }

  const getCursorPosition = (e) => {
    // console.log(inputRef.current.selectionEnd, "inputRef.current.selectionEnd")

    if (inputRef.current) {
      const selectionEnd = inputRef.current.selectionEnd
      setCursorPosition(selectionEnd)
      setCursorInfo({ position: selectionEnd, currentInfo: info })
    }
  }
  useEffect(() => {
    if (value && cursorInfo) {
      const { nextCursorPistion } = cursorInfo
      timeoutRef.current = setTimeout(() => {
        inputRef.current.focus()
        inputRef.current.setSelectionRange(nextCursorPistion, nextCursorPistion)
        setCursorInfo(null)
      }, 300)
    }
    setInputVal(value)
  }, [value])
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])
  return (
    <div className="limit-power-lnnterval">
      <input ref={inputRef} onBlur={getCursorPosition} value={inputVal} onChange={changeValue}></input>
      {/* <Input ref={inputRef} onBlur={getCursorPosition} value={inputVal} onChange={changeValue}></Input> */}
    </div>
  )
}
