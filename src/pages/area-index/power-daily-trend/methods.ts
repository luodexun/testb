/*
 * @Author: xiongman
 * @Date: 2023-10-10 15:16:38
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-10 15:16:38
 * @Description: 日电量趋势-方法们
 */

import { dayY2D } from "@configs/time-constant.ts"
import { parseNum, uDate, validResErr } from "@utils/util-funs.tsx"

import { doNoParamServer } from "@/api/serve-funs.ts"

import { IDailyTrendChartData } from "./daily-trend-option.ts"
import { IStnPduTrend, IStnPduTrendData, IStnPduTrendDataAfterDeal } from "./types.ts"

export async function getStnPduTrendData(): Promise<IStnPduTrendDataAfterDeal> {
  const resData = await doNoParamServer<IStnPduTrendData>("getStationProductionTrendData")
  if (validResErr(resData)) return { xAxis: [], dataMap: null }
  return dealStnPduTrendData(resData)
}

function dealStnPduTrendData(trendData: IStnPduTrendData): IStnPduTrendDataAfterDeal {
  const stnCodeList = Object.keys(trendData || {})
  if (!stnCodeList?.length) return { xAxis: [], dataMap: null }
  const xAxis = (trendData[stnCodeList[0]] as IStnPduTrend[]).map(({ Time }) => uDate(Time, dayY2D))

  const dataMap = stnCodeList.reduce((prev, stnCode) => {
    prev[stnCode] = (trendData[stnCode] as IStnPduTrend[]).map(({ dailyProduction }) => dailyProduction)
    return prev
  }, {})
  return { xAxis, dataMap }
}

export function stnPduTrendData2ChartData(
  trendData: IStnPduTrendDataAfterDeal,
  checkedStn: string | null,
): IDailyTrendChartData {
  const { xAxis, dataMap } = trendData || { xAxis: [], dataMap: null }
  if (!dataMap) return { xAxis, data: [] }

  let data: number[]
  if (checkedStn) {
    data = dataMap[checkedStn] || []
  } else {
    data = Object.values(dataMap).reduce((prev, next) => {
      if (!prev.length) return next
      return prev.map((power, index) => parseNum(power, -1) + parseNum(next?.[index], -1))
    }, [])
  }

  return { xAxis, data }
}
