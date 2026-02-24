/*
 * @Author: chenmeifeng
 * @Date: 2025-03-24 11:08:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-28 11:37:42
 * @Description:
 */
/*
 * @Author: chenmeifeng
 * @Date: 2024-09-05 14:19:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-27 11:20:40
 * @Description:
 */
import "./energy-trend-chart.less"

import useChartRender from "@hooks/use-chart-render.ts"
import { DatePicker, Select } from "antd"
import { useEffect, useMemo, useRef, useState } from "react"

import ChartRender from "@/components/chart-render"
import { TDate } from "@/types/i-antd.ts"
import { vDate } from "@/utils/util-funs"

import useInterval from "@/hooks/useInterval"
import { TTrendOption } from "../types"
import { SiteFrequencySch } from "../methods/trend-chart"
import EchartCom from "@/components/echarts-common"

interface IProps {
  dataSource: any[]
}

export default function PointTrendChart(props: IProps) {
  const { dataSource } = props
  const [chartData, setChartData] = useState({ yAxisProps: [], series: [] })
  const [schDate, setSchDate] = useState<TDate>(vDate())
  const [reload, setReload] = useInterval(4000)
  const [deviceCode, setDeviceCode] = useState("")
  const options = useMemo(() => {
    return (
      dataSource?.map((i) => {
        return {
          value: i.deviceCode,
          label: i.deviceName,
        }
      }) || []
    )
  }, [dataSource])
  const init = () => {
    if (!deviceCode) {
      setReload(true)
      setChartData({ yAxisProps: [], series: [] })
      return
    }

    SiteFrequencySch({ deviceCode, date: schDate }).then((data) => {
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
    setDeviceCode(options?.[0]?.value || "")
  }, [options])
  useEffect(() => {
    init()
  }, [deviceCode, schDate])
  return (
    <div className="site-frequency-chart">
      <div className="agvc-data-select">
        <Select
          size="small"
          style={{ width: "10em" }}
          options={options}
          value={deviceCode}
          onChange={setDeviceCode}
        ></Select>
        <DatePicker size="small" value={schDate} onChange={setSchDate} format={"YYYY-MM-DD"} />
      </div>
      {chartData?.yAxisProps?.length ? <EchartCom type="dynamicsTimeLine" chartData={chartData} /> : ""}
    </div>
  )
}
