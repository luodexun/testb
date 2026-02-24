/*
 * @Author: xiongman
 * @Date: 2023-10-10 10:55:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-15 17:55:24
 * @Description:
 */

import { ICompleteRateChartData } from "@pages/area-index/power-complete-rate/complete-rate-option.ts"
import { IStnProductionData } from "@pages/area-index/power-complete-rate/types.ts"
import { calcRate } from "@utils/device-funs.ts"
import { evoluateNum, isNumVal, validResErr } from "@utils/util-funs.tsx"

import { doNoParamServer } from "@/api/serve-funs.ts"
import { TYear0Month } from "@/types/i-config.ts"

// 查询发电量完成率数据
export async function getStationProductionData() {
  const resData = await doNoParamServer<IStnProductionData[]>("getStationProductionData")
  if (validResErr(resData)) return []
  return resData
}

// 处理发电量完成率数据，按年/月处理
export function stnPduData2ChartData(stnPduData: IStnProductionData[], chartType: TYear0Month): ICompleteRateChartData {
  const result: ICompleteRateChartData = { stations: [], planned: [], actual: [], rate: [] }
  if (!stnPduData?.length) return result
  const isMonth = chartType === "month"
  const fieldPlan = isMonth ? "monthlyProductionPlan" : "yearlyProductionPlan"
  const fieldActual = isMonth ? "monthlyProduction" : "yearlyProduction"
  let plan: number, actual: number, rate: number
  return stnPduData.reduce((prev, next) => {
    prev.stations.push(next.stationShortName)
    plan = evoluateNum(next[fieldPlan], 1)
    actual = evoluateNum(next[fieldActual], 1)
    rate = isNumVal(plan) && isNumVal(actual) && plan ? calcRate(actual, plan) : null
    prev.planned.push(plan)
    prev.actual.push(actual)
    prev.rate.push(rate)
    return prev
  }, result)
}
