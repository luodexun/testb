/*
 * @Author: xiongman
 * @Date: 2023-08-28 18:26:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-22 16:42:57
 * @Description: 区域中心-指标总览-运行趋势
 */

import { MAIN_DVS_TYPE } from "@configs/option-const.tsx"
import { MS_HOUR } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import { AtomStation } from "@store/atom-station.ts"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"

import InfoCard from "@/components/info-card"
import RadioButton from "@/components/radio-button"
import StationTreeSelect from "@/components/station-tree-select/index.tsx"
import { IDeviceTypeOfStation, TDeviceType } from "@/types/i-config.ts"
import { IBaseProps } from "@/types/i-page.ts"

import { getStnPointTrendData } from "./methods.ts"
import RunTrendChart from "./run-trend-chart.tsx"
import { IRunTrendChartData } from "./run-trend-option.ts"
import { IStnPointTrendParams } from "./types.ts"

interface IProps extends IBaseProps {}
export default function RunTrend(props: IProps) {
  const { title, className } = props
  const [siteCode, setSiteCode] = useState<string>()
  const [dvsType, setDvsType] = useState<TDeviceType>("WT")
  const [chartData, setChartData] = useState<IRunTrendChartData>()
  const [reload, setReload] = useRefresh(MS_HOUR) // 一小时
  const { deviceTypeOfStationMap } = useAtomValue(AtomConfigMap).map
  const { stationMap } = useAtomValue(AtomStation)

  useEffect(() => {
    if (!dvsType || !siteCode) return
    setReload(true)
  }, [dvsType, setReload, siteCode])

  const dvsTypeOptions = useMemo(() => {
    if (!deviceTypeOfStationMap || !stationMap || !siteCode) return []
    const { id } = stationMap[siteCode] || {}
    if (!id) return []
    const { deviceTypes } = (deviceTypeOfStationMap[id] || {}) as IDeviceTypeOfStation
    if (!deviceTypes?.length) return []
    const dvsTypeStr = `;${deviceTypes.join(";")};`
    const options = MAIN_DVS_TYPE.filter(({ value }) => dvsTypeStr.includes(`;${value};`))
    setDvsType(options[0]?.value)
    return options
  }, [deviceTypeOfStationMap, siteCode, stationMap])

  useEffect(() => {
    if (!dvsType || !siteCode || !reload) return
    const params: IStnPointTrendParams = { stationCode: siteCode, deviceType: dvsType }
    getStnPointTrendData(params)
      .then(setChartData)
      .then(() => setReload(false))
  }, [dvsType, reload, setReload, siteCode])

  return (
    <InfoCard
      title={title}
      className={`run-trend ${className ?? ""}`}
      extra={
        <>
          <StationTreeSelect size="small" value={siteCode} needFirst onChange={setSiteCode} />
          <RadioButton size="small" options={dvsTypeOptions} onChange={setDvsType} />
        </>
      }
      children={<RunTrendChart loading={false} data={chartData} />}
    />
  )
}
