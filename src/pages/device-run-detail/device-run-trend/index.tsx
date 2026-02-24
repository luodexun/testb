/*
 * @Author: xiongman
 * @Date: 2023-09-27 17:40:25
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-26 16:00:03
 * @Description: 实时运行趋势
 */

import { MS_HOUR } from "@configs/time-constant.ts"
import useChartRender from "@hooks/use-chart-render.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { getDvsPointTrendData } from "@pages/device-run-detail/device-run-trend/methods.ts"
import { IDvsPointTrendParams } from "@pages/device-run-detail/device-run-trend/types.ts"
import { useContext, useEffect, useState } from "react"

import ChartRender from "@/components/chart-render"
import InfoCard from "@/components/info-card"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IBaseProps } from "@/types/i-page.ts"

import { dvsRunTrendOption, IDvsRunTrendChart } from "./dvs-run-trend-options.ts"

interface IProps extends IBaseProps {}
export default function DeviceRunTrend(props: IProps) {
  const { className } = props
  const [chartData, setChartData] = useState<IDvsRunTrendChart>()
  const [loading, setLoading] = useState(false)
  const { device } = useContext(DvsDetailContext)
  const [reload, setReload] = useRefresh(MS_HOUR) // 4 秒

  useEffect(() => {
    if (!reload || !device?.deviceType) return
    const params: IDvsPointTrendParams = { deviceType: device.deviceType, deviceCode: device.deviceCode }
    setLoading(true)
    getDvsPointTrendData(params)
      .then(setChartData)
      .then(() => setReload(false))
      .then(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, reload])
  useEffect(() => {
    setReload(true)
  }, [device])
  const { chartRef, chartOptions } = useChartRender<IDvsRunTrendChart>(chartData, dvsRunTrendOption)

  return (
    <InfoCard title="实时运行趋势" className={`dvs-run-trend-wrap ${className}`}>
      <ChartRender ref={chartRef} loading={loading} option={chartOptions} />
    </InfoCard>
  )
}
