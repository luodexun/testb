/*
 *@Author: chenmeifeng
 *@Date: 2024-03-28 17:42:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-28 17:42:00
 *@Description:
 */

import { RangePickerProps } from "antd/es/date-picker"

import { ISchPageParams } from "@/types/i-table.ts"

export interface IRpAlarmAnalyseSchForm {
  dateRange?: RangePickerProps["value"]
  otherParams?: any[]
  deviceIdList?: any
}
export interface IRpAlarmAnalyseSchParams extends Partial<ISchPageParams>, Omit<IRpAlarmAnalyseSchForm, "dateRange"> {
  startTime?: string | number
  endTime?: string | number
}

export type TRpAlarmAnalyseSchFormItemName = "deivceType" | "deviceIds" | "stationId"

export interface IRpAlarmAnalyseData {
  index?: number
  stationDesc: string
  deviceModel: string
  deviceId: number
  deviceDesc: string
  parentClass: string
  childClass: string
  alarmCount: number
  firstTriggerTime: string
  lastTriggerTime: string
  confirmCount: number
  firstConfirmTime: string
  lastConfirmTime: string
}

export interface IBatchStn2DvsTreeData {
  id: string | number
  key: string | number
  title: string
  deviceCode: string
  disabled?: boolean
  model: string
  stationCode: string
  stationName: string
  isLeaf?: boolean
  level?: number
  children?: IBatchStn2DvsTreeData[]
}

export interface IRpAnalyseData extends ITime {
  deviceCode: string
  windSpeed: number
  activePower: number
  actualActivePower: number
  standardActivePower: number
}

export interface ITime {
  startTime?: string
  endTime?: string
}

export interface IRunTrendChartData {
  chartData?: IRpAnalyseData[]
  loading?: boolean
  dataSource?: any
}
