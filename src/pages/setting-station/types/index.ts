import { IStationData } from "@/types/i-station"

export interface IStationIndexInfo extends IStationData {
  maintenanceComShortName?: string
  projectComShortName?: string
  edit?: boolean
}

// 查询表单设置 options 的名称
export type TStationIdxSchFormField = "stationId"

export interface IStationIdxListParam {
  stationId: string
}

export interface IProjectCompany {
  id: number
  fullName: string
  shortName: string //项目公司或检修公司名称
  parentComId: number //项目公司或检修公司id
  type: string //项目公司'PROJECT'、检修基地'MAINTENANCE'
  reserve: null | string
}
