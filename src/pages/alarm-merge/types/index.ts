export interface IBatchStn2DvsTreeData {
  id: string | number
  key: string | number
  title: string
  deviceCode: string
  disabled?: boolean
  model: string
  stationCode: string
  stationName: string
  isLeaf?: boolean
  level?: number
  children?: IBatchStn2DvsTreeData[]
}

export interface IAlarmMgData {
  stationDesc: string //场站
  deviceTypeName: string //设备类型
  deviceId: null
  deviceDesc: string //设备名称
  alarmId: string //故障码
  alarmDesc: string //故障描述
  systemName: string //归属系统
  alarmLevelId: string
  alarmLevelName: string //故障等级
  brakeLevelName: string //停机等级
  actualStartTime: number //开始时间
  startTime: string | number //开始时间
  endTime: string | null //结束时间
  alarmNum: number
  confirmFlag: boolean
}
export interface IAlarmMergeSchForm {
  deviceIdList: number[]
  groupType: number
  sortType: number
  startTime: number
  endTime: number
}
export interface IQueryAlMgParams {
  data: IAlarmMergeSchForm
  params: {
    pageNum?: number
    pageSize?: number
  }
}
export type TAlarmmergeTbActInfo = {
  key: "ensure" | "detail"
  label: string
}
export interface IChooseForm {
  formStTime?: number
  formEndTime?: number
  groupType?: number
}
