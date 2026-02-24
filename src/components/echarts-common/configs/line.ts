/*
 * @Author: chenmeifeng
 * @Date: 2023-12-04 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-02-02 10:07:04
 * @Description: echarts-柱状图、折线图图表配置方法
 */

import { baseDataZoom, baseLegend, baseTooltip } from "@configs/chart-fragments.ts"

import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

import { getToolbox } from "./index"

export interface lineChartData extends IBaseChartOption {
  series: any
  downloadFileName?: string
}
export function lineOrBarOption(params: lineChartData) {
  const { xAxis, series, downloadFileName } = params || { xAxis: [], series: [], downloadFileName: "" }
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
  const option = {
    grid: { left: 50, right: 30, top: 50, bottom: 60, containLabel: true },
    tooltip: actTooltip,
    dataZoom: baseDataZoom,
    legend: {
      // data: legend,
      ...baseLegend,
    },
    toolbox: getToolbox(downloadFileName ?? "发电量报表"),
    xAxis: {
      type: "category",
      data: xAxis,
      axisTick: { show: false },
      axisLine: { show: true, color: "#30688a" },
      nameTextStyle: { color: "#95b5ec" },
      axisLabel: {
        color: "#95b5ec",
        fontSize: 12,
        // formatter: function (xLabel: string) {
        //   return xLabel.substring(5)
        // },
      },
    },
    yAxis: {
      type: "value",
    },
    series,
  }
  return option
}
