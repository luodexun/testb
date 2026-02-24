/*
 * @Author: chenmeifeng
 * @Date: 2024-10-04 16:27:23
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-11 16:30:19
 * @Description: echarts-时间轴
 */

import { baseDataZoom, baseTooltip } from "@configs/chart-fragments.ts"
import { EChartsOption } from "echarts"
import * as echarts from "echarts"

import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

import { commonBaseLegend, commonBaseXAis, commonBaseYAxis } from "./common-echarts-data"

export interface lineChartData extends IBaseChartOption {
  series: any[]
  screenWidth: number
  unit?: string
  axisLabel?: any
  yAxisTwoUnit?: string
  showLegend?: boolean
}
export function TimeLineOption(params: lineChartData) {
  const {
    xAxis,
    series,
    screenWidth,
    unit,
    axisLabel,
    yAxisTwoUnit,
    showLegend = true,
  } = params || { showLegend: true, xAxis: [], series: [] }
  const actTooltip = {
    ...baseTooltip,
    formatter: function (params) {
      let res = `<div style="font-size: 12px;line-height: 1.2em">${params[0].name}</div>`
      for (let i = 0; i < params.length; i++) {
        res += `<div style="font-size: 12px;line-height: 1.2em">${params[i].marker} ${params[i].seriesName} : <span style="color: #00F7FA">${parseNum(params[i].value?.[1], 4)}</span> ${unit} </div>`
      }
      return res
    },
  }
  const option: EChartsOption = {
    grid: { left: "2%", right: "3%", top: "17%", bottom: "7%", containLabel: true },
    tooltip: actTooltip as EChartsOption["tooltip"],
    dataZoom: baseDataZoom,
    legend: commonBaseLegend(screenWidth, showLegend),
    // toolbox: getToolbox(downloadFileName ?? "发电量报表"),
    xAxis: {
      type: "time",
      ...commonBaseXAis({ screenWidth, axisLabel }),
    },
    yAxis: [
      {
        type: "value",
        name: unit || "万kW",
        show: true,
        position: "left",
        ...commonBaseYAxis(screenWidth),
      },
      {
        type: "value",
        name: yAxisTwoUnit,
        show: !!yAxisTwoUnit,
        position: "right",
        ...commonBaseYAxis(screenWidth),
      },
    ] as EChartsOption["YAXisOption"],
    series: series,
  }
  return option
}

function ToolTipBox({ params }) {
  return <div className="tool-box"></div>
}
