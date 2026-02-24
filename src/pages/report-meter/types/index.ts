/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:20:41
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-18 11:20:41
 * @Description:
 */

import { RangePickerProps } from "antd/es/date-picker"

import { ISchPageParams } from "@/types/i-table.ts"

export interface IRpPowerSchForm {
  // type?: 0 | 1 | 2
  timeInterval?: 0 | 1 | 2 | 3 | 4 | 5
  stationCode?: string
  gatewayType?: 0 | 1 | 2 | 3 | 4 | 5
  dateRange?: RangePickerProps["value"]
  stationCodeList?: Array<string>
}
export interface IRpPowerSchParams extends Partial<ISchPageParams>, Omit<IRpPowerSchForm, "dateRange"> {
  startTime?: string | number
  endTime?: string | number
}

export type TRpPowerSchFormItemName = "deivceType" | "deviceIds" | "stationId"

export interface IRpPowerData {
  index?: number // 表格处理附加字段
  id: number | string
  regionName: string
  integrationName: number
  baseName: number
  stationName: number
  elecType: number
  elecName: number
  positiveActivePower: number
  reverseActivePower: number
  positiveReactivePower: number
  reverseReactivePower: number
}
