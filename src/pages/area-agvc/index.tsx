/*
 * @Author: xiongman
 * @Date: 2023-09-05 10:39:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-14 16:45:58
 * @Description: 区域中心-AGVC总览
 */

import "./index.less"

// import { AtomStation } from "@store/atom-station.ts"
import { parseNum, validResErr } from "@utils/util-funs.tsx"
// import { useAtomValue } from "jotai"
import React, { useEffect, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import useMqttAgvc from "@/hooks/use-mqtt-agvc"
import { useRefresh } from "@/hooks/use-refresh"
import { IAgvcInfo, IAgvcMQDataMap } from "@/types/i-agvc"

import ColumnAreaAgvc from "./components/column-modal"
import TabAreaAgvc from "./components/tab-modal"
import { getStationInfo } from "./methods"
const currentModal = process.env["VITE_AREA_PAGE_SET"] || "column"
// const data = [
//   {
//     stationName: "连州",
//     AGCInput: true,
//     AVCInput: false,
//     // AGCActivePowerOrderBySchedule: 0,
//     realTimeTotalActivePowerOfSubStation: 23,
//     deviceId: "34",
//   },
//   {
//     stationName: "清远",
//     AGCInput: false,
//     AVCInput: true,
//     AGCActivePowerOrderBySchedule: 22,
//     realTimeTotalActivePowerOfSubStation: 56,
//     deviceId: "35",
//   },
//   {
//     stationName: "广州",
//     AGCInput: true,
//     AGCActivePowerOrderBySchedule: 7,
//     realTimeTotalActivePowerOfSubStation: 9,
//     deviceId: "36",
//   },
// ]
export default function AreaAgvc() {
  const [dataSource, setDataSource] = useState<IAgvcInfo[]>()
  const [agvcMqttData, setAgvcMqttData] = useState<IAgvcMQDataMap>()
  // console.log(agvcMqttData, "agvcMqttData")
  const [deviceList, setDeviceList] = useState([])
  const [allStationInfo, setAllStationInfo] = useState(null)
  const [reload, setReload] = useRefresh(5000)
  // const { stationMap, stationList } = useAtomValue(AtomStation)
  useMqttAgvc({ isStart: true, deviceCode: "", setAgvcMqttData })

  const getDeviceList = async () => {
    const params = {
      deviceType: "AGVC",
    }
    const res = await doBaseServer("queryDevicesDataByParams", params)
    if (validResErr(res)) return
    setDeviceList(res)
  }
  const getTotalCapacity = async () => {
    const res = await getStationInfo()
    if (!res) return
    setAllStationInfo(res)
    setReload(false)
  }

  useEffect(() => {
    if (!agvcMqttData) return
    // 先获取所有场站，根据mqtt返回的数据得出哪些场站没有数据，没数据的所有字段用“-”表示
    const getAllStationList = [] // 所有所有场站中的数据
    const test = {
      "410527W02SS11010022": {
        deviceCode: "410527W02SS11010022",
        totalInstalledCapacity: 10000,
        AGCActivePowerOrderBySchedule: 10,
        AGCInput: true,
        AGCRemoteOperation: true,
        activePowerAdjustRate: 1.1,
        AvailablePower: 0.2,
        loadRate: 0.34,
        realTimeGirdVolt: 230,
        AVCVoltageOrderBySchedule: 2345,
        decreaseActivePowerOfSubStation: 100000,
        scheduleToCapacityRate: 19,
        deviceId: 1239,
        deviceName: "AGVC01",
        stationName: "内黄硕风",
        stationCode: "410527W02",
      },
    }
    const actualData = Object.values(agvcMqttData).map((mqData) => {
      Object.keys(mqData).forEach((field) => {
        mqData[field] = parseNum(mqData[field], 2, mqData[field])
      })
      mqData.voltRate = parseNum((mqData.realTimeGirdVolt * 100) / (mqData.AVCVoltageOrderBySchedule || 1))
      mqData.rate = parseNum(
        (mqData.realTimeTotalActivePowerOfSubStation * 100) / (mqData.AGCActivePowerOrderBySchedule || 1),
      )
      mqData.deviceId = deviceList?.find((i) => i.deviceCode === mqData.deviceCode)?.deviceId
      mqData.deviceName = deviceList?.find((i) => i.deviceCode === mqData.deviceCode)?.deviceName
      return mqData
    })

    // // 获取所有mqtt未返回中存在的场站
    // stationList?.forEach((i) => {
    //   const findStation = actualData.find((j) => j.stationCode == i.stationCode)
    //   const deviceId = deviceList?.find((j) => j.stationCode === i.stationCode)?.deviceId
    //   const deviceName = deviceList?.find((j) => j.stationCode === i.stationCode)?.deviceName
    //   const totalInstalledCapacity = allStationInfo?.[i.stationCode]?.totalInstalledCapacity
    //   if (i.stationCode === findStation?.stationCode) {
    //     getAllStationList.push({
    //       ...findStation,
    //       deviceId,
    //       deviceName,
    //       totalInstalledCapacity,
    //     })
    //   } else {
    //     getAllStationList.push({
    //       stationCode: i.stationCode,
    //       stationName: i.shortName,
    //       deviceId,
    //       deviceName,
    //       totalInstalledCapacity,
    //     })
    //   }
    // })
    const allDevicesInfo = deviceList?.map((i) => {
      const findStation = actualData.find((j) => j.deviceCode === i.deviceCode) || {}
      return {
        ...findStation,
        ...i,
      }
    })
    setDataSource(allDevicesInfo)
  }, [agvcMqttData, deviceList, allStationInfo])
  useEffect(() => {
    getDeviceList()
  }, [])
  useEffect(() => {
    if (!reload) return
    getTotalCapacity()
  }, [reload])
  return (
    <div className="page-wrap area-agvc">
      {currentModal === "tab" ? <TabAreaAgvc dataSource={dataSource} /> : <ColumnAreaAgvc dataSource={dataSource} />}
    </div>
  )
}
