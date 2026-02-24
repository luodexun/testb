/*
 * @Author: xiongman
 * @Date: 2023-10-12 10:25:36
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-17 16:48:47
 * @Description: 运行趋势-方法们
 */

import { UNIT } from "@configs/text-constant.ts"
import { dayH2Mi } from "@configs/time-constant.ts"
import { compareEvo, evoluateNum, isNumVal, parseNum, uDate, validResErr } from "@utils/util-funs.tsx"

import { doBaseServer } from "@/api/serve-funs.ts"

import { TREND_PARAM_MAP } from "./configs.ts"
import { IRunTrendChartData } from "./run-trend-option.ts"
import { IStnPointTrendData, IStnPointTrendParams } from "./types.ts"

export async function getStnPointTrendData(params: IStnPointTrendParams): Promise<IRunTrendChartData> {
  const resData = await doBaseServer<IStnPointTrendParams, IStnPointTrendData[]>("getStationPointTrendData", params)
  if (validResErr(resData) || !Array.isArray(resData)) return dealTrendData2Chart(params.deviceType, null)
  return dealTrendData2Chart(params.deviceType, resData)
}

function dealTrendData2Chart(
  dvsType: IStnPointTrendParams["deviceType"],
  trendData: IStnPointTrendData[],
): IRunTrendChartData {
  const chartInfos = TREND_PARAM_MAP[dvsType]
  const result: IRunTrendChartData = { deviceType: dvsType, xAxis: [], data: null }
  if (!chartInfos?.length || !trendData?.length) return result
  const needEvo4Powers = chartInfos.filter(({ unit }) => UNIT.POWER_K === unit)
  const needEvo4Reactives = chartInfos.filter(({ unit }) => UNIT.REACTIVE === unit)
  // 出线总功率单位是MW
  const actTrendData = trendData?.map((i) => {
    return { ...i, outLinePower: i.outLinePower * 1000 }
  })
  const { xAxis, dataMap } = trendData2DataMap(actTrendData)
  const needEvoData4Powers = needEvo4Powers.map(({ field }) => dataMap[field] || [])
  const needEvoData4Reactives = needEvo4Reactives.map(({ field }) => dataMap[field] || [])
  const initEvoInfo: ReturnType<typeof compareEvo> = { largeEvo: 1 }
  let evoInfo4Powers: ReturnType<typeof compareEvo> = initEvoInfo
  let evoInfo4Reactives: ReturnType<typeof compareEvo> = initEvoInfo
  const powerDatas = needEvoData4Powers.flat(1)
  const reactiveDatas = needEvoData4Reactives.flat(1)

  const data4Powers = powerDatas.filter((p) => !!compareEvo(p).largeUnit)
  const data4Reactives = reactiveDatas.filter((p) => !!compareEvo(p).largeUnit)

  powerDatas.find((p) => !!(evoInfo4Powers = compareEvo(p)).largeUnit)
  reactiveDatas.find((p) => !!(evoInfo4Reactives = compareEvo(p)).largeUnit)

  if (data4Powers.length < Math.floor(powerDatas.length * 0.6)) {
    evoInfo4Powers = initEvoInfo
  }
  if (data4Reactives.length < Math.floor(reactiveDatas.length * 0.6)) {
    evoInfo4Reactives = initEvoInfo
  }
  // eslint-disable-next-line prefer-const
  let { largeUnit: lgUnit4Powers, largeEvo: lgEvo4Powers } = evoInfo4Powers
  // eslint-disable-next-line prefer-const
  let { largeUnit: lgUnit4Reactives, largeEvo: lgEvo4Reactives } = evoInfo4Reactives

  let theData: (number | null)[] = []
  const cData = chartInfos.map(({ title, field, unit, color }) => {
    theData = dataMap[field] || []
    if (unit === UNIT.POWER_K) {
      theData = theData.map((item) => (isNumVal(item) ? evoluateNum(item, lgEvo4Powers) : null))
      return { title, unit, unitEvo: lgUnit4Powers, color, data: theData }
    } else if (unit === UNIT.REACTIVE) {
      theData = theData.map((item) => (isNumVal(item) ? evoluateNum(item, lgEvo4Reactives) : null))
      return { title, unit, unitEvo: lgUnit4Reactives, color, data: theData }
    } else return { title, unit, color, data: theData }
  })

  return { deviceType: dvsType, xAxis, data: cData }
}

function trendData2DataMap(trendData: IStnPointTrendData[]) {
  return trendData.reduce(
    (prev, { stationCode, Time, ...others }) => {
      prev.xAxis.push(uDate(Time, dayH2Mi))
      Object.keys(others).forEach((field) => {
        if (!prev.dataMap[field]) prev.dataMap[field] = []
        prev.dataMap[field].push(parseNum(others[field], 2, null))
      })
      return prev
    },
    { xAxis: [], dataMap: {} },
  )
}
