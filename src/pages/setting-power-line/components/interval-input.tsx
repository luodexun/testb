/*
 * @Author: chenmeifeng
 * @Date: 2023-10-25 18:01:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-28 15:45:41
 * @Description:
 */

import { InputNumber } from "antd"
import { useEffect, useState } from "react"

interface IProps {
  value?: Array<number>
  defaultValue?: Array<number>
  onChange?: (val: any) => void
}
export default function IntervalButton(props: IProps) {
  const { value, defaultValue, onChange, ...otherProps } = props
  const [nbValue, setNbValue] = useState(2)
  const [nbValue1, setNbValue1] = useState(25)
  useEffect(() => {
    if (value?.length) {
      setNbValue(value[0])
      setNbValue1(value[1])
    }
  }, [value])
  const changeValue = (e) => {
    setNbValue(parseInt(e.target.value))
    onChange([parseInt(e.target.value), nbValue1])
  }
  const changeRightValue = (e) => {
    setNbValue1(parseInt(e.target.value))
    onChange([nbValue, parseInt(e.target.value)])
  }
  const changeStep1 = (e) => {
    setNbValue(e)
  }
  const changeStep2 = (e) => {
    setNbValue1(e)
  }
  return (
    <div className="limit-power-lnnterval">
      <InputNumber
        onBlur={(e) => {
          changeValue(e)
        }}
        value={nbValue}
        onStep={changeStep1}
        defaultValue={defaultValue?.[0]}
        {...otherProps}
      />
      <span style={{ padding: "0 10px" }}> —— </span>
      <InputNumber
        onBlur={(e) => {
          changeRightValue(e)
        }}
        value={nbValue1}
        onStep={changeStep2}
        defaultValue={defaultValue?.[1]}
        {...otherProps}
      />
    </div>
  )
}
