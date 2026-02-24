/*
 * @Author: chenmeifeng
 * @Date: 2023-11-10 17:10:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-13 11:16:00
 * @Description:
 */
import ChartRender from "@/components/chart-render"

import { IAnlsRunTrendChartData } from "../types"
import runQuaOption from "./anls-charts-option"
export default function AnlsCharts(props: IAnlsRunTrendChartData) {
  const { chartData, loading } = props
  const chartOptions = runQuaOption(chartData)
  // console.log(chartData, "chartData")

  return (
    <div className="curve-warp ">
      <ChartRender loading={loading} option={chartOptions} />
    </div>
  )
}
