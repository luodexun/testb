/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:11:38
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 09:55:13
 * @Description: 区域中心-指标总览-等效利用小时数
 */

import { InputNumber } from "antd"
import { useEffect, useMemo, useState } from "react"

import InfoCard from "@/components/info-card"
import StationTreeSelect from "@/components/station-tree-select/index.tsx"
import { IBaseProps } from "@/types/i-page.ts"

import { getStnUtilizationHourTrend, stnUlzHourMap2ChartData } from "./methods.ts"
import { IDealStnUlzHourMap } from "./types.ts"
import UtilizationHoursChart from "./utilization-hours-chart.tsx"

interface IProps extends IBaseProps {}
export default function UtilizationHours(props: IProps) {
  const { title, className } = props
  const [site, setSite] = useState<string>()
  const [offsetMonth, setOffsetMonth] = useState<number>(6)
  const [ulzHourData, setUlzHourData] = useState<IDealStnUlzHourMap>()

  useEffect(() => {
    getStnUtilizationHourTrend(offsetMonth).then(setUlzHourData)
  }, [offsetMonth])

  const chartData = useMemo(() => stnUlzHourMap2ChartData(ulzHourData, site), [site, ulzHourData])

  return (
    <InfoCard
      title={title}
      className={`utilization-hours ${className ?? ""}`}
      extra={
        <>
          <InputNumber
            size="small"
            min={1}
            step={1}
            placeholder="查询最近n个月"
            title={`查询最近${offsetMonth}个月`}
            value={offsetMonth}
            onChange={setOffsetMonth}
          />
          <StationTreeSelect size="small" onChange={setSite} allowClear={false} needFirst />
        </>
      }
      children={<UtilizationHoursChart loading={false} data={chartData} />}
    />
  )
}
