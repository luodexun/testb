/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:20:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-27 09:57:50
 * @Description:
 */

import { RangePickerProps } from "antd/es/date-picker"

import { TDeviceType } from "@/types/i-config.ts"
import { ISchPageParams } from "@/types/i-table.ts"

export interface ISignLogSchForm {
  deviceType?: TDeviceType
  deviceId?: number[]
  stationId?: number
  isEnd?: boolean
  dateRange?: RangePickerProps["value"]
}

export type TSignLogSchFmItemName = keyof ISignLogSchForm
export interface ISignLogSchParams extends Partial<ISchPageParams>, Omit<ISignLogSchForm, "deviceId"> {
  deviceId?: string // deviceId 多个设备逗号隔开
}
export interface ISignLogData {
  id: number
  stationId: number
  lineCode: number
  lineName: string
  deviceId: number
  deviceName: string
  signState: string
  datasource: string
  remark: string
  createBy: string
  createTime: number
  endBy: string
  endTime: number
  signStateCode: string
  signDesc: string
}
