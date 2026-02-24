/*
 * @Author: xiongman
 * @Date: 2023-09-04 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-10-24 16:11:15
 * @Description: 区域中心-功率总览-功率图表配置方法
 */

import { baseAxisLabel, baseDataZoom, baseGrid, baseTooltip, baseYAxis, legendText } from "@configs/chart-fragments.ts"
import { TTrendOption } from "@pages/site-agvc/types"

import { tranformSeries } from "../methods/trend-chart"

export function areaPowerOption(params: TTrendOption) {
  const { xAxis, data, type } = params || { xAxis: [], data: [], type: "AGC" }
  const { series, legend } = tranformSeries(data, type)
  const actTooltip = {
    ...baseTooltip,
    formatter: function (params: any) {
      const content = [params[0].name]
      params.forEach((item: { marker: string; seriesName: string; data: number }) => {
        content.push(`${item.marker}${item.seriesName}: ${item.data}`)
      })
      return content.join("<br>")
    },
  }
  return {
    grid: baseGrid,
    tooltip: actTooltip,
    dataZoom: baseDataZoom,
    legend: { data: legend, textStyle: legendText },
    xAxis: {
      type: "category",
      data: xAxis,
      axisTick: { show: false },
      axisLine: { show: true, color: "#30688a" },
      nameTextStyle: { color: "#95b5ec" },
      axisLabel: baseAxisLabel,
    },
    yAxis: baseYAxis,
    series,
  }
}
