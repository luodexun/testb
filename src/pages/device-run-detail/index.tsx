/*
 * @Author: xiongman
 * @Date: 2023-09-26 10:25:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-19 17:46:58
 * @Description:
 */

import "./index.less"

import { useAtomValue, useSetAtom } from "jotai"
import { useContext, useEffect, useState } from "react"

import InfoCard from "@/components/info-card"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { pointInfoAtom, pointInfoSetAtom } from "@/store/atom-point-modal.ts"

import AttrTrendModal from "./components/attr-trend-modal.tsx"
import DetailTitle from "./components/detail-title.tsx"
import DeviceControl from "./device-control"
import DeviceRunTrend from "./device-run-trend"
import FaultAlarm from "./fault-alarm"
import MainParameters from "./main-parameters"
import PowerGrid from "./power-grid"
import StateSwitch from "./state-switch"
import TemperatureCurve from "./temperature-curve"

export default function DeviceRunDetail() {
  const [canOpen, setCanOpen] = useState(false)
  const { device } = useContext(DvsDetailContext)
  const piontLs = useAtomValue(pointInfoSetAtom)
  const setPiontList = useSetAtom(pointInfoSetAtom)
  useEffect(() => {
    if (piontLs?.open) {
      setCanOpen(true)
    } else {
      setCanOpen(false)
    }
  }, [piontLs])
  useEffect(() => {
    return () => {
      setCanOpen(false)
      setPiontList({
        open: false,
        pointInfo: null,
      })
    }
  }, [])
  return (
    <InfoCard extra={<DetailTitle showPart />} className="l-full device-run-detail">
      <PowerGrid className="index-0" />
      <StateSwitch className="index-1" />
      <DeviceControl className="index-2" />
      <MainParameters className="index-3" />
      <DeviceRunTrend className="index-4" />
      <FaultAlarm className="index-5" />
      <TemperatureCurve className="index-6" />
      <AttrTrendModal open={canOpen} device={device} />
    </InfoCard>
  )
}
