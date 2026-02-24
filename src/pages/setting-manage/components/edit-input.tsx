/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 17:05:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-27 15:28:14
 * @Description:
 */
import { Input } from "antd"
import { useState } from "react"

const EditableCell = ({ value: initialValue, setDataSource, record, dataIndex }) => {
  const [value, setValue] = useState(initialValue)
  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onBlur = () => {
    setDataSource({ record, value, dataIndex })
  }

  return <Input value={value} onChange={onChange} onBlur={onBlur} />
}
export default EditableCell
