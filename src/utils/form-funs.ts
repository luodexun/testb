/*
 * @Author: xiongman
 * @Date: 2023-10-18 14:58:05
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-27 10:31:29
 * @Description:
 */

import { day4Y2S } from "@configs/time-constant.ts"
import { uDate } from "@utils/util-funs.tsx"
import { RangePickerProps } from "antd/es/date-picker"

// 获取日期范围的开始和结束时间
export function getStartAndEndTime<TR = string | number>(
  dateRange: RangePickerProps["value"],
  format = day4Y2S,
  defValue?: Record<"startTime" | "endTime", TR>,
  showTime?: boolean,
): Record<"startTime" | "endTime", TR> {
  if (!Array.isArray(dateRange) || dateRange?.length !== 2) {
    return defValue || ({} as Record<"startTime" | "endTime", TR>)
  }
  const [start, end] = dateRange!
  let startD = start
  let endD = end
  if (!showTime) {
    startD = start.startOf("d")
    endD = end.startOf("d").add(23, "h").add(59, "m").add(59, "s")
  }
  const startTime = format ? uDate(startD, format) : startD.valueOf()
  const endTime = format ? uDate(endD, format) : endD.valueOf()
  return { startTime, endTime } as Record<"startTime" | "endTime", TR>
}

// 表单组件值变化处理函数，获取指定字段变化的值
export function getFormValue4ChangedField<TFormVal, TVal>(
  changedValue: TFormVal,
  fieldKey: keyof TFormVal,
): TVal | "NOT MATCH FIELD" {
  const [field, value] = (Object.entries(changedValue || {})[0] || []) as [keyof TFormVal, any]
  if (field !== fieldKey) return "NOT MATCH FIELD"
  return value
}

// 表单值变化联动处理方法
export function onFormValueChange<TFormVal = any>(
  changedValue: TFormVal,
  exclude: (keyof TFormVal)[],
  fun: (v?: any, f?: keyof TFormVal) => Promise<any>,
): Promise<any> {
  const [field, value] = (Object.entries(changedValue || {})[0] || []) as [keyof TFormVal, any]
  if (exclude.includes(field)) return Promise.resolve(null)
  return fun(value, field)
}

export const validPword = (rule, value) => {
  const isNeedStnPw = process.env["VITE_NEED_STRONGER_PW"] === "1"
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&-+=_}{|:<>\\[\\],.?*])(?=.{8,})")
  if (!value) {
    return Promise.reject(new Error("请输入密码"))
  }
  if (!isNeedStnPw && value) {
    return Promise.resolve()
  }
  if (strongRegex.test(value)) {
    return Promise.resolve()
  } else {
    return Promise.reject(new Error("密码太简单了，至少包含大小写字母、数字、特殊英文符号的8位及以上密码"))
  }
}

export const checkIfRepeatPassword = (rule, value, callback) => {
  const form = rule.field.form
  console.log(rule, form, "dskjf")

  if (value && form.getFieldValue("password") === value) {
    callback("密码相同")
  } else {
    callback()
  }
}
