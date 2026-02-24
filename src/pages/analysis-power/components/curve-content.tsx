/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 16:58:44
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-10-16 16:58:44
 *@Description: 报表管理-功率预测报表-曲线
 */
import ChartRender from "@/components/chart-render"

import { IRunTrendChartData } from "../types"
import runTrendOption from "./trend-option"
export default function CurveContent(props: IRunTrendChartData) {
  const { treeFromRef, chartData, loading } = props

  const chartOptions = runTrendOption(chartData, treeFromRef)

  return (
    <div className="curve-warp ">
      <ChartRender loading={loading} option={chartOptions} />
    </div>
  )
}
