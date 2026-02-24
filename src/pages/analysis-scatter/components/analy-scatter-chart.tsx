/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 16:58:44
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-10-16 16:58:44
 *@Description: 报表管理-功率预测报表-曲线
 */

import { useMemo, useRef } from "react"

import ChartRender from "@/components/chart-render"
import { IBaseChartProps } from "@/types/i-page.ts"

interface IProps<TD> extends IBaseChartProps<TD> {
  options: (chartData: TD) => any
}
export default function AnalyScatterChart<TD>(props: IProps<TD>) {
  const { data, loading, options } = props
  const optionRef = useRef(options)
  optionRef.current = options
  const chartOptions = useMemo(() => optionRef.current(data), [data])

  return <ChartRender loading={loading} option={chartOptions} />
}
