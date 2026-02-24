/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 17:05:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-08 15:10:29
 * @Description:
 */
import { CaretRightOutlined } from "@ant-design/icons"
import { Select } from "antd"
import { useState } from "react"

const EditableCell = ({ value: initialValue, setDataSource, valkey, record, option }) => {
  const [value, setValue] = useState(initialValue)
  const onChange = (e) => {
    setValue(e)
    setDataSource({ record, value: e, dataIndex: valkey })
  }

  return (
    <Select
      showSearch
      allowClear={true}
      className="select-with"
      optionFilterProp="children"
      popupMatchSelectWidth={false}
      maxTagCount={1}
      value={value}
      suffixIcon={<CaretRightOutlined />}
      options={option}
      onChange={onChange}
    />
  )
}
export default EditableCell
