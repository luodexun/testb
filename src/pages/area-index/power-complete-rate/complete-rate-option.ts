/*
 * @Author: xiongman
 * @Date: 2023-08-28 13:45:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-15 17:18:45
 * @Description: 区域中心-指标总览-发电量完成率-图表配置方法
 */

import {
  baseAxisLabel,
  baseGrid,
  baseTooltip,
  baseYAxis,
  chartLinearColor,
  legendText,
  scrollDataZoom,
} from "@configs/chart-fragments.ts"
import { UNIT } from "@configs/text-constant.ts"
import { compareEvo, evoluateNum } from "@utils/util-funs.tsx"

export interface ICompleteRateChartData {
  stations: string[]
  actual: number[]
  planned: number[]
  rate: number[]
}

function siteXAxisFormate(label: string) {
  if (!label) return label
  const charts = label.split("")
  charts.splice(Math.round(label.length / 2), 0, "\n")
  return charts.join("")
}

export function completeRateOption(chartData?: ICompleteRateChartData) {
  const { stations, actual, planned, rate } = chartData || { stations: [], actual: [], planned: [], rate: [] }
  let evoInfo: ReturnType<typeof compareEvo>
  ;[actual, planned].flat().find((p) => (evoInfo = compareEvo(p)).largeUnit)
  const { largeUnit, largeEvo } = evoInfo || { largeUnit: "", largeEvo: 1 }

  // const pUnit = `${UNIT[largeUnit] || ""}${UNIT.ELEC}`

  // const actualData = actual.map((p) => evoluateNum(p, largeEvo))
  // const planData = planned.map((p) => evoluateNum(p, largeEvo))
  const pUnit = `${UNIT.ELEC_W}`
  const actualData = actual.map((p) => evoluateNum(p, 10000))
  const planData = planned.map((p) => evoluateNum(p, 10000))

  return {
    tooltip: baseTooltip,
    grid: baseGrid,
    legend: {
      itemWidth: 14,
      itemHeight: 10,
      data: ["实际", "计划", "完成率"],
      textStyle: legendText,
    },
    dataZoom: scrollDataZoom(),
    xAxis: [
      {
        type: "category",
        data: stations,
        axisPointer: { type: "shadow" },
        splitLine: { show: false },
        axisLabel: {
          ...baseAxisLabel,
          interval: 0,
          formatter: siteXAxisFormate,
        },
      },
    ],
    yAxis: [
      { name: `电量(${pUnit})`, min: 0, ...baseYAxis },
      { name: "完成率(%)", min: 0, ...baseYAxis },
    ],
    series: [
      {
        name: "实际",
        type: "bar",
        yAxisIndex: 0,
        barWidth: 12,
        data: actualData,
        itemStyle: { color: chartLinearColor(["#9A4DFF", "#23A0FF"]) },
        tooltip: {
          valueFormatter: function (value: number) {
            return `${value ?? "-"} ${pUnit}`
          },
        },
      },
      {
        name: "计划",
        type: "bar",
        yAxisIndex: 0,
        barWidth: 12,
        data: planData,
        itemStyle: { color: chartLinearColor(["#FF9B44", "#B4E217"]) },
        tooltip: {
          valueFormatter: function (value: number) {
            return `${value ?? "-"} ${pUnit}`
          },
        },
      },
      {
        name: "完成率",
        type: "line",
        color: "#F7E74C",
        yAxisIndex: 1,
        data: rate,
        smooth: true,
        symbol: "circle",
        areaStyle: {
          opacity: 0.3,
          color: chartLinearColor(["#00FFD4", "rgba(17,36,72,0)"]),
        },
        itemStyle: { color: "#01F1CB" },
        lineStyle: {
          shadowColor: "#00FFD4",
          shadowBlur: 4,
          shadowOffsetY: 2,
        },
        tooltip: {
          valueFormatter: function (value: number) {
            return `${value ?? "-"} ${UNIT.PERCENT}`
          },
        },
      },
    ],
  }
}
