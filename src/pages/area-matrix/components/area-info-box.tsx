/*
 * @Author: xiongman
 * @Date: 2023-09-21 12:47:42
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-21 12:47:42
 * @Description: 区域信息展示组件
 */

import { MONITOR_CENTER_INFO_LIST } from "@configs/dvs-state-info.ts"
import useMonitorCenterData from "@hooks/use-monitor-center-data.ts"
import { useContext } from "react"

import MetricTag from "@/components/metric-tag"
import ArrowButton from "@/components/radio-button/arrow-button.tsx"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"

export default function AreaInfoBox() {
  const { setDrawerOpenMap } = useContext(DvsDetailContext)

  const baseDataMQ = useMonitorCenterData()

  return (
    <div className="area-info-box">
      {MONITOR_CENTER_INFO_LIST.map(({ field, title, unit }) => {
        return (
          <MetricTag key={field} value={baseDataMQ[field] ?? "-"} title={title} unit={unit} className="site-info-tag" />
        )
      })}
      <ArrowButton title="全站运行状态" className="mr-1em" onClick={() => setDrawerOpenMap({ glbFilter: true })} />
    </div>
  )
}
