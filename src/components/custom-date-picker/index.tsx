/*
 * @Author: xiongman
 * @Date: 2023-09-07 11:21:32
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-07 11:21:32
 * @Description: 格式化指定单位的时间
 */

import { DatePicker, DatePickerProps } from "antd"
import type { Dayjs } from "dayjs"
import { useEffect, useState } from "react"

type TProps = DatePickerProps & {
  onChange?: (date: Dayjs | null) => void
}

export default function CustomDatePicker(props: TProps) {
  const { value, style, onChange, ...otherProps } = props
  const [dateVal, setDateVal] = useState<DatePickerProps["value"]>(null)

  useEffect(() => {
    if (!value && !dateVal) return
    setDateVal(value)
  }, [dateVal, value])

  return <DatePicker value={dateVal} onChange={onChange} {...otherProps} style={{ ...(style || {}) }} />
}
