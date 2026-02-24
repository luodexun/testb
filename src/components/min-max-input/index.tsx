/*
 * @Author: xiongman
 * @Date: 2023-10-31 10:52:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-10 16:04:08
 * @Description: 最大值最小值输入框组件
 */

import "./index.less"

import { InputNumber } from "antd"
import { InputNumberProps } from "antd/es/input-number"
import { useEffect, useMemo, useRef, useState } from "react"

interface IProps extends Omit<InputNumberProps, "value" | "onChange" | "placeholder"> {
  value?: { min: InputNumberProps["value"]; max: InputNumberProps["value"] }
  onChange?: (value: IProps["value"]) => void
  placeholder?: { min: string; max: string }
}
export default function MinMaxInput(props: IProps) {
  const { value, onChange, placeholder, ...iptProps } = props
  const [status, setStatus] = useState<"error" | "warning">()
  const [selfMin, setSelfMin] = useState<InputNumberProps["value"]>()
  const [selfMax, setSelfMax] = useState<InputNumberProps["value"]>()
  const selfMinRef = useRef(selfMin)
  const selfMaxRef = useRef(selfMax)
  const valueRef = useRef(value)
  selfMinRef.current = selfMin
  selfMaxRef.current = selfMax
  valueRef.current = value

  useEffect(() => {
    if (`${value?.min}` === `${selfMinRef.current}` && `${value?.max}` === `${selfMaxRef.current}`) return
    setSelfMin(value?.min)
    setSelfMax(value?.max)
  }, [value])

  const onChgRef = useRef(onChange)
  onChgRef.current = onChange
  const timerFlag = useRef(0)
  useEffect(() => {
    window.clearTimeout(timerFlag.current)
    timerFlag.current = window.setTimeout(() => {
      const { min, max } = valueRef.current || {}
      if (`${min}` === `${selfMin}` && `${max}` === `${selfMax}`) return
      if (selfMax < selfMin) setStatus("warning")
      else setStatus(undefined)
      onChgRef.current?.({ min: selfMin, max: selfMax })
    }, 300)
    return () => window.clearTimeout(timerFlag.current)
  }, [selfMax, selfMin])

  const theProps = useMemo(() => ({ ...iptProps, controls: false, status }), [iptProps, status])

  return (
    <div className="min-max-input-wrap">
      <InputNumber {...theProps} value={selfMin} placeholder={placeholder?.min || "最小值"} onChange={setSelfMin} />
      <span>-</span>
      <InputNumber {...theProps} value={selfMax} placeholder={placeholder?.max || "最大值"} onChange={setSelfMax} />
    </div>
  )
}
