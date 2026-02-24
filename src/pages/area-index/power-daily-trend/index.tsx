/*
 * @Author: xiongman
 * @Date: 2023-08-28 17:34:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-22 16:50:13
 * @Description: 区域中心-指标总览-日电量趋势
 */

import { MS_HOUR } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { useEffect, useMemo, useState } from "react"

import InfoCard from "@/components/info-card"
import StationTreeSelect from "@/components/station-tree-select/index.tsx"
import { IBaseProps } from "@/types/i-page.ts"

import DailyTrendChart from "./daily-trend-chart.tsx"
import { getStnPduTrendData, stnPduTrendData2ChartData } from "./methods.ts"
import { IStnPduTrendDataAfterDeal } from "./types.ts"

interface IProps extends IBaseProps {}
export default function PowerDailyTrend(props: IProps) {
  const { title, className } = props
  const [site, setSite] = useState<string | null>(null)
  const [trendData, setTrendData] = useState<IStnPduTrendDataAfterDeal>()
  const [reload, setReload] = useRefresh(MS_HOUR) // 一小时

  useEffect(() => {
    if (!reload) return
    getStnPduTrendData()
      .then(setTrendData)
      .then(() => setReload(false))
  }, [reload, setReload])

  const chartData = useMemo(() => {
    return stnPduTrendData2ChartData(trendData, site)
  }, [trendData, site])

  return (
    <InfoCard
      title={title}
      className={`power-daily-trend ${className ?? ""}`}
      extra={<StationTreeSelect size="small" onChange={setSite} />}
      children={<DailyTrendChart loading={false} data={chartData} />}
    />
  )
}
