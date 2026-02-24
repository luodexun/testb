/*
 * @Author: xiongman
 * @Date: 2022-12-12 17:11:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-22 10:51:02
 * @Description: 场站信息数据类型
 */

import { TOptions, TTreeOptions } from "@/types/i-antd.ts"
import { TSiteType } from "@/types/i-config.ts"

// 接口返回的场站信息数据
export interface IStationData {
  id: number
  stationCode: string
  fullName: string // "清远连州风电场"
  shortName: string // "连州风电场"
  stationType: TSiteType
  parentComId: number
  maintenanceComId: number
  tags?: ITags
}

interface ITags {
  ip?: string
  port?: number
  priority?: number
}

interface IStnCode2Info {
  [stnCode: string]: IStationData
}

// 场站信息全局变量数据类型
export interface IAtomStation {
  stationList: IStationData[]
  stationMap: IStnCode2Info
  // 场站下拉框options数据
  stationOptions: TOptions<string>
  stationOptions4Id: TOptions<number>
  stationOfRegionOptions?: TTreeOptions
  stationOfRegionOptions4Id?: TTreeOptions
}

// 区域公司数据
export interface IProjectCompany {
  id: number
  fullName: string
  shortName: string //项目公司或检修公司名称
  parentComId: number //项目公司或检修公司id
  type: string //项目公司'PROJECT'、检修基地'MAINTENANCE'
  reserve: null | string
}
