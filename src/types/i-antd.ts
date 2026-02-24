/*
 * @Author: xiongman
 * @Date: 2023-08-28 13:59:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-23 17:32:37
 * @Description:
 */

import { TimeRangePickerProps } from "antd"
import { Dayjs } from "dayjs"
import { CSSProperties, ReactNode } from "react"

type TValue = string | number | boolean
export interface ILabelValue<TVal extends TValue> {
  key?: string
  value: TVal
  label: ReactNode
  style?: CSSProperties
  disabled?: boolean
}

export interface ITreeLabelValue {
  id?: any
  key: string
  value: TValue
  title: ReactNode
  style?: CSSProperties
  checkable?: boolean
  disableCheckbox?: boolean
  isLeaf?: boolean
  selectable?: boolean
  disabled?: boolean
  children?: ITreeLabelValue[]
  label?: string
  type?: string
  maintenanceComId?: number
  stationId?: number
  stationName?: string
  modelId?: number
}

export type TOptions<TV extends TValue> = ILabelValue<TV>[]
export type TTreeOptions = ITreeLabelValue[]

export interface IFormValidError<TV = any> {
  values: TV
  errorFields: {
    name: (string | number)[]
    errors: string[]
  }[]
  outOfDate: boolean
}

export type TPresets = TimeRangePickerProps["presets"]

export type TDate = Dayjs
