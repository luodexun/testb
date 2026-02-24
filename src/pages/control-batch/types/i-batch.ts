/*
 * @Author: xiongman
 * @Date: 2023-10-30 15:52:02
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-30 15:52:02
 * @Description:
 */

import { IControlLogData } from "@pages/control-log/types"

import { TDeviceType } from "@/types/i-config.ts"
import { IDeviceData, IDeviceRunData4MQ, TDvsMainState } from "@/types/i-device.ts"

export interface IBatchStn2DvsTreeData {
  id: string | number
  key: string | number
  title: string
  deviceCode: string
  deviceId?: number
  ratedPower?: number
  model?: string
  modelId?: number
  lineName?: string
  lineCode?: number
  stationCode?: string
  stationId?: number
  stationName?: string
  deviceName?: string
  level?: number
  isLeaf?: boolean
  children?: IBatchStn2DvsTreeData[]
}

export type TTreeData4DvsTypeMap = {
  [dvsType in TDeviceType]?: IBatchStn2DvsTreeData[]
}
export interface IBatchRealTimeData extends IDeviceData, Omit<IDeviceRunData4MQ, "model"> {}

export type TBatchRealTimeTable = IControlLogData | IBatchRealTimeData
