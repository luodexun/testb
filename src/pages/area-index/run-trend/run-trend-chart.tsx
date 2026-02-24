/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:27:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-31 14:03:32
 * @Description: 区域中心-指标总览-运行趋势图表
 */

import useChartRender from "@hooks/use-chart-render.ts"

import ChartRender from "@/components/chart-render"
import { IBaseChartProps } from "@/types/i-page.ts"

import runTrendOption, { IRunTrendChartData } from "./run-trend-option.ts"
import { useEffect } from "react"
// const data = {
//   data: [
//     {
//       title: "风速",
//       unit: "m/s",
//       data: [34, 34],
//     },
//     {
//       title: "有功功率",
//       unit: "kW",
//       data: [678, 0],
//     },
//     {
//       title: "可用功率",
//       unit: "kW",
//       data: [0, 0],
//     },
//     {
//       title: "线路总功率",
//       unit: "kW",
//       data: [1000, -20],
//     },
//     {
//       title: "出线总功率",
//       unit: "kW",
//       data: [1000, -2300],
//     },
//     {
//       title: "理论功率",
//       unit: "kW",
//       data: [0, 345],
//     },
//     {
//       title: "无功功率",
//       unit: "kVar",
//       data: [0, 0],
//     },
//   ],
//   xAxis: ["17:49", "17:50"],
//   deviceType: "WT",
// }
export default function RunTrendChart(props: IBaseChartProps<IRunTrendChartData>) {
  const { loading, data } = props
  const { chartRef, chartOptions } = useChartRender<IRunTrendChartData>(data, runTrendOption)
  // useEffect(() => {
  //   setTimeout(() => {
  //     chartRef.current?.getEchartsInstance().dispatchAction({
  //       type: "showTip",
  //       seriesIndex: 1,
  //       dataIndex: 1,
  //     })
  //   }, 1000)
  //   // console.log(, "尽量靠近士大夫艰苦")
  // }, [])
  return <ChartRender ref={chartRef} loading={loading} option={chartOptions} />
}
