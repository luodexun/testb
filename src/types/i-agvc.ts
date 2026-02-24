/*
 * @Author: xiongman
 * @Date: 2023-10-20 17:44:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-11 17:45:02
 * @Description:
 */

export interface IAgvcInfo {
  AGCActivePowerOrderBySchedule: number // 71.1
  AVCVoltageOrderBySchedule: number //  39.7
  additionalActivePowerOfSubStation: number //  27.5
  additionalReactivePowerOfSubStation: number //  57.7
  AdditionalReactivePowerOfSubStation: number //  57.7
  decreaseActivePowerOfSubStation: number //  9.6
  decreaseReactivePowerOfSubStation: number //  18.6
  DecreaseReactivePowerOfSubStation: number //  18.6
  realTimeGirdVolt: number //  22.2
  RealTimeGirdVolt: number //  22.2
  realTimeTotalActivePowerOfSubStation: number //  80.5
  RealTimeTotalActivePowerOfSubStation: number //  80.5
  Time: number
  voltRate?: number
  rate?: number
  AGCInput: boolean
  AVCInput: boolean
  AGCRemoteOperation: boolean
  AVCRemoteOperation: boolean
  additionalActivePowerBlock: boolean
  AdditionalActivePowerBlock: boolean
  additionalReactivePowerBlock: boolean
  AdditionalReactivePowerBlock: boolean
  decreaseActivePowerBlock: boolean
  DecreaseActivePowerBlock: boolean
  decreaseReactivePowerBlock: boolean
  DecreaseReactivePowerBlock: boolean
  deviceCode: string // "441882W01SS11011111"
  deviceId?: number
  deviceName?: string
  stationCode: string // "44182W01"
  stationName?: string
  totalInstalledCapacity?: number
  stationCapacity: number
  loadRate: number
  activePowerAdjustRate: number
  powerLimitDepth: number
  scheduleToCapacityRate: number
  powerLimitFlag: number
  TheoreticalPower: number
  AvailablePower: number
  AVCReactivePowerOrderBySchedule: number
  realTimeTotalReactivePowerOfSubStation: number
  RealTimeTotalReactivePowerOfSubStation: number
}

export interface IAgvcMQDataMap {
  [deviceCode: string]: IAgvcInfo
}

interface IAgvcMQPayload {
  code: string
  success: boolean
  msg: string
  data: IAgvcInfo | IAgvcMQDataMap
}
export interface IAgvcMQData {
  uri: string
  payload: IAgvcMQPayload
}
