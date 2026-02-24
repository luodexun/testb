/*
 *@Author: chenmeifeng
 *@Date: 2024-03-28 15:25:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-09 14:18:35
 *@Description:
 */

import { RangePickerProps } from "antd/es/date-picker"

import { ISchPageParams } from "@/types/i-table.ts"

export interface IRpOperationSchForm {
  dateRange?: RangePickerProps["value"]
}
export interface IRpOperationSchParams extends Partial<ISchPageParams>, Omit<IRpOperationSchForm, "dateRange"> {
  startTime?: string | number
  endTime?: string | number
}

export type TRpOperationSchFormItemName = "deivceType" | "deviceIds" | "stationId"

export interface IRpOperationData {
  index?: number
  startTime: number
  startFormatTime: string
  endTime: number
  endFormatTime: string
  name: string
  firstData: number
  lastData: number
  avgData: number
  // AGCInputRatio: number
  // AGCAdjustPassrate: number
  // AVCInputRatio: number
  // AVCAdjustPassrate: number
  // PowerChangePassrate: number
}
