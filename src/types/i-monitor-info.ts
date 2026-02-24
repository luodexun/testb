/*
 * @Author: xiongman
 * @Date: 2023-09-21 12:17:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-10 14:13:02
 * @Description:
 */

import { TDeviceType, TSiteType } from "@/types/i-config.ts"

// 区域综合信息\场站综合信息-基础信息
export interface IMonitorBaseInfo {
  count: number // 装机台数
  capacity: number // 装机容量
  rate?: number // 出力率, 计算所得的
}

// 区域运行综合信息
export interface ICenterRunDataMQ {
  activePower: number // 3490 // 总有功
  dailyProduction: number // 3490 // 日发电量
  monthlyProduction: number // 月发电量
  yearlyProduction: number // 年发电量
  windSpeed: number // 风速
}

// 区域发电量完成率接口数据
export interface ICenterProductionData {
  monthlyProduction: number //  7300
  monthlyProductionPlan: number //  58000000
  yearlyProduction: number //  7300
  yearlyProductionPlan: number //  666000000
}

// 综合统计信息-获取区域中心综合信息
export interface ICenterInfoData extends IMonitorBaseInfo, ICenterProductionData, ICenterRunDataMQ {
  espcsInstalledCapacity: number | null // 储能装机容量
  espcsNum: number | null // 储能逆变器设备数量
  pvinvInstalledCapacity: number | null // 光伏装机容量
  pvinvNum: number | null // 光伏逆变器设备数量 12
  wtInstalledCapacity: number | null // 风电装机容量 2500
  wtNum: number | null // 风机设备数量 100
  totalInstalledCapacity: number | null // 总装机容量 3100
  stationENum: number | null // 储能场站数量 1
  stationSNum: number | null // 光伏场站数量 1
  stationWNum: number | null // 风电场站数量 1
}

// 所有场站运行综合信息
export interface IStationRunDataMQ {
  [siteId: string]: {
    [dvsType in TDeviceType]: ICenterRunDataMQ
  }
}

interface IDataOfSiteMonitorInfo {
  // 风光储
  dailyProduction: number | null // 0.0
  activePower: number | null // 0.0
  // 风
  windSpeed: number | null // 0.0
  // 光伏
  efficiency: number | null // 0.0
  irradiance?: number | null // 0.0
  // 储能
  dailyCharge: number | null // 0.0 // 日充
  dailyDischarge: number | null // 日放
  totalIrradiance: number | null // 辐射
}
// 场站统计信息-获取场站综合信息
export interface ISiteMonitorInfo extends IMonitorBaseInfo, IDataOfSiteMonitorInfo {
  maintenanceComId?: number
  maintenanceComShortName?: string
  stationId: number // 4
  stationCode: string // "441882H01"
  stationFullName: string // "清远连州风光储电场"
  stationShortName: string // "连州风光储电场"
  stationTypeCode: TSiteType // "H"
  stationTypeName: string // "风光储"
  projectComId: number //  1
  projectComFullName: string // "清远风电开发有限公司"
  projectComShortName: string // "清远公司"
  regionComId: number // 1
  regionComFullName: string // "华润广东新能源有限公司"
  regionComShortName: string // "广东新能源"
  totalInstalledCapacity: number //  6200
  wtNum: number | null // 50
  wtInstalledCapacity: number | null //  5000
  pvinvNum: number | null // 6
  pvinvInstalledCapacity: number | null //  600
  espcsNum: number | null // 6
  espcsInstalledCapacity: number | null //  600
  wtRate: number | null // 出力率, 计算所得的
  pvinvRate: number | null // 出力率, 计算所得的
  espcsRate: number | null // 出力率, 计算所得的
  data?: IDataOfSiteMonitorInfo // 接口中携带
}

// 接口响应数据 getStationInfoData
export interface IStationInfoData {
  [siteCode: string]: ISiteMonitorInfo
}
// 按设备类型映射的接口响应数据 getStationInfoData
export type TStnMonitorDataMap = {
  [dvsType in TDeviceType]?: IStationInfoData | null
}

export interface IDvsSignalRecordInfo {
  id?: number // 5
  deviceId?: number // 1 //设备id,需要映射成设备名称
  signState?: string // "02" //挂牌类型
  datasource?: string //  "手动挂牌"
  remark?: string // "班组C巡检" //备注
  createBy?: string // "dengchen"
  createTime?: string //  "2023-05-19T07:44:13.323+00:00"
  signStateCode?: string //  "02"
  signDesc?: string //  "巡检"
  endBy?: string | null
  endTime?: string | null
  stationId?: number
}

export interface IDvsSignUpdateParams {
  remark: string // "班组D巡检" // 字段存在则修改记录，不存在则不修改
  // 新增挂牌状态
  deviceId?: number // 2
  signState?: string // "01"
  createBy?: string // "test"
  createTime?: number // 1684482253323
  // 修改挂牌信息,结束挂牌状态
  id?: number | string // 1
  // 结束挂牌状态
  endBy?: string // "邓琛" // 字段存在则修改记录，不存在则不修改
  endTime?: number // 1684888888888 // 字段存在则修改记录，不存在则不修改
}
