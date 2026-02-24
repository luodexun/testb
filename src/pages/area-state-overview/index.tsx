/*
 * @Author: chenmeifeng
 * @Date: 2024-01-11 14:59:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 10:50:40
 * @Description:
 */
import "./index.less"

import { useAtom, useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"

import DvsDetailContext, { IDvsDetailContext } from "@/contexts/dvs-detail-context"
import { AtomAllTypeRun4DvsData, AtomDvsStateCountMap } from "@/store/atom-run-device"
import { TMatrixDrawerMap } from "@/types/i-device"
import { getMngStaticInfo } from "@/utils/device-funs"

import DeviceDetailDrawer from "../area-matrix/components/device-detail-drawer"
import StateOverviwe from "./components/overview"
export default function AreaStateOvw(props) {
  const { showName = true, showTabs = true, currentDvsType } = props
  const [theDevice, setTheDevice] = useState<IDvsDetailContext["device"]>(null)
  const [drawerOpenMap, setDrawerOpenMap] = useState<TMatrixDrawerMap>({})
  const [deviceList, setDeviceList] = useState<IDvsDetailContext["deviceList"]>([])
  const [chooseColumnKey, setChooseColumnKey] = useState<IDvsDetailContext["chooseColumnKey"]>({})
  const [needShangdevice, setNeedShangdevice] = useState<IDvsDetailContext["needShangdevice"]>([])
  const [isUseNewDvsState] = useState<IDvsDetailContext["isUseNewDvsState"]>(false) // 旧状态
  // const [isUseNewDvsState] = useState<IDvsDetailContext["isUseNewDvsState"]>(true) // 新状态
  const [isTableMode, setIsTableMode] = useState(false)
  const [closeCtxMenu, setCloseCtxMenu] = useState(true) // 鼠标点击组件内任意一点关闭挂牌小框
  const [showSign, setShowSign] = useState(false)
  const setDvsStateCountMap = useSetAtom(AtomDvsStateCountMap)
  const containerRef = useRef<HTMLDivElement>(null)
  const [, setRun4Device] = useAtom(AtomAllTypeRun4DvsData)
  const initQuotaChecks = async () => {
    const res = await getMngStaticInfo()
    if (!res) return
    setChooseColumnKey(res.devcieChecks)
  }
  useEffect(() => {
    return () => setDvsStateCountMap()
  }, [setDvsStateCountMap])
  useEffect(() => {
    initQuotaChecks()
    return () => setRun4Device()
  }, [])
  return (
    <div className="l-full area-state" ref={containerRef}>
      <DvsDetailContext.Provider
        value={{
          device: theDevice,
          setDevice: setTheDevice,
          drawerOpenMap,
          setDrawerOpenMap,
          deviceList,
          setDeviceList,
          isTableMode,
          setIsTableMode,
          closeCtxMenu,
          setCloseCtxMenu,
          showSign,
          setShowSign,
          needShangdevice,
          setNeedShangdevice,
          isUseNewDvsState,
          chooseColumnKey,
        }}
      >
        <StateOverviwe showName={showName} showTabs={showTabs} currentDvsType={currentDvsType} />

        <DeviceDetailDrawer containerDom={containerRef.current} />
      </DvsDetailContext.Provider>
    </div>
  )
}
