/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:20:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-30 14:39:53
 * @Description:
 */

import { RangePickerProps } from "antd/es/date-picker"

import { ISchPageParams } from "@/types/i-table.ts"
import { ISearchPage } from "@/types/i-table.ts"

export interface IRpPowerSchForm {
  type?: 0 | 1 | 2
  electricity?: 0 | 1 | 2 | 3 | 4 | 5
  stationCode?: string
  Interval?: 0 | 1 | 2 | 3 | 4 | 5
  dateRange?: RangePickerProps["value"]
  deviceType?: string
  preQrts?: number
  preDays?: number
}
export interface IRpPowerSchParams extends Partial<ISearchPage>, Omit<IRpPowerSchForm, "dateRange"> {
  startTime?: string | number
  endTime?: string | number
}

export type TRpPowerSchFormItemName = "deivceType" | "deviceIds" | "stationId"

export interface IControlLogSchForm {
  deviceType?: string
  deviceIds?: number[]
  stationId?: number
  dateRange?: RangePickerProps["value"]
}

export interface IRpPowerData extends IRunTrendChartData {
  index?: number // 表格处理附加字段
  Time?: number | string
  forecastTime?: number | string
  stationCode?: string
  shortPredPower?: number
  totalLinePower?: number
  outLinePower?: number
  windSpeed?: number
  activePower?: number
  reactivePower?: number
  theoryPower?: number
  availablePower?: number
  irradiance?: number
  ultraShortPredPower?: number
  agvcPower?: number
  syzzzPower?: number
}

export interface ISchParams extends Partial<ISchPageParams>, Omit<IControlLogSchForm, "dateRange" | "deviceIds"> {
  stationCode?: string
  deviceIds?: string // deviceId 多个设备逗号隔开
  startTime?: number | string
  endTime?: number | string
}

export interface IBaseChartOption {
  xAxis?: string[]
}
export interface IRunTrendChartData extends Omit<IBaseChartOption, "data"> {
  data: { title: string; unit: string; data: (number | null)[]; color?: string }[] | null
  legend: string[]
}
