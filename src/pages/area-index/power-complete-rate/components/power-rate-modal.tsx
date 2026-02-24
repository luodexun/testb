import "./power-rate-modal.less"

import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"

import RadioButton from "@/components/radio-button"
import { YEAR_MONTH } from "@/configs/option-const"
import { TYear0Month } from "@/types/i-config"

import CompleteRateChart from "../complete-rate-chart"
import { stnPduData2ChartData } from "../methods"
export interface IPerateRef {}
export interface IOperateProps {
  stnPduData?: any
}
// export default function PowerRateModal(props) {
const PowerRateModal = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { stnPduData } = props
  const [chartType, setChartType] = useState<TYear0Month>("month")
  const [show, setShow] = useState(false)
  const chartData = useMemo(() => {
    const data = stnPduData2ChartData(stnPduData, chartType)
    return data
  }, [chartType, stnPduData])
  useEffect(() => {
    setTimeout(() => {
      // 解决echarts初次渲染宽高问题
      setShow(true)
    }, 500)
  }, [])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="power-rate-modal">
      <RadioButton size="small" options={YEAR_MONTH} onChange={setChartType} />
      {show ? <CompleteRateChart loading={false} data={chartData} step={50} /> : ""}
    </div>
  )
})

export default PowerRateModal
