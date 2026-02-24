/*
 * @Author: chenmeifeng
 * @Date: 2025-08-13 09:54:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-15 17:27:49
 * @Description:
 */
import "./index.less"

import { Tabs } from "antd"
import { useEffect, useMemo, useRef, useState } from "react"

import CustomTable from "@/components/custom-table"
import useMqttDvsPoint from "@/hooks/use-mqtt-dvs-point.ts"
import { IBoostMQData } from "@/types/i-boost.ts"
import { IDeviceData } from "@/types/i-device.ts"
import { queryDevicesByParams } from "@/utils/device-funs.ts"

import { AREA_ENERGE_ACTIVE_COLUMNS, AREA_ENERGE_REACTIVE_COLUMNS } from "./configs"
const tabsList = [
  { key: "1", label: "有功调节", closable: false },
  { key: "2", label: "无功调节", closable: false },
]
export default function TabAreaEnergy() {
  // const { dataSource } = props
  const [activeKey, setActiveKey] = useState("1")
  const [deviceList, setDeviceList] = useState<IDeviceData[]>([])
  const [dataSource, setDataSource] = useState<any[]>([])
  const [deviceMapData, setRealtimePointData] = useState<IBoostMQData>()

  useMqttDvsPoint({
    deviceType: "nlgl",
    setPointData: setRealtimePointData,
  })

  const activeColumns = useMemo(() => {
    return activeKey === "1" ? AREA_ENERGE_ACTIVE_COLUMNS(dataSource) : AREA_ENERGE_REACTIVE_COLUMNS(dataSource)
  }, [activeKey, dataSource])

  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
  })

  const getAllDevice = async () => {
    const dvsList = await queryDevicesByParams({ deviceType: "NLGL" })
    // const test = [
    //   {
    //     deviceCode: "441882W01WT1101001",
    //     deviceName: "风电机组",
    //     deviceId: 1,
    //     ReactivePowerControlModeFeedback: 1,
    //     ActivePowerControlModeFeedback: null,
    //   },
    // ]
    setDeviceList(dvsList)
    // const stationDvsMap = dvsList?.reduce((prev, cur) => {
    //   if (!prev?.[cur.stationId]) {
    //     prev[cur.stationId] = []
    //   }
    //   prev[cur.stationId].push(cur)
    //   return prev
    // }, {})
    // console.log(dvsList, "dvsList", Object.values(stationDvsMap))
    // setDataSource(dvsList)
  }

  useEffect(() => {
    if (deviceMapData) {
      const res = deviceList?.map((i) => {
        const info = deviceMapData[i.deviceCode] || {}
        return {
          stationName: i.stationName,
          deviceId: i.deviceId,
          deviceName: i.deviceName,
          deviceTags: i.deviceTags,
          stationCode: i.stationCode,
          maintenanceComId: i.maintenanceComId,
          modelId: i.modelId,
          ...info,
        }
      })
      setDataSource(res)
    } else {
      setDataSource(deviceList)
    }
  }, [deviceMapData, deviceList])
  useEffect(() => {
    getAllDevice()
  }, [])
  return (
    <div className="page-wrap area-energy">
      <Tabs
        type="editable-card"
        hideAdd
        tabBarGutter={4}
        items={tabsList}
        activeKey={activeKey}
        onChange={onTabsChgRef.current}
      />
      <CustomTable
        dataSource={dataSource}
        columns={activeColumns}
        rowKey="deviceId"
        limitHeight
        bordered
        pagination={false}
      />
    </div>
  )
}
