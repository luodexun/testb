/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 17:14:09
 * @Description: 场站-场站设备矩阵
 */

import "./index.less"

import useRun4deviceData from "@hooks/use-run-4device-data.ts"
import DeviceDetailDrawer from "@pages/area-matrix/components/device-detail-drawer.tsx"
import DeviceMatrix4site from "@pages/site-matrix/components/device-matrix-4site.tsx"
import DeviceSignalModal from "@pages/site-matrix/components/device-signal-modal.tsx"
import { AtomAllTypeRun4DvsData, AtomDvsStateCountMap } from "@store/atom-run-device.ts"
import { AtomStnSignRdMap } from "@store/atom-signal-record.ts"
import { AtomStation } from "@store/atom-station.ts"
import { getParamDataFromUrl } from "@utils/menu-funs.tsx"
import { parseNum } from "@utils/util-funs.tsx"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import { getMngStaticInfo } from "@/components/common-target-box/methods"
import { DEVICE_RUN_CARD_FIELD_4TYPE } from "@/configs/dvs-state-info"
import DvsDetailContext, { IDvsDetailContext } from "@/contexts/dvs-detail-context.ts"
import { TMatrixDrawerMap, TModeShow } from "@/types/i-device.ts"

export default function SiteMatrix() {
  const [theDevice, setTheDevice] = useState<IDvsDetailContext["device"]>(null)
  const [drawerOpenMap, setDrawerOpenMap] = useState<TMatrixDrawerMap>({})
  const [deviceList, setDeviceList] = useState<IDvsDetailContext["deviceList"]>([])
  const [chooseColumnKey, setChooseColumnKey] = useState<IDvsDetailContext["chooseColumnKey"]>({})
  const [siteChooseColumnKey, setSiteChooseColumnKey] = useState<IDvsDetailContext["siteChooseColumnKey"]>({})
  const [needShangdevice, setNeedShangdevice] = useState<IDvsDetailContext["needShangdevice"]>([])
  const [isUseNewDvsState] = useState<IDvsDetailContext["isUseNewDvsState"]>(false) // 旧状态
  // const [isUseNewDvsState] = useState<IDvsDetailContext["isUseNewDvsState"]>(true) // 新状态
  // const [isTableMode, setIsTableMode] = useState(false)
  const [showMode, setShowMode] = useState<TModeShow>("box")
  const containerRef = useRef<HTMLDivElement>(null)
  const hasLoadRef = useRef(false)
  const { pathname } = useLocation()
  const setDvsStateCountMap = useSetAtom(AtomDvsStateCountMap)
  const setSignRdMapData = useSetAtom(AtomStnSignRdMap)
  const { stationMap } = useAtomValue(AtomStation)
  const [, setRun4Device] = useAtom(AtomAllTypeRun4DvsData)
  const urlStation = useMemo(() => {
    const urlStationCode = getParamDataFromUrl(pathname)
    if (!urlStationCode) return
    return stationMap[urlStationCode]
  }, [pathname, stationMap])

  useRun4deviceData({ isStart: !!urlStation })

  useEffect(() => {
    // 轮询获取场站挂牌分组数据, 打开弹窗关闭刷新，开弹窗时 isRefresh 为 false
    setSignRdMapData({ stnId: urlStation?.id, isRefresh: !drawerOpenMap["signalModal"] })
  }, [drawerOpenMap, setSignRdMapData, urlStation])

  useEffect(() => {
    // 组件卸载清理
    return () => {
      setDvsStateCountMap()
      setSignRdMapData()
    }
  }, [setDvsStateCountMap, setSignRdMapData])

  const initQuotaChecks = async () => {
    const res = await getMngStaticInfo()
    if (!res) return
    setChooseColumnKey(res.devcieChecks || {})
    setSiteChooseColumnKey(res.siteChecks || {})
  }

  useEffect(() => {
    initQuotaChecks()
    // 初始化页面时，指标选择框全选指标
    // const allKey = DEVICE_RUN_CARD_FIELD_4TYPE
    // const result = {}
    // Object.keys(allKey).forEach((i) => {
    //   result[i] = allKey[i].map((j) => j.field + "-" + i)
    // })
    // setChooseColumnKey(result)
    return () => setRun4Device()
  }, [])
  // 处理容器自适应
  useEffect(() => {
    const wrapDom = containerRef.current
    if (!wrapDom || hasLoadRef.current) return
    wrapDom.style.setProperty("--device-scale-ratio", "1")
    const timeout = window.setTimeout(() => {
      if (hasLoadRef.current) return
      const parentWidth = wrapDom.clientWidth
      const width = wrapDom.scrollWidth + 10
      const ratio = parseNum(parentWidth / width, 4)
      wrapDom.style.setProperty("--device-scale-ratio", `${ratio}`)
      hasLoadRef.current = true
    }, 500)
    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <div ref={containerRef} className="site-device-matrix-wrap">
      <DvsDetailContext.Provider
        value={{
          device: theDevice,
          setDevice: setTheDevice,
          drawerOpenMap,
          setDrawerOpenMap,
          deviceList,
          setDeviceList,
          chooseColumnKey,
          setChooseColumnKey,
          siteChooseColumnKey,
          setSiteChooseColumnKey,
          showMode,
          setShowMode,
          needShangdevice,
          setNeedShangdevice,
          isUseNewDvsState,
        }}
      >
        <DeviceMatrix4site station={urlStation} />
        <DeviceDetailDrawer containerDom={containerRef.current} />
        <DeviceSignalModal containerDom={containerRef.current} />
      </DvsDetailContext.Provider>
    </div>
  )
}
