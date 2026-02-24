/*
 * @Author: xiongman
 * @Date: 2023-10-16 16:39:20
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-16 16:39:20
 * @Description: 风机运行详情-温度曲线-方法们
 */

import { reduceData2DataMap } from "@pages/device-run-detail/device-run-trend/methods.ts"
import { validResErr } from "@utils/util-funs.tsx"

import { doBaseServer } from "@/api/serve-funs.ts"

import { IDvsTempCurveChart } from "./curve-options.ts"
import { IDvsSystemTempTrendData, IDvsSystemTempTrendParams } from "./types.ts"

export async function getDvsSystemTempTrendData(params: IDvsSystemTempTrendParams): Promise<IDvsTempCurveChart> {
  const resData = await doBaseServer<IDvsSystemTempTrendParams, IDvsSystemTempTrendData>(
    "getDeviceSystemTempTrendData",
    params,
  )
  if (validResErr(resData)) return dvsSysTempTrendData2Chart({ data: [], point: [] })
  return dvsSysTempTrendData2Chart(resData)
}

function dvsSysTempTrendData2Chart(trendData: IDvsSystemTempTrendData): IDvsTempCurveChart {
  const result: IDvsTempCurveChart = { xAxis: [], data: null }
  if (!trendData?.data?.length) return result
  const { data, point } = trendData
  const { xAxis, dataMap } = dvsSysTempTrendData2DataMap(data)
  result.xAxis = xAxis
  result.data = point.map(({ pointName, pointDesc, unit }) => ({
    title: pointDesc,
    unit,
    data: dataMap[pointName] || [],
  }))

  return result
}

function dvsSysTempTrendData2DataMap(trendData: IDvsSystemTempTrendData["data"]) {
  return reduceData2DataMap(trendData)
}
