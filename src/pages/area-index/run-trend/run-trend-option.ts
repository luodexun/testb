/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:28:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-17 16:55:28
 * @Description: 区域中心-指标总览-运行趋势图表配置数据
 */

import { baseAxisLabel, baseDataZoom, baseGrid, baseLegend, baseTooltip, baseYAxis } from "@configs/chart-fragments.ts"
import { UNIT } from "@configs/text-constant.ts"
import { reduceList2KeyValueMap, TlargeUnit } from "@utils/util-funs.tsx"

import { TDeviceType } from "@/types/i-config.ts"
import { IBaseChartOption, TYAxisInfo } from "@/types/i-page.ts"

import { NEED_EVO_UNITS, TREND_PARAM_MAP } from "./configs.ts"
import { IStnPointTrendParams } from "./types.ts"

export interface IRunTrendChartData extends Omit<IBaseChartOption, "data"> {
  deviceType: IStnPointTrendParams["deviceType"] | null
  data: { title: string; unit: string; data: (number | null)[]; unitEvo?: TlargeUnit; color?: string }[] | null
}

export const Y_AXIS_INFO: TYAxisInfo = {
  WT: [
    { title: "风速", unit: UNIT.WIND, position: "left" },
    { title: "功率", unit: UNIT.POWER_K, position: "right", offset: 0 },
    { title: "无功功率", unit: UNIT.REACTIVE, position: "right", offset: 60 },
  ],
  PVINV: [
    { title: "辐照度", unit: UNIT.RADIATE, position: "left" },
    { title: "功率", unit: UNIT.POWER_K, position: "right", offset: 0 },
    { title: "无功功率", unit: UNIT.REACTIVE, position: "right", offset: 60 },
  ],
  ESPCS: [
    { title: "功率", unit: UNIT.POWER_K, position: "left" },
    { title: "无功功率", unit: UNIT.REACTIVE, position: "right" },
  ],
}

export function crtYAxis({ title, offset, position }: TYAxisInfo[TDeviceType][0]) {
  return { name: title, offset, position, ...baseYAxis }
}

export function crtSeries({
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
    lineStyle: { color },
  }
}

export function crtDefaultData(dvsType: IRunTrendChartData["deviceType"]) {
  const trendParam = TREND_PARAM_MAP[dvsType || "WT"]
  const theData = trendParam.map(({ title, unit, color }) => ({ title, unit, color, data: [] }))
  return crtLegend0Series(dvsType || "WT", theData)
}
export function crtLegend0Series(dvsType: IRunTrendChartData["deviceType"], chartData: IRunTrendChartData["data"]) {
  if (!chartData?.length) {
    return crtDefaultData(dvsType || "WT")
  }
  const yAxisInfos = Y_AXIS_INFO[dvsType] || Y_AXIS_INFO["WT"]
  const yAxis = yAxisInfos.map(crtYAxis)

  const unit2Index = reduceList2KeyValueMap(yAxisInfos, { vField: "unit" }, (_, i) => i)

  let name: string, yIndex: number
  return chartData.reduce(
    (prev, { title, unit, unitEvo, data, color }) => {
      name = `${title}(${unit})`
      yIndex = unit2Index[unit] ?? 0
      if (NEED_EVO_UNITS.includes(unit)) {
        unit = `${UNIT[unitEvo] || ""}${unit}`
        name = `${title}(${unit})`
      }
      prev.legend.push(name)
      prev.colors.push(color)
      prev.series.push(crtSeries({ name, data, yIndex, color }))
      return prev
    },
    { legend: [], series: [], colors: [], yAxis },
  )
}

export default function runTrendOption(params: IRunTrendChartData) {
  const { xAxis, deviceType, data } = params || { deviceType: null, xAxis: [], data: null }
  const { legend, series, yAxis } = crtLegend0Series(deviceType, data)
  const len = yAxis.length > 2 ? yAxis.length - 2 : 0
  const gridRight = len * 60

  return {
    grid: { ...baseGrid, top: 50, right: gridRight },
    legend: { data: legend, ...baseLegend },
    tooltip: baseTooltip,
    dataZoom: baseDataZoom,
    xAxis: { type: "category", data: xAxis, boundaryGap: true, axisLabel: baseAxisLabel },
    yAxis,
    series,
  }
}
