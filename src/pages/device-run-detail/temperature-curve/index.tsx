/*
 * @Author: xiongman
 * @Date: 2023-09-27 17:54:34
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-27 17:54:34
 * @Description: 风机运行详情-温度曲线
 */

import useChartRender from "@hooks/use-chart-render.ts"
import { getDvsSubsystemPartMap } from "@utils/device-funs.ts"
import { useContext, useEffect, useState } from "react"

import ChartRender from "@/components/chart-render"
import InfoCard from "@/components/info-card"
import SelectWithAll from "@/components/select-with-all"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { ISubSystemType } from "@/types/i-config.ts"
import { IBaseProps } from "@/types/i-page.ts"

import { IDvsTempCurveChart, temperatureCurveOption } from "./curve-options.ts"
import { getDvsSystemTempTrendData } from "./methods.ts"

interface IProps extends IBaseProps {}
export default function TemperatureCurve(props: IProps) {
  const { className } = props
  const [tempOptions, setTempOptions] = useState<ISubSystemType[]>([])
  const [checkedPoint, setCheckedPoint] = useState<ISubSystemType["value"]>()
  const [chartData, setChartData] = useState<IDvsTempCurveChart>()
  const [loading, setLoading] = useState(false)
  const { device } = useContext(DvsDetailContext)

  useEffect(() => {
    if (!device?.deviceType) return
    ;(async function () {
      const subSysIdMap = await getDvsSubsystemPartMap(device.deviceType)
      const theTempOptions = Object.values(subSysIdMap || {})
      if (!Array.isArray(theTempOptions) || !theTempOptions?.length) return
      setTempOptions(theTempOptions)
      setCheckedPoint(theTempOptions[0].value)
    })()
  }, [device])

  useEffect(() => {
    if (!checkedPoint || !device?.deviceCode) return
    setLoading(true)
    getDvsSystemTempTrendData({ deviceCode: device.deviceCode, systemId: checkedPoint })
      .then(setChartData)
      .then(() => setLoading(false))
  }, [checkedPoint, device])

  const { chartRef, chartOptions } = useChartRender<IDvsTempCurveChart>(chartData, temperatureCurveOption)

  return (
    <InfoCard
      title="温度曲线"
      className={`dvs-run-trend-wrap ${className}`}
      extra={
        <SelectWithAll
          size="small"
          placeholder="选择部件"
          options={tempOptions}
          value={checkedPoint}
          onChange={setCheckedPoint}
        />
      }
    >
      <ChartRender ref={chartRef} loading={loading} option={chartOptions} />
    </InfoCard>
  )
}
