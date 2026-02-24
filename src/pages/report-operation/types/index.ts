/*
 *@Author: chenmeifeng
 *@Date: 2024-03-28 15:25:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-25 15:34:38
 *@Description:
 */

import { RangePickerProps } from "antd/es/date-picker"

import { ISchPageParams } from "@/types/i-table.ts"

export interface IRpOperationSchForm {
  stationCode?: string
  dateRange?: RangePickerProps["value"]
  deviceType: string
  stationCodeList?: Array<string>
}
export interface IRpOperationSchParams extends Partial<ISchPageParams>, Omit<IRpOperationSchForm, "dateRange"> {
  startTime?: string | number
  endTime?: string | number
}

export type TRpOperationSchFormItemName = "deivceType" | "deviceIds" | "stationId"
export interface IRpQuotaInfo {
  valueDispatch?: string
  value?: number
  threshold?: number
  dataNum?: number
}
export interface IRpOperationData {
  index?: number
  recordTime: string
  stationName: string
  ruleName: number
  ultraShortAccuracy: IRpQuotaInfo
  ultraShortPassRate: IRpQuotaInfo
  shortAccuracy: IRpQuotaInfo
  shortPassRate: IRpQuotaInfo
  middleAccuracy: IRpQuotaInfo
  middlePassRate: IRpQuotaInfo
  // AGCInputRatio: number
  // AGCAdjustPassrate: number
  // AVCInputRatio: number
  // AVCAdjustPassrate: number
  // PowerChangePassrate: number
}
