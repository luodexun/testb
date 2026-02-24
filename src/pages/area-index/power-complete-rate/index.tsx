/*
 * @Author: xiongman
 * @Date: 2023-08-28 13:40:38
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-29 10:48:00
 * @Description: 区域中心-指标总览-发电量完成率
 */

import "./index.less"

import { YEAR_MONTH } from "@configs/option-const.tsx"
import { MS_HOUR } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { useEffect, useMemo, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal/index.tsx"
import InfoCard from "@/components/info-card"
import RadioButton from "@/components/radio-button"
import { TYear0Month } from "@/types/i-config.ts"
import { IBaseProps } from "@/types/i-page.ts"

import CompleteRateChart from "./complete-rate-chart.tsx"
import PowerRateModal, { IOperateProps, IPerateRef } from "./components/power-rate-modal.tsx"
import { getStationProductionData, stnPduData2ChartData } from "./methods.ts"
import { IStnProductionData } from "./types.ts"

interface IProps extends IBaseProps {}
export default function PowerCompleteRate(props: IProps) {
  const { title, className } = props
  const modeRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stnPduData, setStnPduData] = useState<IStnProductionData[]>([])
  const [chartType, setChartType] = useState<TYear0Month>("month")
  const [reload, setReload] = useRefresh(MS_HOUR) // 一小时

  useEffect(() => {
    if (!reload) return
    getStationProductionData()
      .then(setStnPduData)
      .then(() => setReload(false))
  }, [reload, setReload])

  const chartData = useMemo(() => {
    return stnPduData2ChartData(stnPduData, chartType)
  }, [chartType, stnPduData])

  return (
    <div className="complete-rate">
      <InfoCard
        title={title}
        extra={<RadioButton size="small" options={YEAR_MONTH} onChange={setChartType} />}
        className={`complete-rate ${className ?? ""}`}
        titleClick={() => setIsModalOpen(true)}
        children={<CompleteRateChart loading={false} data={chartData} />}
      />
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="90%"
        title="发电量完成率"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={PowerRateModal}
        componentProps={{ stnPduData: stnPduData }}
      />
    </div>
  )
}
