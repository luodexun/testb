/*
 * @Author: chenmeifeng
 * @Date: 2025-09-25 13:53:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-25 15:46:26
 * @Description:
 */
import { baseAxisLabel, baseDataZoom, baseLegend, baseTooltip, baseYAxis } from "@configs/chart-fragments.ts"
import { evoluateNum, numberVal, uDate, vDate } from "@utils/util-funs.tsx"
import dayjs from "dayjs"

import { doRecordServer } from "@/api/serve-funs"
import { AREA_POWER_ELEMENT } from "@/configs/option-const"
import { dayH2Mi } from "@/configs/time-constant"
import { IRpPowerData } from "@/pages/analysis-power/types"
import { ISchParams } from "@/pages/area-power/types"
import { getStartAndEndTime } from "@/utils/form-funs"
import { validResErr } from "@/utils/util-funs"

import { IAreaPowerChartData, IchartData } from "../types"

export async function getAllStationLineData() {
  const startOfDay = dayjs().startOf("day")
  const endOfDay = vDate().add(7, "day").endOf("day")
  const { startTime, endTime } = getStartAndEndTime<number>([startOfDay as any, endOfDay as any], "", {
    startTime: 1,
    endTime: 1,
  })
  const params = {
    startTime,
    endTime,
    preDays: 1,
    preQrts: 16,
  }
  const resData = await doRecordServer<ISchParams, IRpPowerData>("getReportGLYCData", params)
  if (validResErr(resData)) return null
  // const resData = {
  //   ALL: [
  //     {
  //       stationCode: "410526W01",
  //       stationName: null,
  //       reportTime: null,
  //       forecastTime: 1716825600000,
  //       shortPredPower: 2366,
  //       ultraShortPredPower: null,
  //       preDays: null,
  //       preQrts: null,
  //       agvcPower: 23,
  //     },
  //     {
  //       stationCode: "410526W01",
  //       stationName: null,
  //       reportTime: null,
  //       forecastTime: 1716826600000,
  //       shortPredPower: 2266,
  //       ultraShortPredPower: null,
  //       preDays: null,
  //       preQrts: null,
  //       agvcPower: 245,
  //     },
  //   ],
  //   "410526W01": [
  //     {
  //       stationCode: "410526W01",
  //       stationName: null,
  //       reportTime: null,
  //       forecastTime: 1716825600000,
  //       shortPredPower: null,
  //       ultraShortPredPower: null,
  //       preDays: null,
  //       preQrts: null,
  //       agvcPower: 0,
  //     },
  //   ],
  //   "410527W01": [
  //     {
  //       stationCode: "410527W01",
  //       stationName: "连州风光储电场",
  //       reportTime: null,
  //       forecastTime: "2024-04-20 10:20:40",
  //       shortPredPower: 23,
  //       ultraShortPredPower: 112000,
  //       preDays: null,
  //       preQrts: null,
  //       agvcPower: 28.5,
  //     },
  //     {
  //       stationCode: "410527W01",
  //       stationName: "连州风光储电场",
  //       reportTime: null,
  //       forecastTime: "2024-04-20 10:35:40",
  //       shortPredPower: 26,
  //       ultraShortPredPower: 102155,
  //       preDays: null,
  //       preQrts: null,
  //       agvcPower: null,
  //     },
  //   ],
  // }
  const result = {}
  Object.keys(resData)?.forEach((key) => {
    const prev = resData[key]?.map((i) => {
      return {
        ...i,
        shortPredPower: i.shortPredPower !== null ? i.shortPredPower / 1000 : null, // 接口返回的是KW
        ultraShortPredPower: i.ultraShortPredPower !== null ? i.ultraShortPredPower / 1000 : null, // 接口返回的是KW
      }
    })
    result[key] = getchartData(prev)
  })
  return result
}
export function getchartData(data: any[]) {
  return data.reduce(
    (prev, { stationCode, forecastTime, ...others }) => {
      prev.xAxis.push(uDate(new Date(forecastTime).valueOf(), dayH2Mi))
      for (let i = 0; i < AREA_POWER_ELEMENT.length; i++) {
        const { value, style, label } = AREA_POWER_ELEMENT[i]
        if (!prev.data[value])
          prev.data[value] = {
            color: style.color,
            title: label,
            data: [],
          }
        prev.data[value].data.push(evoluateNum(numberVal(others[value]), 1) ?? null)
      }
      return prev
    },
    { xAxis: [], data: {} },
  )
}

function crtSeries(data: IAreaPowerChartData[string]) {
  return {
    type: "line",
    showSymbol: false,
    smooth: false,
    name: data?.title || "",
    data: (data?.data || []) as number[],
    itemStyle: { normal: { color: data?.color } },
  }
}
function getSeries(data: IAreaPowerChartData) {
  const result = { legend: [], series: [] }
  const dataArr = Object.values(data || {})
  if (!dataArr.length) return result
  return dataArr.reduce((prev, next) => {
    if (!Object.keys(next).length) return prev
    prev.legend.push(next.title)
    prev.series.push(crtSeries(next))
    return prev
  }, result)
}
export function areaPowerOption(params: IchartData) {
  const { xAxis, data } = params || { xAxis: [], data: {} }
  const { legend, series } = getSeries(data)
  return {
    grid: { left: 50, right: 30, top: 30, bottom: 20 },
    tooltip: baseTooltip,
    dataZoom: baseDataZoom,
    legend: { data: legend, ...baseLegend },
    xAxis: {
      type: "category",
      data: xAxis,
      axisTick: { show: false },
      axisLine: { show: true, color: "#30688a" },
      nameTextStyle: { color: "#95b5ec" },
      axisLabel: baseAxisLabel,
    },
    yAxis: [{ name: `功率(MW)`, ...baseYAxis }],
    series,
  }
}
