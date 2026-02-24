/*
 * @Author: xiongman
 * @Date: 2023-09-04 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-28 15:18:23
 * @Description: 区域中心-功率总览-功率图表配置方法
 */

import { baseAxisLabel, baseLegend, baseTooltip, baseYAxis } from "@configs/chart-fragments.ts"
import { UNIT } from "@configs/text-constant.ts"
import { compareEvo, evoluateNum } from "@utils/util-funs.tsx"

import { IAreaPowerChartData, IchartData } from "../types"

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

  const allData = series.map((item) => item.data)
  let evoInfo: ReturnType<typeof compareEvo>
  allData.flat().find((p) => (evoInfo = compareEvo(p)).largeUnit)
  const { largeUnit, largeEvo } = evoInfo || { largeUnit: "", largeEvo: 1 }
  const pUnit = `${UNIT[largeUnit] || ""}${UNIT.POWER_K}`

  series.forEach((item) => {
    item.data = item.data.map((p: number) => evoluateNum(p, largeEvo))
  })

  return {
    grid: { left: 50, right: 30, top: 30, bottom: 20 },
    tooltip: baseTooltip,
    legend: { data: legend, ...baseLegend },
    xAxis: {
      type: "category",
      data: xAxis,
      axisTick: { show: false },
      axisLine: { show: true, color: "#30688a" },
      nameTextStyle: { color: "#95b5ec" },
      axisLabel: baseAxisLabel,
    },
    yAxis: [{ name: `功率(万${pUnit})`, ...baseYAxis }],
    series,
  }
}
