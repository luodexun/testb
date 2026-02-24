/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:20:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-23 16:06:08
 * @Description:
 */

import { RangePickerProps } from "antd/es/date-picker"
import { ColumnsType } from "antd/es/table"

import { ISearchPage } from "@/types/i-table.ts"

export interface IRpPowerSchForm {
  stationType?: string
  stationCode?: string
  groupByTime?: string
  groupByPath?: string
  deviceType?: string
  point?: string[]
  dateRange?: RangePickerProps["value"]
  fileType?: string
  isTest?: boolean
}
export type TRpSchFmItemName = keyof IRpPowerSchForm
export interface IRpPowerSchParams extends Partial<ISearchPage>, Omit<IRpPowerSchForm, "dateRange"> {
  startTime?: string | number
  endTime?: string | number
}

export type TRpPowerSchFormItemName = "deivceType" | "deviceIds" | "stationId" | "piont"

export interface IStationMap {
  [key: string]: {
    type: string[]
    colums: ColumnsType<any>
  }
}

export interface IOption {
  label: string
  value: string
}
export interface IRpPowerData {
  index: number // 表格处理附加字段
  Time: number | string
  transTime: string
  regionComId: string
  regionComName: string
  projectComId: string
  projectComName: string
  maintenanceComId: string
  maintenanceComName: string
  stationCode: string
  stationName: string
  deviceCode: string
  deviceName: string
  model: string
  totalCapacity: number
  totalDeviceCount: number
  activePower: number
  windSpeed?: number
  dailyProduction?: number
  theoryProduction?: number
  availableProduction?: number
  totalLossProduction?: number
  dailyCharge?: number
  dailyDischarge?: number
  stateA: number
  stateB: number
  stateC: number
  stateD: number
  stateE: number
  stateF: number
  stateG?: number
}

export interface IKeyMap {
  [key: string]: boolean
}
