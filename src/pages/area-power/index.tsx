/*
 * @Author: xiongman
 * @Date: 2023-09-04 16:13:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-06 11:24:53
 * @Description: 区域中心-功率总览
 */

import "./index.less"

import { AREA_POWER_ELEMENT, TAreaPowerElement } from "@configs/option-const.tsx"
import { calcChartSize, getAllStationLineData, getStationLineDataMap } from "@pages/area-power/methods.ts"
import { AtomStation } from "@store/atom-station.ts"
import { CheckboxGroupProps } from "antd/lib/checkbox"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"

import InfoCard from "@/components/info-card"

import AreaPowerChart from "./components/area-power-chart.tsx"
import ChartElementChackbox from "./components/chart-element-chackbox.tsx"
import { DEFAULT_VALUE } from "./configs.ts"
import { IAreaPowerList } from "./types.ts"
import { getScreenUrl } from "@/utils/screen-funs.ts"
import { useRefresh } from "@/hooks/use-refresh.ts"
export default function AreaPower() {
  //勾选的数据
  const [element, setElement] = useState<TAreaPowerElement[]>(DEFAULT_VALUE)
  const isInitialMount = useRef(true)
  const { stationList } = useAtomValue(AtomStation)
  // const timer = useRef(null)
  const [reload, setReload] = useRefresh(5 * 60000)
  const [screenUrl, setScreenUrl] = useState("")
  const cartBoxRef = useRef<HTMLDivElement>()
  const onEleChgRef = useRef<CheckboxGroupProps["onChange"]>((checkedValue) => {
    // console.log(checkedValue, "checkedValue")

    setElement(checkedValue as TAreaPowerElement[])
  })
  //全部功率的数据
  const [allStationLineData, setAllStationLineData] = useState<IAreaPowerList>()

  const getData = async () => {
    const chartData = await getAllStationLineData(screenUrl)
    setReload(false)
    setAllStationLineData(chartData)
  }
  // 实际展示功率数据，只展示勾选的
  const actShowLineData = useMemo(() => {
    const result = getStationLineDataMap(allStationLineData, element)
    return result
  }, [allStationLineData, element])
  useEffect(() => {
    const theCalcFun = calcChartSize.bind(null, cartBoxRef.current)
    theCalcFun()
    window.addEventListener("resize", theCalcFun)
    return () => {
      window?.removeEventListener("resize", theCalcFun)
    }
  }, [])
  const getScnUrl = async () => {
    const res = await getScreenUrl()
    setScreenUrl(res)
  }
  useEffect(() => {
    getScnUrl()
  }, [])
  useEffect(() => {
    if (reload && screenUrl) {
      getData()
    }
  }, [stationList, reload, screenUrl])
  return (
    <div className="l-full area-power">
      <ChartElementChackbox options={AREA_POWER_ELEMENT} value={element} onChange={onEleChgRef.current} />
      <div ref={cartBoxRef} className="l-full area-power-chart-box">
        {stationList?.map((station) => (
          <InfoCard
            key={station.stationCode}
            title={station.shortName}
            children={
              <AreaPowerChart
                element={element}
                data={actShowLineData?.[station.stationCode] || { data: null, xAxis: [] }}
              />
            }
          />
        ))}
      </div>
    </div>
  )
}
