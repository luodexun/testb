/*
 * @Author: xiongman
 * @Date: 2023-10-10 17:10:40
 * @LastEditors: xiongman
 * @LastEditTime: 2023-10-10 17:10:40
 * @Description: 等效利用小时数-方法们
 */

import { dayY2M } from "@configs/time-constant.ts"
import { isNumVal, parseNum, validResErr, vDate } from "@utils/util-funs.tsx"

import { doBaseServer } from "@/api/serve-funs.ts"

import {
  IDealStnUlzHourMap,
  IStnUlzHourParams,
  IStnUtilizationHour,
  TDealStnUlzHour2StnMap,
  TDealStnUlzHour2TimeMap,
} from "./types.ts"
import { IHourChartData } from "./utilization-hours-option.ts"

export async function getStnUtilizationHourTrend(offsetMonth: number): Promise<IDealStnUlzHourMap> {
  const resData = await doBaseServer<IStnUlzHourParams, IStnUtilizationHour[]>("getStationUtilizationHourTrendData", {
    offsetMonth,
  })
  if (validResErr(resData)) return { dataMap: null, deviceType: [], xAxis: [] }
  return dealStnUlzHourData(resData)
}

function dealStnUlzHourData(ulzHourData: IStnUtilizationHour[]): IDealStnUlzHourMap {
  // 收集时间轴数据
  const timeList = ulzHourData.map(({ Time }) => Time)
  const xAxis = Array.from(new Set(timeList)).sort((a, b) => (vDate(a, dayY2M).isBefore(vDate(b, dayY2M)) ? -1 : 1))
  // 收集设备类型数据
  let dvsType = ulzHourData.map(({ deviceType }) => deviceType)
  dvsType = Array.from(new Set(dvsType))

  const timeMap: TDealStnUlzHour2TimeMap = xAxis.reduce((prev, next) => (prev[next] = {}) && prev, {})
  // 先按时间分组，再按场站分组
  const data4TimeMap = ulzHourData.reduce((prev, next) => {
    if (!prev[next.Time][next.stationCode]) prev[next.Time][next.stationCode] = {}
    prev[next.Time][next.stationCode][next.deviceType] = next.utilizationHour
    return prev
  }, timeMap)

  return { xAxis, dataMap: data4TimeMap, deviceType: dvsType }
}

export function stnUlzHourMap2ChartData(ulzHourMap: IDealStnUlzHourMap, stnCode: string | null): IHourChartData {
  const { xAxis, dataMap, deviceType } = ulzHourMap || {}
  if (!dataMap) return { xAxis: [], data: {}, deviceType: [] }
  let time2StnMap: TDealStnUlzHour2StnMap, stn2DvsTypeMap: TDealStnUlzHour2StnMap, ulzHour: null | number
  const time2DvsTypeMap: TDealStnUlzHour2StnMap = {}
  Object.keys(dataMap).forEach((time) => {
    // 时间下的map
    time2StnMap = dataMap[time]
    if (stnCode) {
      // 指定场站下的map
      stn2DvsTypeMap = (time2StnMap[stnCode] || {}) as TDealStnUlzHour2StnMap
    } else {
      // 各个场站下的map
      stn2DvsTypeMap = Object.keys(time2StnMap).reduce((prev, stnCode) => {
        deviceType.forEach((dvsType) => {
          ulzHour = time2StnMap[stnCode][dvsType] ?? null
          if (!isNumVal(prev[dvsType]) && !isNumVal(ulzHour)) {
            prev[dvsType] = null
          } else {
            prev[dvsType] = parseNum(parseNum(prev[dvsType]) + parseNum(ulzHour))
          }
        })
        return prev
      }, {})
    }
    time2DvsTypeMap[time] = stn2DvsTypeMap
  })
  const dvsType4HourDataMap = deviceType.reduce(
    (prev, dvsType) => {
      prev[dvsType] = xAxis.map((time) => time2DvsTypeMap[time][dvsType] ?? null)
      prev["total"] = prev[dvsType].map((hour: null | number, index: number) => {
        if (!isNumVal(hour) && !isNumVal(prev["total"]?.[index])) return null
        return parseNum(parseNum(hour) + parseNum(prev["total"]?.[index]))
      })
      return prev
    },
    {} as IHourChartData["data"],
  )
  return { xAxis, data: dvsType4HourDataMap, deviceType }
}
