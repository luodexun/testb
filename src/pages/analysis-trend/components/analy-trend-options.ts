/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:28:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-13 09:32:34
 * @Description: 区域中心-指标总览-运行趋势图表配置数据
 */

import { baseDataZoom, baseGrid, baseLegend, baseTooltip, baseXAxis, baseYAxis } from "@configs/chart-fragments.ts"

import { IBaseChartOption } from "@/types/i-page.ts"

export interface IAnalyTrendChartData extends Omit<IBaseChartOption, "data"> {
  data: {
    deviceName: string
    deviceCode: string
    pointName: string
    pointDesc: string
    stationName: string
    data: (number | null)[]
    ls: number[]
    title: string
    ponit: string
  }[]
  series?: any[]
}
function getChartParams(data: IAnalyTrendChartData["data"]) {
  const result = { legend: [], series: [] }
  if (!data?.length) return result
  let lineName: string

  return data.reduce((prev, { stationName, deviceName, pointDesc, pointName, data }) => {
    lineName = stationName
      ? `${stationName}-${deviceName}-${pointName}-${pointDesc}`
      : `${deviceName}-${pointName}-${pointDesc}`
    prev.legend.push(lineName)
    prev.series.push({ name: lineName, data, type: "line", smooth: true })
    return prev
  }, result)
}

export default function analyTrendOptions(chartData: IAnalyTrendChartData) {
  const { data } = chartData || {}
  const { legend, series } = getChartParams(data)

  return {
    grid: baseGrid,
    legend: { ...baseLegend, data: legend },
    toolbox: { feature: { saveAsImage: { name: "趋势分析曲线", title: "保存为图片" } } },
    tooltip: baseTooltip,
    dataZoom: baseDataZoom,
    xAxis: { ...baseXAxis, type: "time" },
    yAxis: baseYAxis,
    series,
  }
}
