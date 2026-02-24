/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:48:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-28 10:55:46
 * @Description:
 */
export interface IRuleInfo {
  id: number
  deviceId: number
  deviceCode: string
  deviceName: string
  stationId: number
  stationCode: string
  stationName: string
  controlType: number
  pointName: string
  ruleInfo: string
}

export interface IRuleInfoParam {
  pageNum: number
  pageSize: number
  stationCode?: string
}

export type TUserTbActInfo = {
  key: string
  label: string
}
export interface TModelFrAndTbInfo {
  loginName?: string
  realName?: string
  id?: number
  roleId?: number
  password?: string
  newPassword?: string
}

export interface IPointInfo {
  controlType: number
  pointName: string
  ruleInfo: string
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
