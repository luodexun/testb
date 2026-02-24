/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 17:05:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-18 11:41:43
 * @Description:
 */
import { CaretRightOutlined } from "@ant-design/icons"
import { Select } from "antd"
import { useState } from "react"

const EditSelectCell = ({ value: initialValue, setDataSource, record, option, curkey }) => {
  const [value, setValue] = useState(initialValue)
  const onChange = (e) => {
    setValue(e)
    setDataSource({ record, value: e, curkey })
  }

  return (
    <div style={{ width: "100%" }}>
      <Select
        showSearch
        allowClear={true}
        className="select-with"
        optionFilterProp="children"
        popupMatchSelectWidth={false}
        style={{ width: "100%" }}
        maxTagCount={1}
        value={value}
        suffixIcon={<CaretRightOutlined />}
        options={option}
        onChange={onChange}
      />
    </div>
  )
}
export default EditSelectCell
