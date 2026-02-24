import { TSiteType } from "@/types/i-config.ts"

// 发电量完成率数据结构
export interface IStnProductionData {
  stationCode: string // "441882S01"
  stationFullName: string // "清远连州光伏电场"
  stationShortName: string // "连州光伏电场" //场站名称
  stationTypeCode: TSiteType
  stationTypeName: string // "光伏/光热"
  monthlyProduction: number // 0.0 //本月实际发电量
  monthlyProductionPlan: number // 0.0 //本月计划发电量
  yearlyProduction: number //654.0 //本年实际发电量
  yearlyProductionPlan: number //0.0 //本年计划发电量
}
