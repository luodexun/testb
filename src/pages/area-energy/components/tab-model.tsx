/*
 * @Author: chenmeifeng
 * @Date: 2024-01-31 18:18:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-18 09:38:51
 * @Description: 能量管理
 */
import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"

import StationCard from "./station-dvs-card.tsx"
import { queryDevicesByParams } from "@/utils/device-funs.ts"
import { IDeviceData } from "@/types/i-device.ts"
import useMqttDvsPoint from "@/hooks/use-mqtt-dvs-point.ts"
import { IBoostMQData } from "@/types/i-boost.ts"

export default function TabAreaEnergy(props) {
  // const { dataSource } = props
  const [activeKey, setActiveKey] = useState("1")
  const [dataSource, setDataSource] = useState<IDeviceData[]>([])
  const [deviceMapData, setRealtimePointData] = useState<IBoostMQData>()
  const tabsList = [
    { key: "1", label: "有功功率控制", closable: false },
    { key: "2", label: "无功功率控制", closable: false },
  ]

  useMqttDvsPoint({
    deviceType: "nlgl",
    setPointData: setRealtimePointData,
  })

  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
  })

  const getAllDevice = async () => {
    const dvsList = await queryDevicesByParams({ deviceType: "NLGL" })
    setDataSource(dvsList)
  }

  useEffect(() => {
    console.log(deviceMapData, "能量管理pointData")
  }, [deviceMapData])
  useEffect(() => {
    getAllDevice()
  }, [])
  return (
    <div className="l-full area-energy-tabs">
      {/* <Tabs
        type="editable-card"
        hideAdd
        tabBarGutter={4}
        items={tabsList}
        activeKey={activeKey}
        onChange={onTabsChgRef.current}
      />
       */}
      <div className="station-card-list">
        {dataSource?.map((item) => {
          return (
            <StationCard
              key={item.stationCode + item.deviceCode}
              deviceData={item}
              deviceRealTimeData={deviceMapData?.[item.deviceCode]}
              tabKey={activeKey}
            />
          )
        })}
      </div>
    </div>
  )
}
