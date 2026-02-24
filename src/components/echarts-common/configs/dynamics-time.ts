/*
 * @Author: chenmeifeng
 * @Date: 2025-03-17 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-13 16:13:43
 * @Description: echarts-时间轴
 */

import { baseDataZoom, baseLegend, baseTooltip } from "@configs/chart-fragments.ts"
import { EChartsOption } from "echarts"
import * as echarts from "echarts"

import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

import { commonBaseLegend, commonBaseXAis, commonBaseYAxis } from "./common-echarts-data"

export interface lineChartData extends IBaseChartOption {
  series: any[]
  screenWidth: number
  axisLabel?: any
  yAxisProps: EChartsOption["YAXisOption"]
  showLegend?: boolean
}
export function dynamicsTimeLineOption(params: lineChartData) {
  const {
    series,
    screenWidth,
    yAxisProps = {},
    axisLabel,
    showLegend = true,
  } = params || { showLegend: true, xAxis: [], series: [], yAxisProps: {} }

  const option: EChartsOption = {
    grid: { left: "5%", right: "5%", top: "10%", bottom: "7%", containLabel: true },
    tooltip: {
      ...baseTooltip,
      formatter: function (params) {
        let result = params[0].axisValueLabel + "<br/>"
        params.forEach((param) => {
          // 自定义数值格式，显示4位小数
          const value = param.value[1]
          result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${param.color};"></span>`
          result += param.seriesName + ": " + value + "<br/>"
        })
        return result
      },
    },
    dataZoom: baseDataZoom,
    legend: {
      ...baseLegend,
    },
    // toolbox: getToolbox(downloadFileName ?? "发电量报表"),
    xAxis: {
      type: "time",
      ...commonBaseXAis({ screenWidth, axisLabel }),
      splitLine: {
        show: false,
      },
    },
    yAxis: yAxisProps,
    series: series,
  }
  return option
}
