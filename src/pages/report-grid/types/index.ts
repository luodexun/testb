/*
 *@Author: chenmeifeng
 *@Date: 2024-03-27 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-27 16:03:08
 *@Description:
 */

import { RangePickerProps } from "antd/es/date-picker"

import { ISchPageParams } from "@/types/i-table.ts"

export interface IRpGridSchForm {
  // type?: 0 | 1 | 2
  timeInterval?: 0 | 1 | 2 | 3 | 4 | 5
  stationCode?: string
  gatewayType?: 0 | 1 | 2 | 3 | 4 | 5
  dateRange?: RangePickerProps["value"]
  stationCodeList?: Array<string>
}
export interface IRpGridSchParams extends Partial<ISchPageParams>, Omit<IRpGridSchForm, "dateRange"> {
  startTime?: string | number
  endTime?: string | number
}

export type TRpGridSchFormItemName = "deivceType" | "deviceIds" | "stationId"

export interface IRpGRIDData {
  index?: number
  time: number | string
  forwardActivePower0: number
  forwardActivePower1: number
  backActivePower0: number
  backActivePower1: number
  unit: number
  forwardProduction: number
  backProduction: number
  verifyForwardProduction: number
  verifyBackProduction: number
}
