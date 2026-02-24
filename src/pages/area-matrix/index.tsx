/*
 * @Author: xiongman
 * @Date: 2023-08-30 10:18:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-02 13:59:26
 * @Description: 区域中心-矩阵监视
 */

import "./index.less"

import useRun4deviceData from "@hooks/use-run-4device-data.ts"
import { AtomDvsStateCountMap } from "@store/atom-run-device.ts"
import { AtomStation } from "@store/atom-station.ts"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"

import DvsDetailContext, { IDvsDetailContext } from "@/contexts/dvs-detail-context.ts"
import { TMatrixDrawerMap } from "@/types/i-device.ts"

import AreaInfoBox from "./components/area-info-box.tsx"
import DeviceDetailDrawer from "./components/device-detail-drawer.tsx"
import DeviceMatrix4area from "./components/device-matrix-4area.tsx"

export default function AreaMatrix() {
  const [theDevice, setTheDevice] = useState<IDvsDetailContext["device"]>(null)
  const [drawerOpenMap, setDrawerOpenMap] = useState<TMatrixDrawerMap>({})
  const [deviceList, setDeviceList] = useState<IDvsDetailContext["deviceList"]>([])
  const { stationList } = useAtomValue(AtomStation)
  const setDvsStateCountMap = useSetAtom(AtomDvsStateCountMap)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => setDvsStateCountMap()
  }, [setDvsStateCountMap])

  useRun4deviceData({ isStart: !!stationList?.length })

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
        }}
      >
        <div className="area-matrix">
          <AreaInfoBox />
          {stationList.map((station) => (
            <DeviceMatrix4area key={station.id} station={station} />
          ))}
        </div>
        <DeviceDetailDrawer containerDom={containerRef.current} />
      </DvsDetailContext.Provider>
    </div>
  )
}
