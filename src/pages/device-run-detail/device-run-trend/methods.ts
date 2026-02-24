/*
 * @Author: xiongman
 * @Date: 2023-10-16 13:38:13
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-16 13:38:13
 * @Description: 实时运行趋势-方法们
 */

import { dayH2Mi } from "@configs/time-constant.ts"
import { parseNum, uDate, validResErr } from "@utils/util-funs.tsx"

import { doBaseServer } from "@/api/serve-funs.ts"

import { DVS_RUN_TREND_PARAM_MAP } from "./configs.ts"
import { IDvsRunTrendChart } from "./dvs-run-trend-options.ts"
import { IDvsPointTrendData, IDvsPointTrendParams } from "./types.ts"

export async function getDvsPointTrendData(params: IDvsPointTrendParams): Promise<IDvsRunTrendChart> {
  const { deviceType, ...others } = params
  type TParams = Omit<IDvsPointTrendParams, "deviceType">
  const resData = await doBaseServer<TParams, IDvsPointTrendData[]>("getDevicePointTrendData", others)
  if (validResErr(resData) || !Array.isArray(resData)) return dvsPointTrendData2ChartData(deviceType, null)
  return dvsPointTrendData2ChartData(deviceType, resData)
}

function dvsPointTrendData2ChartData(
  dvsType: IDvsPointTrendParams["deviceType"],
  trendData: IDvsPointTrendData[],
): IDvsRunTrendChart {
  const chartInfos = DVS_RUN_TREND_PARAM_MAP[dvsType]
  const result: IDvsRunTrendChart = { deviceType: dvsType, xAxis: [], data: null }
  if (!chartInfos?.length || !trendData?.length) return result

  const { xAxis, dataMap } = dvsPointTrendData2DataMap(trendData)
  const cData = chartInfos.map(({ title, field, unit, color }) => ({ title, unit, color, data: dataMap[field] || [] }))

  return { deviceType: dvsType, xAxis, data: cData }
}

function dvsPointTrendData2DataMap(trendData: IDvsPointTrendData[]) {
  return reduceData2DataMap(trendData)
}

export function reduceData2DataMap<TD extends Record<string, any>>(dataList: TD[]) {
  type TValFields = keyof Omit<TD, "stationCode" | "deviceCode" | "Time">
  let fields: TValFields[]
  return dataList.reduce(
    (prev, { stationCode, deviceCode, Time, ...others }) => {
      prev.xAxis.push(uDate(Time, dayH2Mi))
      fields = Object.keys(others) as TValFields[]
      fields.forEach((field) => {
        if (!prev.dataMap[field]) prev.dataMap[field] = []
        prev.dataMap[field].push(parseNum(others[field], 4, null))
      })
      return prev
    },
    { xAxis: [], dataMap: {} as Record<TValFields, (number | null)[]> },
  )
}
