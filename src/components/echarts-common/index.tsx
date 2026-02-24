/*
 * @Author: chenmeifeng
 * @Date: 2023-11-21 10:55:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-22 14:35:43
 * @Description:
 */
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"

import { CHARTS_TYPE_OPTIONS } from "./configs"
import { TChatDataOption } from "./types"
interface EchartProps {
  type: string
  chartData: TChatDataOption
}
export default function EchartCom(props: EchartProps) {
  const { type, chartData } = props
  const currentChartOptions = CHARTS_TYPE_OPTIONS[type].options

  const { chartRef, chartOptions } = useChartRender(chartData, currentChartOptions)
  return <ChartRender ref={chartRef} empty option={chartOptions} />
}
