/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 17:05:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-09 15:12:43
 * @Description:
 */
import { Input } from "antd"
import { useState } from "react"

const EditableCell = (props) => {
  const { value: initialValue, setDataSource, record, valkey } = props
  const [value, setValue] = useState(initialValue)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    setDataSource({ record, value, dataIndex: valkey })
  }

  return <Input value={value} onChange={onChange} onBlur={onBlur} />
}
export default EditableCell
