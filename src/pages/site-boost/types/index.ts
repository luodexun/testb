/*
 * @Author: chenmeifeng
 * @Date: 2024-02-02 13:48:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-27 10:17:53
 * @Description:
 */
import { INodeIdType } from "@/types/i-boost"
import { IStationData } from "@/types/i-station"

export interface IPointInfo {
  pointName: string
  pointDesc: string
  deviceId: number
  modelId?: number
  stationInfo: IStationData
  actType: INodeIdType
  deviceCode?: string
  controlPointName?: string
  controlPointDesc?: string
}

export interface IFiveRuleInfo {
  id: number
  pointName: string
  controlType: 1 | 0
  ruleInfo: string
  stationCode: string
}
export interface IFiveRuleForm {
  pointName: string
  controlType: 1 | 0
  ruleInfo: string
  stationCode: string
}
export interface IFiveRuleSchForm {
  pointName: string
  controlType?: 1 | 0
  stationCode: string
}
export interface ISignKeyMap {
  [key: number]: Array<ISignList>
}
export interface ISignList {
  id: number
  deviceId: number
  deviceName: string
  signState: string
  datasource: string
  remark: string
  createBy: string
  createTime: number
  endBy: string
  endTime: number
  signStateCode: string
  signDesc: string
  lineCode: number
}
