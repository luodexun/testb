/*
 * @Author: xiongman
 * @Date: 2023-09-27 17:55:51
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-27 17:55:51
 * @Description: 风机运行详情-温度曲线
 */

import { baseAxisLabel, baseDataZoom, baseTooltip, legendText } from "@configs/chart-fragments.ts"

import { IBaseChartOption } from "@/types/i-page.ts"

export interface IDvsTempCurveChart extends Omit<IBaseChartOption, "data"> {
  data: { title: string; unit: string; data: (number | null)[]; color?: string }[] | null
}

function crtSeries({ name, data }: { name: string; data: (number | null)[] }) {
  return {
    name,
    data,
    type: "line",
    smooth: true,
    symbol: "circle",
    seriesLayoutBy: "row",
    emphasis: { focus: "series" },
    tooltip: {
      valueFormatter: function (value: number | null) {
        return `${value ?? "-"} ℃`
      },
    },
  }
}

function crtLegend0Series(chartData: IDvsTempCurveChart["data"]) {
  if (!chartData?.length) {
    return { legend: [], series: [crtSeries({ name: "温度", data: [] })] }
  }
  return chartData.reduce(
    (prev, { title, data }) => {
      prev.legend.push(title)
      prev.series.push(crtSeries({ name: title, data }))
      return prev
    },
    { legend: [], series: [] },
  )
}

// 风机运行详情-温度曲线
export function temperatureCurveOption(params: IDvsTempCurveChart) {
  const { xAxis, data } = params || { xAxis: [], data: null }

  const { legend, series } = crtLegend0Series(data)

  return {
    grid: { left: 40, right: 20, top: 40, bottom: 60 },
    legend: { data: legend, textStyle: legendText },
    tooltip: baseTooltip,
    dataZoom: baseDataZoom,
    xAxis: {
      type: "category",
      min: 0,
      axisTick: { show: false },
      axisLabel: baseAxisLabel,
      data: xAxis,
    },
    yAxis: [
      {
        name: "温度",
        type: "value",
        splitLine: { show: false },
        axisLine: { show: true },
        axisLabel: baseAxisLabel,
      },
    ],
    series,
  }
}
