/*
 * @Author: chenmeifeng
 * @Date: 2024-04-24 18:30:36
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-25 10:05:22
 * @Description:
 */
import "./tinput.less"

import { Button, InputNumber, Space } from "antd"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
interface IProps {
  submit: (type, value?) => void
}
interface IRef {}
const TInput = forwardRef<IRef, IProps>((props, ref) => {
  const { submit } = props
  const [inputVal, setInputVal] = useState(null)
  const onchange = useRef((e) => {
    setInputVal(e)
  })
  const submitTo = (type) => {
    submit?.(type, inputVal)
  }
  useImperativeHandle(ref, () => ({
    //
  }))
  return (
    <div className="tinput">
      <InputNumber value={inputVal} onChange={onchange.current} />
      <Space style={{ width: "100%", justifyContent: "end", marginTop: "1em" }}>
        <Button onClick={submitTo.bind(null, "close")}>取消</Button>
        <Button onClick={submitTo.bind(null, "ok")}>确认</Button>
      </Space>
    </div>
  )
})
export default TInput
