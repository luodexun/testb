/*
 * @Author: chenmeifeng
 * @Date: 2023-12-04 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-26 15:05:58
 * @Description: echarts-饼图图表配置方法
 */

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"

import { IBaseChartOption } from "@/types/i-page.ts"

import { getToolbox } from "./index"

export interface pieChartData extends IBaseChartOption {
  series: any
}
export function pieOption(params: pieChartData) {
  const { series } = params || { series: [] }

  const baseTooltip = {
    show: true,
    showDelay: 0,
    textStyle: { fontSize: 12, color: "#bbbbbb" },
    backgroundColor: "rgba(10,10,10,0.7)",
    borderColor: "rgba(24,29,37,1)",
    extraCssText: "padding: 4px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); max-height: 100%; overflow: auto;",
  }
  const actTooltip = {
    ...baseTooltip,
    trigger: "item",
  }
  const option: echarts.EChartsOption = {
    grid: { left: 50, right: 30, top: 30, bottom: 60, containLabel: true },
    tooltip: actTooltip as echarts.EChartsOption["tooltip"],
    dataZoom: baseDataZoom,
    legend: {
      ...baseLegend,
    },
    toolbox: getToolbox("发电量报表"),
    series,
  }
  return option
}
