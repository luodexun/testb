/*
 * @Author: chenmeifeng
 * @Date: 2023-12-19 10:34:50
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-27 14:35:48
 * @Description: 条形图配置
 */
import { baseDataZoom, baseLegend, baseTooltip } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"

import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

import { getToolbox } from "./index"

// import { tranformSeries } from "../methods/trend-chart"

export interface HorizontalBarChartData extends IBaseChartOption {
  series: echarts.BarSeriesOption
  xAxis: any
}
export function horizontalBarOption(params: HorizontalBarChartData) {
  const { xAxis, series } = params || { xAxis: [], series: [] }
  // const { series, legend } = tranformSeries(data, type)
  const actTooltip = {
    ...baseTooltip,
    formatter: function (params) {
      let res = params[0].name
      for (let i = 0; i < params.length; i++) {
        res += "<br>" + params[i].marker + params[i].seriesName + "：" + parseNum(params[i].data)
      }
      return res
    },
  }
  const option: echarts.EChartsOption = {
    grid: { left: 50, right: 30, top: 30, bottom: 60, containLabel: true },
    tooltip: actTooltip as echarts.EChartsOption["tooltip"],
    dataZoom: baseDataZoom,
    legend: {
      ...baseLegend,
    },
    toolbox: getToolbox("发电量报表"),
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: "category",
      data: xAxis,
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: "#30688a" } },
      nameTextStyle: { color: "#95b5ec" },
      axisLabel: {
        color: "#95b5ec",
        fontSize: 12,
        // formatter: function (xLabel: string) {
        //   return xLabel.substring(5)
        // },
      },
    },
    series,
  }
  return option
}
