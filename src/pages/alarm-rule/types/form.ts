import { IRuleQuotaInfo } from "."

/*
 * @Author: chenmeifeng
 * @Date: 2024-09-10 11:20:25
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-07 09:49:46
 * @Description:
 */
export type TAlarmRuleEditField =
  | "systemId"
  | "alarmLevelId"
  | "alarmRule"
  | "alarmDesc"
  | "calPeriod"
  | "lifeCycle"
  | "enableFlag"
  | "actionFlag"
export interface ICursorInfo {
  position: number
  nextCursorPistion?: number
  currentInfo: {
    id: number
    key: string
  }
}

export interface IEditFormData {
  id?: number
  stationId: number // 场站ID
  deviceId: number // 设备ID
  alarmDesc: string // 告警描述
  alarmRule: string //告警规则
  alarmLevelId: number // 告警等级ID
  systemId: number // 归属系统ID
  calPeriod: number // 计算周期
  lifeCycle: number // 生命周期，每个测点数据的有效期
  enableFlag: number // 1-启用，0-停用
  actionFlag?: number // 告警触发是否关联停机操作
  createBy: string // 创建人
  createTime: string // 创建时间
  updateBy: string // 更新人
  updateTime: string // 更新时间
}

export interface ISchForm {
  id?: number
  alarmDesc: string // 告警描述
  alarmRule: Array<IRuleQuotaInfo> //告警规则
  alarmLevelId: number // 告警等级ID
  systemId: number // 归属系统ID
  calPeriod: number // 计算周期
  lifeCycle: number // 生命周期，每个测点数据的有效期
  enableFlag: number // 1-启用，0-停用
  actionFlag?: number // 告警触发是否关联停机操作
  createBy: string // 创建人
  createTime: string // 创建时间
  updateBy: string // 更新人
  updateTime: string // 更新时间
}
