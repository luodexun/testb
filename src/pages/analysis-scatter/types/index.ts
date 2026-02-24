/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:20:41
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-18 11:20:41
 * @Description:
 */

import { TChartOrTable } from "@configs/table-constant.tsx"
import { TRpPowerSchFormItemName } from "@pages/analysis-trend/types"
import { RangePickerProps } from "antd/es/date-picker"

import { TFormItemConfig } from "@/components/custom-form/types.ts"
import { IDeviceTypeOfStation, TDeviceType } from "@/types/i-config.ts"
import { IDeviceData, IDvsMeasurePointTreeVal } from "@/types/i-device.ts"
import { IAtomStation } from "@/types/i-station.ts"
import { ISchPageParams } from "@/types/i-table.ts"

export interface IAnlyScatterSchForm {
  displayType: TChartOrTable
  stationCode?: string
  deviceType?: TDeviceType
  deviceIds?: number[]
  devicePointX?: IDvsMeasurePointTreeVal[]
  devicePointY?: IDvsMeasurePointTreeVal[]
  dateRange?: RangePickerProps["value"]
  xRange?: { min: string; max?: string }
  yRange?: { min: string; max?: string }
}
export interface IAnlyScatterSchParams extends ISchPageParams {
  devicePointX: string
  devicePointY: string
  startTime: number
  endTime: number
  minX?: string
  maxX?: string
  minY?: string
  maxY?: string
}

export type IAnlyScttrSchItemName = "stationCode" | "deviceType" | "deviceIds" | "devicePointX" | "devicePointY"

export type TAnlyScatterData = {
  [pointName: string]: number | string
}

export type TAnlyScatterServe4Chart = {
  [dvsCode: string]: TAnlyScatterData[]
}
export type TAnlyScttrChartData = {
  [dvsName: string]: {
    name: string
    value: number[]
    labels: string[]
    time: string
  }[]
}

export interface IAnlyScttrDvsOptions extends IDeviceData {
  label: string
  value: IDeviceData["deviceCode"]
  // modelId?: IDeviceData["modelId"]
  disabled?: boolean
}

export interface IAnalyFormItemCfgMap {
  dvsOptionsMap?: Record<string, IAnlyScttrDvsOptions>
  stationMap?: IAtomStation["stationMap"]
  deviceTypeOfStationMap?: Record<number, IDeviceTypeOfStation>
  formItemConfig?: TFormItemConfig<TRpPowerSchFormItemName>
}
