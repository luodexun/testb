/*
 * @Author: chenmeifeng
 * @Date: 2024-04-03 14:00:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-20 10:50:28
 * @Description:
 */

import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation } from "react-router-dom"

import CustomTable from "@/components/custom-table"
import useMqttDevicemng from "@/hooks/use-mqtt-devicemng"
import useTableSelection from "@/hooks/use-table-selection"
import { AtomStation } from "@/store/atom-station"
import { TSDevicemngData } from "@/types/i-devicemng"
import { getParamDataFromUrl } from "@/utils/menu-funs"

import ControlBtnGroup from "./components/control-btn-group"
import DeviceDetailDrawer from "./components/devicemng-detail-drawer.tsx"
import NamePanel from "./components/name-panel.tsx"
import { CONTROL_DEVICEMNG_COLUMNS } from "./configs/index"
import { getSiteDevicemngSchData } from "./methods"
import { IRpDevicemngSchForm, IRpGRIDData } from "./types"
const rowSelectProps = {
  needInfo: true,
  getCheckboxProps: (record: any) => ({
    name: record.deviceId,
  }),
}

export default function SiteTower() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [clickDevice, setClickDevice] = useState(null)
  const [showDrawn, setShowDrawn] = useState(false)
  const { stationMap } = useAtomValue(AtomStation)

  const { pathname } = useLocation()

  const stationInfo = useMemo(() => {
    const stationCode = getParamDataFromUrl(pathname)
    return stationMap[stationCode]
  }, [pathname, stationMap])

  const { dataSource, setDataSource, loading, pagination, onSearch } = usePageSearch<IRpDevicemngSchForm, IRpGRIDData>(
    { serveFun: getSiteDevicemngSchData },
    {
      otherParams: {
        stationCode: stationInfo?.stationCode,
        deviceType: "WTTRA,PVTRA,ESTRA",
      },
    },
  )
  const [sweatherData, setSweatherData] = useState<TSDevicemngData>()

  useMqttDevicemng({ stationCode: getParamDataFromUrl(pathname), setSweatherData, startMqtt: !showDrawn })

  useEffect(() => {
    if (!dataSource?.length) return
    setDataSource((prev) => {
      const result = prev?.map((i) => {
        const info = sweatherData?.[i.deviceCode]
        return {
          ...i,
          ...info,
        }
      })
      return [...result]
    })
  }, [sweatherData])
  useEffect(() => {
    onSearch()
  }, [stationInfo])

  // 选择框
  const { rowSelection } = useTableSelection(rowSelectProps)

  function onTbAction(record: any) {
    setClickDevice(record)
    setShowDrawn(true)
  }
  function changeSearch(e, info) {
    onSearch()
  }
  return (
    <div className="l-full site-devicemng-wrap" ref={containerRef}>
      <div className="site-devicemng-header">
        <NamePanel
          name={stationInfo?.fullName}
          option={stationInfo}
          className="site-name"
          changeSearch={changeSearch}
        />
        <ControlBtnGroup rowSelection={rowSelection} deviceList={dataSource} />
      </div>

      <div className="site-devicemng-content">
        <CustomTable
          rowKey="deviceId"
          rowSelection={rowSelection}
          loading={loading}
          limitHeight
          columns={CONTROL_DEVICEMNG_COLUMNS({ onClick: onTbAction })}
          dataSource={dataSource}
          pagination={{ ...pagination, pageSize: dataSource.length, pageSizeOptions: [dataSource.length] }}
        />
      </div>
      <DeviceDetailDrawer
        containerDom={containerRef.current}
        showDrawn={showDrawn}
        setShowDrawn={setShowDrawn}
        clickDevice={clickDevice}
        deviceList={dataSource}
      />
    </div>
  )
}
