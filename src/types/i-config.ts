/*
 * @Author: xiongman
 * @Date: 2023-09-20 12:01:42
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-20 12:01:42
 * @Description: 系统接口-配置管理-数据结构定义们
 */

import { CSSProperties } from "react"

import { ILabelValue } from "@/types/i-antd.ts"
import { TDvsMainState } from "@/types/i-device.ts"

export type TYear0Month = "month" | "year"

/*
 * WT(风机)
 * PVINV(光伏逆变器)
 * ESPCS(储能变流器系统)
 * SYZZZ(综自系统)
 * PVTRA(光伏箱变)
 * PVDCB(直流汇流箱)
 * PVTRS(光伏跟踪系统)
 * PVCOL(组串式逆变器数据采集器)
 * ESMON(储能监控系统)
 * ESTRA(储能箱变)
 * ESCTL(储能群控系统)
 * ESBAT(电池系统)
 * GLYC(功率预测)
 * DNJL(电能计量)
 * BX(保信系统)
 * AGVC(AGC/AVC)
 * GZLB(故障录波)
 * */
export type TDeviceType =
  | "WT"
  | "PVINV"
  | "ESPCS"
  | "SYZZZ"
  | "PVTRA"
  | "PVDCB"
  | "PVTRS"
  | "PVCOL"
  | "ESMON"
  | "ESTRA"
  | "ESCTL"
  | "ESBAT"
  | "GLYC"
  | "DNJL"
  | "BX"
  | "AGVC"
  | "GZLB"
  | "WTTRA"
  | "OTHERTYPE"

// const data = [
//   { code: "WT", name: "风机" },
//   { code: "PVTRA", name: "光伏箱变" },
//   { code: "PVDCB", name: "直流汇流箱" },
//   { code: "PVINV", name: "光伏逆变器" },
//   { code: "PVTRS", name: "光伏跟踪系统" },
//   { code: "PVCOL", name: "组串式逆变器数据采集器" },
//   { code: "ESMON", name: "储能监控系统" },
//   { code: "ESTRA", name: "储能箱变" },
//   { code: "ESCTL", name: "储能群控系统" },
//   { code: "ESPCS", name: "储能变流器系统" },
//   { code: "ESBAT", name: "电池系统" },
//   { code: "GLYC", name: "功率预测" },
//   { code: "DNJL", name: "电能计量" },
//   { code: "BX", name: "保信系统" },
//   { code: "AGVC", name: "AGC/AVC" },
//   { code: "GZLB", name: "故障录波" },
//   { code: "SYZZZ", name: "综自系统" },
// ]

// W(风电),S(光伏/光热),F(风储),G(光储),H(风光储),P(分布式光伏),E(独立储能),T(独立变电站)
export type TSiteType = "W" | "S" | "F" | "G" | "H" | "P" | "E" | "T"

export interface IConfigTypeData {
  code: TSiteType | TDeviceType
  name: string
}

export interface IConfigDeviceStateData {
  id: number
  state: TDvsMainState // "A"
  stateDesc: string // "正常发电"
  color: string | null // "#95F202"
  stateType: "MAIN" | "SUB"
  deviceType: TDeviceType // "WT"
  styleInfo?: CSSProperties
}

// 子系统分类接口及处理后结构
export interface ISubSystemType extends ILabelValue<string | number> {
  id: number // 101 //子系统id,以设备类型区分：风机1开头，光伏逆变器2开头，储能变流器3开头，升压站4开头
  name: string // "主控系统"
  deviceType?: TDeviceType
}
// 子系统分类本地存储数据结构
export type TSubSysTypeMap = {
  [sysType in ISubSystemType["deviceType"]]?: { [id in string]: ISubSystemType }
}

export interface IDeviceTypeOfStation {
  stationId: number
  modelIds: number[]
  deviceTypes: TDeviceType[]
}

export interface IDeviceSignal {
  signState: string
  signDesc: string
}
export interface IPageData<data> {
  records: data[]
  total: number
}

// const data = [
//   { id: 1, state: "A", stateDesc: "正常发电", color: "#95F202", stateType: "MAIN", deviceType: "WT" },
//   { id: 2, state: "B", stateDesc: "限功率", color: "#F59B22", stateType: "MAIN", deviceType: "WT" },
//   { id: 3, state: "C", stateDesc: "待机", color: "#0600FF", stateType: "MAIN", deviceType: "WT" },
//   { id: 4, state: "D", stateDesc: "停机", color: "#FFFF80", stateType: "MAIN", deviceType: "WT" },
//   { id: 5, state: "E", stateDesc: "未知状态", color: "#AAAAAA", stateType: "MAIN", deviceType: "WT" },
//   { id: 6, state: "F", stateDesc: "通讯中断", color: "#ffffff", stateType: "MAIN", deviceType: "WT" },
//   { id: 7, state: "1", stateDesc: "正常运行", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 8, state: "10", stateDesc: "就地停机", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 9, state: "11", stateDesc: "风机故障停机", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 10, state: "12", stateDesc: "维护停机", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 11, state: "13", stateDesc: "电网故障停机", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 12, state: "14", stateDesc: "通讯中断", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 13, state: "15", stateDesc: "未知状态", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 14, state: "2", stateDesc: "电网限功率运行", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 15, state: "3", stateDesc: "主控限功率运行", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 16, state: "4", stateDesc: "手动限功率运行", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 17, state: "5", stateDesc: "小风待机", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 18, state: "6", stateDesc: "技术待命", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 19, state: "7", stateDesc: "电网限功率停机", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 20, state: "8", stateDesc: "远程停机", color: null, stateType: "SUB", deviceType: "WT" },
//   { id: 21, state: "9", stateDesc: "天气停机", color: null, stateType: "SUB", deviceType: "WT" },
// ]
