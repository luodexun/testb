/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:28:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-17 11:24:37
 * @Description: 区域中心-指标总览-运行趋势图表配置数据
 */

import { baseDataZoom, baseLegend, baseTooltip } from "@configs/chart-fragments.ts"

import { IFormInst } from "@/components/custom-form/types.ts"

import { getStandAloneChartData } from "../methods"
import { IRpPowerData } from "../types"

function getChartParams(data: IRpPowerData[], treeFromRef: IFormInst | null) {
  const { timeType } = treeFromRef?.getFormValues() || {}
  let xAxis = []
  const series = []
  const legend = []
  if (data?.length) {
    const chartData = getStandAloneChartData(data, timeType)
    xAxis = chartData.xAxis
    for (const key in chartData) {
      if (Object.prototype.hasOwnProperty.call(chartData, key)) {
        const element = chartData[key]
        if (key === "xAxis") continue
        legend.push(key)
        const seriesItem = {
          name: key,
          data: element,
          type: "line",
          smooth: true,
        }
        series.push(seriesItem)
      }
    }
  }

  return {
    xAxis,
    legend,
    series,
  }
}

export default function runTrendOption(chartData: IRpPowerData[], treeFromRef: IFormInst | null) {
  const { xAxis, legend, series } = getChartParams(chartData, treeFromRef)

  return {
    grid: {
      top: "10%", // 等价于 y: '16%'
      left: "5%",
      right: "8%",
      bottom: "5%",
      containLabel: true,
    },
    legend: { data: legend, ...baseLegend },
    toolbox: {
      feature: {
        saveAsImage: {
          name: "功率曲线分析曲线",
          backgroundColor: "#010219",
          iconStyle: {
            color: "#1477F2",
          },
        },
      },
    },
    tooltip: baseTooltip,
    dataZoom: baseDataZoom,
    xAxis: [
      {
        name: "风速（m/s）",
        splitLine: {
          show: false,
          lineStyle: {
            color: "rgba(0,160,233,0.25)",
          },
        },
        axisLabel: { color: "#fff" },
        data: xAxis,
      },
    ],
    yAxis: {
      name: "功率（kW）",
      type: "value",
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(0,160,233,0.25)", //X轴文字颜色
        },
      },
      axisLabel: { color: "#fff" },
    },
    series,
  }
}
