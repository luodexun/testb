/*
 * @Author: xiongman
 * @Date: 2023-10-17 11:56:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-18 10:52:43
 * @Description:
 */

import { IFormValidError } from "@/types/i-antd.ts"
import { IDvsStateData } from "@/types/i-device.ts"

// 各个步骤组件 ref 数据格式
export interface IStepContentInst<TD = unknown> {
  // 针对各个步骤组件传值
  setData?: (data?: TD) => void
  getData?: () => Promise<TD>
}

export interface IDvsCurrentStateInfo extends Partial<IDvsStateData> {
  state: string
  color?: string
}

export interface ICurrentStateRef {
  getState: () => IDvsCurrentStateInfo
}

export interface IOperateInfo {
  stationName?: string
  deviceName?: string
  stateName?: string
  operateName?: string
  pointDesc?: string
  interval?: number
}

export type TAuthFormData = IDualPsdSafeLoginForm | IFormValidError<IDualPsdSafeLoginForm>

export interface IDualPsdSafeLoginForm {
  name1?: string
  pwd1?: string
  name2?: string
  pwd2?: string
  name?: string
  pwd?: string
}
export interface IDualPsdSafeLoginParams extends IDualPsdSafeLoginForm {
  service: "control"
}

export interface IControlActExecuteParams {
  deviceIds: string // 即前面接口查询出来的设备id，如风机id或断路器、刀闸的测点ID，多个逗号隔开
  pointName: string | number // 控制测点名
  controlType: string // 控制类型（传id，参考下一个接口）
  operatorBy: string // 执行人（控制操作人用户名，即当前用户）
  authorizerBy: string // 监护人（控制审核人用户名，认证的审核人用户名）
  targetValue: number // 控制值（开关位控制默认为1，如功率控制，写入实际值)
  interval: number // 批量控制多指令执行间隔时间(单位:毫秒)，如果不需要或用户未选择，传0
}

export interface IControlParamMap {
  authVerify?: IDualPsdSafeLoginForm
  executeInfo?: IControlActExecuteParams & IOperateInfo
}
