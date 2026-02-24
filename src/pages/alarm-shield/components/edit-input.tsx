/*
 * @Author: chenmeifeng
 * @Date: 2024-04-17 16:07:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-18 13:54:12
 * @Description:
 */
import { Input, InputNumber } from "antd"
import { useRef, useState } from "react"

const EditInputCell = (props) => {
  const { value: initialValue, setDataSource, record, curkey, cpnType = "input" } = props
  const [value, setValue] = useState(initialValue)

  const onChange = useRef((e) => {
    const value = cpnType === "input" ? e.target.value : e
    setValue(value)
  })

  const onBlur = () => {
    setDataSource({ record, value, curkey })
  }

  return cpnType === "input" ? (
    <Input value={value} onChange={onChange.current} onBlur={onBlur} />
  ) : (
    <InputNumber value={value} onChange={onChange.current} onBlur={onBlur} />
  )
}
export default EditInputCell
