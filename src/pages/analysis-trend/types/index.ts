/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:20:41
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-18 11:20:41
 * @Description:
 */

import { TIntervalKey, TPolymerKey } from "@configs/option-const.tsx"
import { TChartOrTable } from "@configs/table-constant.tsx"
import { RangePickerProps } from "antd/es/date-picker"

import { TDeviceType } from "@/types/i-config.ts"
import { IDvsMeasurePointTreeVal } from "@/types/i-device.ts"
import { ISchPageParams } from "@/types/i-table.ts"

export interface IAnlyTrendSchForm {
  displayType: TChartOrTable
  stationCode?: string
  deviceType?: TDeviceType
  deviceIds?: number[]
  devicePoint?: IDvsMeasurePointTreeVal[]
  func?: TPolymerKey
  timeInterval?: TIntervalKey
  dateRange?: RangePickerProps["value"]
}

export type TAnlyTrendSchItemName = "deviceType" | "deviceIds" | "devicePoint"

export interface IAnlyTrendSchParams extends ISchPageParams, Pick<IAnlyTrendSchForm, "func" | "timeInterval"> {
  devicePoint: string
  startTime: number
  endTime: number
}
export type TAnlyTrendData = {
  [pointName: string]: number | string
}
export type TAnlyTrendServe4Chart = {
  [dvsCode: string]: TAnlyTrendData[]
}

export type TRpPowerSchFormItemName = "deviceType" | "deviceIds" | "stationId" | "devicePoint" | "deviceList"
