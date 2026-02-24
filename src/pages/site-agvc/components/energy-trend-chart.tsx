/*
 * @Author: chenmeifeng
 * @Date: 2024-09-05 14:19:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-21 10:40:36
 * @Description:
 */
import "./energy-trend-chart.less"

import useChartRender from "@hooks/use-chart-render.ts"
import { SiteAgvcSch } from "@pages/site-agvc/methods"
import { DatePicker } from "antd"
import { useEffect, useState } from "react"

import ChartRender from "@/components/chart-render"
import { TDate } from "@/types/i-antd.ts"
import { vDate } from "@/utils/util-funs"

import { TEnergyType, TTrendOption } from "../types"
import { areaPowerOption } from "./energy-trend-chart-option"
import { useRefresh } from "@/hooks/use-refresh"
import useInterval from "@/hooks/useInterval"

interface IProps {
  type: TEnergyType
  deviceCode: string
}

export default function EnergyTrendChart(props: IProps) {
  const { type, deviceCode } = props
  const [chartData, setChartData] = useState<TTrendOption>()
  const [schDate, setSchDate] = useState<TDate>(vDate())
  const [reload, setReload] = useInterval(4000)
  const init = () => {
    if (!deviceCode) {
      setReload(true)
      setChartData({ xAxis: [], data: [], type })
      return
    }
    SiteAgvcSch({ deviceCode, date: schDate, type }).then((data) => {
      setReload(false)
      if (!data) return
      setChartData(data)
    })
  }
  useEffect(() => {
    if (!reload) return
    init()
  }, [reload])
  useEffect(() => {
    init()
  }, [deviceCode, schDate, type])

  const { chartRef, chartOptions } = useChartRender<TTrendOption>(chartData, areaPowerOption)

  return (
    <div className="site-agvc">
      <div className="agvc-data-select">
        <DatePicker size="small" value={schDate} onChange={setSchDate} format={"YYYY-MM-DD"} />
      </div>
      <ChartRender ref={chartRef} empty option={chartOptions} notMerge={false} />
    </div>
  )
}
