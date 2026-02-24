/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:28:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-17 11:33:58
 * @Description:
 */

import { baseDataZoom, baseGrid, baseLegend, baseTooltip, baseYAxis } from "@configs/chart-fragments.ts"

import { TAnlyScttrChartData } from "../types"

function getChartParams(data: TAnlyScttrChartData) {
  const result = { legend: [], series: [] }
  if (!data) return result
  return Object.entries(data).reduce((prev, [dvsName, data]) => {
    prev.legend.push(dvsName)
    prev.series.push({ name: dvsName, data, type: "scatter" })
    return prev
  }, result)
}

export default function analyScatterOptions(chartData: TAnlyScttrChartData) {
  const { legend, series } = getChartParams(chartData)

  return {
    grid: baseGrid,
    legend: { ...baseLegend, data: legend },
    toolbox: { feature: { saveAsImage: { name: "散点分析曲线", title: "保存为图片" } } },
    tooltip: {
      ...baseTooltip,
      trigger: "item",
      formatter: function (params: { seriesName: string; data: TAnlyScttrChartData[string][0]; marker: string }) {
        const { seriesName, data, marker } = params
        return `
        <div style="padding: 10px;">
          <p style="font-weight: bold;">${seriesName}</p>
          <p>${marker}${data.labels[0]}: ${data.value[0]}</p>
          <p>${marker}${data.labels[1]}: ${data.value[1]}</p>
          <p>${marker}时间: ${data.time}</p>
        </div>
      `
      },
    },
    dataZoom: baseDataZoom,
    xAxis: { ...baseYAxis, type: "value", splitLine: { show: false } },
    yAxis: baseYAxis,
    series,
  }
}
