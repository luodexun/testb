/*
 * @Author: chenmeifeng
 * @Date: 2024-03-26 15:10:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-27 15:29:00
 * @Description:
 */
import { useState } from "react"

import DatePicker from "@/components/custom-date-picker"
import { TDate } from "@/types/i-antd.ts"
import { uDate, vDate } from "@/utils/util-funs"

const EditableCell = ({ value: initialValue, setDataSource, record, dataIndex }) => {
  const [value, setValue] = useState<TDate>(initialValue ? vDate(initialValue) : null)
  const onChange = (e) => {
    setValue(e)
    setDataSource({ record, value: uDate(e, "YYYY-MM-DD"), dataIndex })
  }

  return (
    <DatePicker size="small" className="manage-date-picker" value={value} onChange={onChange} format={"YYYY-MM-DD"} />
  )
}
export default EditableCell
