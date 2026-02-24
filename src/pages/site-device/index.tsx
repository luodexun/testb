/*
 * @Author: chenmeifeng
 * @Date: 2024-07-15 16:02:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-15 16:01:31
 * @Description:
 */
import "./index.less"

import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router"

import { IFormInst } from "@/components/custom-form/types"
import CustomTable from "@/components/custom-table"
import useMqttDvsPoint from "@/hooks/use-mqtt-dvs-point"
import usePageSearch from "@/hooks/use-page-search"
import { AtomStation } from "@/store/atom-station"
import { IDeviceData } from "@/types/i-device"
import { getParamDataFromUrl } from "@/utils/menu-funs"

import NamePanel from "../area-matrix/components/name-panel"
import PointDrawer from "./components/point-drawer"
import { SIT_DEVICE_COLUMNS } from "./configs"
import { getSiteDvSchData } from "./methods"

export default function SiteDevice() {
  const formRef = useRef<IFormInst | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showDrawn, setShowDrawn] = useState(false)
  const [allRealtimeDvsPoint, setAllRealtimeDvsPoint] = useState(null)
  const [operateInfo, setOperateInfo] = useState<IDeviceData>(null)
  const { stationMap } = useAtomValue(AtomStation)

  const { pathname } = useLocation()

  const stationInfo = useMemo(() => {
    const stationCode = getParamDataFromUrl(pathname)
    return stationMap[stationCode]
  }, [pathname, stationMap])
  const deviceType = useMemo(() => {
    const type = getParamDataFromUrl(pathname, 4)
    return type.toUpperCase()
  }, [pathname, stationMap])
  useMqttDvsPoint({
    deviceType: deviceType === "PVDCB" ? "pvdcb" : null,
    stationCode: stationInfo?.stationCode,
    setPointData: setAllRealtimeDvsPoint,
  })
  const { dataSource, loading, pagination, onSearch } = usePageSearch(
    { serveFun: getSiteDvSchData },
    {
      otherParams: {
        stationCode: stationInfo?.stationCode,
        deviceType: deviceType, // deviceType
      },
    },
  )

  const onTbAction = useRef((record) => {
    setOperateInfo(record)
    setShowDrawn(true)
  })

  const realtimeDvsLs = useMemo(() => {
    if (!allRealtimeDvsPoint || !dataSource?.length) return false
    const actualLs = dataSource.map((i) => {
      const ls = allRealtimeDvsPoint?.[i.deviceCode] || {}
      return {
        ...i,
        ...ls,
      }
    })
    return actualLs
  }, [allRealtimeDvsPoint, dataSource])
  return (
    <div className="l-full site-dv-wrap" ref={containerRef}>
      {/* <CardTitle children={stationInfo?.shortName} /> */}
      <NamePanel name={stationInfo?.fullName} option={stationInfo} className="site-name" />
      <div className="site-dv-table">
        <CustomTable
          rowKey="row_idx"
          limitHeight
          loading={loading}
          columns={SIT_DEVICE_COLUMNS({ onClick: onTbAction.current, deviceType })}
          dataSource={realtimeDvsLs || dataSource}
          pagination={pagination}
        />
      </div>
      <PointDrawer
        containerDom={containerRef.current}
        showDrawn={showDrawn}
        clickDevice={operateInfo}
        setShowDrawn={setShowDrawn}
        deviceList={dataSource}
      />
    </div>
  )
}
