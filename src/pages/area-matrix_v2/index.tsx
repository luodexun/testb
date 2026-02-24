/*
 * @Author: chenmeifeng
 * @Date: 2024-12-09 11:34:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 10:40:44
 * @Description:
 */
import "./index.less"

import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"

import DvsDetailContext, { IDvsDetailContext } from "@/contexts/dvs-detail-context"
import useRun4deviceData from "@/hooks/use-run-4device-data"
import { AtomAllTypeRun4DvsData, AtomDvsStateCountMap } from "@/store/atom-run-device"
import { AtomStation } from "@/store/atom-station"
import { TDeviceType } from "@/types/i-config"
import { TMatrixDrawerMap } from "@/types/i-device"
import { getMngStaticInfo } from "@/utils/device-funs"

import DeviceDetailDrawer from "../area-matrix/components/device-detail-drawer"
import MatrixContent from "./components/content"
import MatrixTop from "./components/matrix-top"

export default function AreaMatrixV2() {
  const [theDevice, setTheDevice] = useState<IDvsDetailContext["device"]>(null)
  const [drawerOpenMap, setDrawerOpenMap] = useState<TMatrixDrawerMap>({})
  const [deviceList, setDeviceList] = useState<IDvsDetailContext["deviceList"]>([])
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const [currentLayout, setCurrentLayout] = useState<IDvsDetailContext["currentLayout"]>("site")
  const [currentChooseState, setCurrentChooseState] = useState<IDvsDetailContext["currentChooseState"]>([])
  const [chooseColumnKey, setChooseColumnKey] = useState<IDvsDetailContext["chooseColumnKey"]>({})
  const [isUseNewDvsState] = useState<IDvsDetailContext["isUseNewDvsState"]>(false) // 旧状态
  // const [isUseNewDvsState] = useState<IDvsDetailContext["isUseNewDvsState"]>(true) // 新状态
  const { stationList } = useAtomValue(AtomStation)
  // const setDvsStateCountMap = useSetAtom(AtomDvsStateCountMap)
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setRun4Device] = useAtom(AtomAllTypeRun4DvsData)
  // useEffect(() => {
  //   return () => setDvsStateCountMap()
  // }, [setDvsStateCountMap])
  const runParams = useMemo(() => {
    return { isStart: !!stationList?.length, deviceTypeList: [deviceType] }
  }, [deviceType, stationList])
  useRun4deviceData(runParams)
  const initQuotaChecks = async () => {
    const res = await getMngStaticInfo()
    if (!res) return
    setChooseColumnKey(res.devcieChecks)
  }
  useEffect(() => {
    initQuotaChecks()
    return () => setRun4Device()
  }, [])
  return (
    <div ref={containerRef} className="l-full area-matrix-wrap">
      <DvsDetailContext.Provider
        value={{
          device: theDevice,
          setDevice: setTheDevice,
          drawerOpenMap,
          setDrawerOpenMap,
          deviceList,
          setDeviceList,
          showMode: "block",
          currentChooseState,
          setCurrentChooseState,
          deviceType,
          setDeviceType,
          currentLayout,
          setCurrentLayout,
          chooseColumnKey,
          isUseNewDvsState,
        }}
      >
        <MatrixContent />
        <DeviceDetailDrawer containerDom={containerRef.current} />
      </DvsDetailContext.Provider>
    </div>
  )
}
