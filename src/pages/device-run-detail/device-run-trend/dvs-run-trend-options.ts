/*
 * @Author: xiongman
 * @Date: 2023-09-27 17:44:28
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-27 17:44:28
 * @Description: 设备实时运行趋势-图表配置
 */

import { baseAxisLabel, baseDataZoom, baseLegend, baseTooltip, baseYAxis } from "@configs/chart-fragments.ts"
import { reduceList2KeyValueMap } from "@utils/util-funs.tsx"

import { TDeviceType } from "@/types/i-config.ts"
import { IBaseChartOption, TYAxisInfo } from "@/types/i-page.ts"

import { DVS_RUN_TREND_PARAM_MAP, DVS_RUN_TREND_Y_AXIS_INFO } from "./configs.ts"

export interface IDvsRunTrendChart extends Omit<IBaseChartOption, "data"> {
  deviceType: TDeviceType | null
  data: { title: string; unit: string; data: (number | null)[]; color?: string }[] | null
}

function crtYAxis({ title, offset, position }: TYAxisInfo[TDeviceType][0]) {
  return { name: title, min: 0, offset, position, ...baseYAxis }
}

function crtSeries({
  name,
  data,
  yIndex,
  color,
}: {
  name: string
  data: (number | null)[]
  yIndex: number
  color?: string
}) {
  return {
    name,
    data,
    type: "line",
    yAxisIndex: yIndex,
    smooth: true,
    symbol: "circle",
    seriesLayoutBy: "row",
    emphasis: { focus: "series" },
    lineStyle: { color }, // , shadowOffsetY: 4, shadowBlur: 8
  }
}

function crtDefaultData(dvsType: IDvsRunTrendChart["deviceType"]) {
  const trendParam = DVS_RUN_TREND_PARAM_MAP[dvsType || "WT"]
  const theData = trendParam.map(({ title, unit, color }) => ({ title, unit, color, data: [] }))
  return crtLegend0Series(dvsType || "WT", theData)
}
function crtLegend0Series(dvsType: IDvsRunTrendChart["deviceType"], chartData: IDvsRunTrendChart["data"]) {
  if (!chartData?.length) {
    return crtDefaultData(dvsType || "WT")
  }
  const yAxisInfos = DVS_RUN_TREND_Y_AXIS_INFO[dvsType] || DVS_RUN_TREND_Y_AXIS_INFO["WT"]
  const yAxis = yAxisInfos.map(crtYAxis)

  const unit2Index = reduceList2KeyValueMap(yAxisInfos, { vField: "unit" }, (_, i) => i)

  let name: string, yIndex: number
  return chartData.reduce(
    (prev, { title, unit, data, color }) => {
      name = `${title}(${unit})`
      prev.legend.push(name)
      prev.colors.push(color)
      yIndex = unit2Index[unit] ?? 0
      prev.series.push(crtSeries({ name, data, yIndex, color }))
      return prev
    },
    { legend: [], series: [], colors: [], yAxis },
  )
}

export function dvsRunTrendOption(params: IDvsRunTrendChart) {
  // 设备实时运行趋势-实时运行趋势
  const { xAxis, deviceType, data } = params || { deviceType: null, xAxis: [], data: null }
  const { legend, series, yAxis } = crtLegend0Series(deviceType, data)
  const len = yAxis.length > 2 ? yAxis.length - 2 : 0
  const gridRight = len * 50 + 50

  return {
    grid: { left: 40, right: gridRight, top: 40, bottom: 60 },
    legend: { data: legend, ...baseLegend },
    tooltip: baseTooltip,
    dataZoom: baseDataZoom,
    xAxis: {
      type: "category",
      min: 0,
      data: xAxis,
      boundaryGap: true,
      axisTick: { alignWithLabel: true },
      axisLabel: baseAxisLabel,
    },
    yAxis,
    series,
  }
}
