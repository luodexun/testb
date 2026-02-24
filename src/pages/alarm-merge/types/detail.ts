export interface IAlMgDataInfo {
  stationDesc: string
  deviceTypeName: string
  deviceId: number
  deviceDesc: string
  alarmId: string
  alarmDesc: string
  systemId: number
  systemName: string
  alarmLevelId: number
  alarmLevelName: string
  brakeLevelId: number
  brakeLevelName: string
  startTime: string | number
  endTime: string | number
  confirmBy: string
  confirmTime: string | number
  confirmMsg: string
  confirmFlag: boolean
  status: number
}

export interface IAlMgSchForm {
  deviceIdList: number[]
  alarmIdList: number[]
  startTime: number
  endTime?: number
}
export interface IQueryAlMgDtParams {
  data: IAlMgSchForm
  params: {
    pageNum?: number
    pageSize?: number
  }
}
