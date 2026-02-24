/*
 * @Author: chenmeifeng
 * @Date: 2024-07-08 15:29:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 13:54:44
 * @Description: 
 */
import { doBaseServer } from "@/api/serve-funs"
import { parseNum, validResErr } from "@/utils/util-funs"

// export const getElecData = async () => {
//   const res = await doBaseServer("getCenterProduction")
//   const valid = validResErr(res)
//   if (valid && !res) return null
//   const result = res
//   result.monthlyProduction = result?.monthlyProduction / 10000 || 0
//   result.monthlyProductionPlan = result?.monthlyProductionPlan / 10000 || 0
//   result.yearlyProduction = result?.yearlyProduction / 10000 || 0
//   result.yearlyProductionPlan = result?.yearlyProductionPlan / 10000 || 0

//   return {
//     monthlyProduction: result.monthlyProduction,
//     yearlyProduction: result.yearlyProduction,
//     monthRate: parseNum((result?.monthlyProduction / result?.monthlyProductionPlan) * 100),
//     yearRate: parseNum((result?.yearlyProduction / result?.yearlyProductionPlan) * 100),
//   }
// }
export const getElecData = async (stnType = "STATION_CODE",valkey = "yearlyUtilizationHour",) => {
  const res = await doBaseServer("getScreenPoint", { groupByPath: stnType })
  const valid = validResErr(res)
  if (valid) return false
  const result = res?.sort((a, b) => {
    const resSort = b[valkey] - a[valkey]
    return resSort
  })
  const series = [...result?.map((i) => i[valkey])] || []
  const key = stnType === "REGION_COM_ID"
  ? "regionComShortName"
  : stnType === "MAINTENANCE_COM_ID"
    ? "maintenanceComFullName"
    : "stationShortName"
  const xAxisData = result?.map((i) => i[key])
  return {
    allData: result,
    series,
    xAxis: xAxisData
  }
}
