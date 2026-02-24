/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:28:28
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-17 11:32:46
 * @Description: 区域中心-数据质量分析-指标图表配置数据
 */

import { baseAxisLabel, baseDataZoom, baseTooltip, baseYAxis } from "@configs/chart-fragments.ts"

import { day4Y2S } from "@/configs/time-constant"
import { parseNum, uDate } from "@/utils/util-funs"

import { IAnlsQueData } from "../types"

export default function runQuaOption(chartData: IAnlsQueData[]) {
  // const { xAxis, series } = getChartParams(chartData)
  const series = chartData?.map((i) => parseNum(i.receivedDataCount * 100 / i.expectedDataCount))
  // console.log(series, "series")

  const xAxis = chartData?.map((i) => uDate(i.Time, day4Y2S))
  return {
    grid: {
      top: "16%", // 等价于 y: '16%'
      left: "3%",
      right: "8%",
      bottom: "5%",
      containLabel: true,
    },
    legend: {
      itemGap: 100,
      // data: ["数据完整度%"],
      textStyle: {
        //图例文字的样式
        color: "#fff",
      },
      left: "center",
      top: 10,
    },
    toolbox: {
      feature: {
        saveAsImage: {
          name: "数据质量分析曲线",
          backgroundColor: "#010219",
          iconStyle: {
            color: "#1477F2",
          },
        },
      },
    },
    tooltip: baseTooltip,
    dataZoom: baseDataZoom,
    xAxis: { type: "category", data: xAxis, boundaryGap: true, axisLabel: baseAxisLabel },
    yAxis: baseYAxis,
    series: [
      {
        data: series,
        name: "数据完整度%",
        type: "line",
      },
    ],
  }
}
