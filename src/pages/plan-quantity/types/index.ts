/*
 * @Author: xiongman
 * @Date: 2023-10-18 11:20:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-05 17:55:47
 * @Description:
 */

import { IOperateInfo } from "@/components/device-control/types.ts"
import { ISearchPage } from "@/types/i-table.ts"

export interface IRpPowerSchForm {
  year?: string | number
  stationCode?: string
  stationId?: number | string
}
export interface IRpPowerSchParams extends Partial<ISearchPage>, Omit<IRpPowerSchForm, "dateRange"> {
  month?: string
  productionPlan?: string | number
  ids?: number | string
}

export type TRpPowerSchFormItemName = "deivceType" | "deviceIds" | "stationId"

export interface IRpPowerData {
  id: number
  stationId: number | string
  stationName: string
  year: string
  month: string
  productionPlan: number
  dailyProduction?: number
  planCompletion?: number | string
  child?: IRpPowerData[]
}

export interface IOperateStepProps {
  data: IRpPowerData
  buttonClick?: (type: "ok" | "close", form?: any, tableData?: any) => void
  loading?: boolean
  type?: string
}

export interface IDataProps {
  data: IRpPowerData
  buttonClick?: (type: "ok" | "close", form?: any, tableData?: any) => void
  loading?: boolean
  type?: string
}

export interface ICorrectList {
  [month: string]: ICorrectDetail[]
}
export interface ICorrectDetail {
  deviceCode: string
  deviceName: string
  deviceType: string
  dayList?: {
    [day: string]: string
  }
}
