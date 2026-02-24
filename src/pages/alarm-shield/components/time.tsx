/*
 * @Author: chenmeifeng
 * @Date: 2024-04-01 13:39:39
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-01 13:55:53
 * @Description:
 */
import { Radio, TimePicker } from "antd"
import dayjs from "dayjs"
import { useRef, useState } from "react"

export default function TimeShield(props) {
  const { onChange } = props
  const [chooseTypeKey, setChooseTypeKey] = useState(1)
  const changeChoose = useRef((e) => {
    console.log(e, "esf")
    const value = e?.target?.value
    setChooseTypeKey(value)
    if (value === 1) {
      onChange()
    }
  })
  const changeTime = useRef((e) => {
    console.log(e.valueOf(), "esf")
    onChange(e.valueOf())
  })
  return (
    <div className="shield-time">
      <Radio.Group onChange={changeChoose.current} value={chooseTypeKey}>
        <Radio value={1}>否</Radio>
        <Radio value={2}>是</Radio>
      </Radio.Group>
      {chooseTypeKey === 2 ? <TimePicker onChange={changeTime.current} /> : ""}
    </div>
  )
}
