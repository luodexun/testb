/*
 * @Author: chenmeifeng
 * @Date: 2024-01-12 14:14:11
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-07 16:52:57
 * @Description:
 */
import "./index.less"

import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { getsiteUrl } from "@/router/menu-site"
import { TStnDvsRunData4MQ } from "@/types/i-device"
import { uDate } from "@/utils/util-funs"

import DeviceGroup from "../device-group"
import useStateType from "../useStateType"
import { getTypeDeviceSignRecordData } from "../../methods"
import { useRefresh } from "@/hooks/use-refresh"
import { IDvsSignInfo } from "../../types"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import DeviceSignalModal from "@/pages/site-matrix/components/device-signal-modal"
export default function StationList(props) {
  const { deviceType, run4Device, layout, activeStateKey, currntStationList, deviceData } = props
  // const { deviceType, run4Device, layout, currntStationList, deviceData } = props

  const modalRef = useRef()
  const [reload, setReload] = useRefresh(5000)
  const { unKnownState } = useStateType(deviceType)
  const [stnDeviceData, setStnDeviceData] = useState<TStnDvsRunData4MQ>({})
  const [dvSignStateList, setDvSignStateList] = useState<IDvsSignInfo>({})
  const { showSign } = useContext(DvsDetailContext)
  // const [activeStateKey, setActiveStateKey] = useState(["2"])
  // 存在设备的场站
  const actualUnEmptyDevStation = useMemo(() => {
    return currntStationList.filter((i) => deviceData[i.id]?.length)
  }, [currntStationList, deviceData])
  // 存在挂牌的所有设备id
  const existSignDvsIds = useMemo(() => {
    return Object.keys(dvSignStateList)?.map((i) => parseInt(i)) || []
  }, [dvSignStateList])

  // 获取当前场站下所有挂牌信息
  const getDeviceSignRecord = async () => {
    const params = {
      deviceType: deviceType,
      isEnd: false,
    }
    const res = await getTypeDeviceSignRecordData(params)
    setReload(false)
    // 储存所有设备挂牌信息
    const records = res
      .filter((i) => !i.endTime && i.signState)
      .reduce((prev, cur) => {
        if (!prev[cur.deviceId]) {
          prev[cur.deviceId] = []
        }
        prev[cur.deviceId].push(cur)
        return prev
      }, {})
    setDvSignStateList(records as IDvsSignInfo)
  }
  const refleshSign = useRef(() => {
    getDeviceSignRecord()
  })
  const refleshData = useRef(() => {
    refleshSign.current()
  })
  useEffect(() => {
    if (!reload) return
    getDeviceSignRecord()
  }, [reload])
  useEffect(() => {
    // if (deviceData && run4Device) {
    if (deviceData) {
      const actualList = {}
      Object.keys(deviceData).forEach((j) => {
        const WTData = run4Device || {}
        actualList[j] = deviceData[j]?.map((i) => {
          return {
            ...i,
            runData:
              {
                ...WTData?.[i.deviceCode],
                subState: WTData?.[i.deviceCode]?.subState || unKnownState?.state,
              } || {},
            deviceNumber: i.deviceTags?.operation_code || i.deviceName,
            ratedPower: i.deviceTags?.rated_power,
            operatDateStr: uDate(i.operationDate, undefined, ""),
          }
        })
      })
      // console.log(actualList, "actualList")

      setStnDeviceData(actualList) // 设置场站下所有设备数据+状态数据
    }
  }, [run4Device, deviceData, deviceType])

  // 返回选中状态/挂牌的设备数据
  const actStnActiveList = useMemo<TStnDvsRunData4MQ>(() => {
    const resultStnActiveList = {}
    Object.keys(stnDeviceData).forEach((i) => {
      resultStnActiveList[i] = stnDeviceData[i].filter((j) =>
        activeStateKey?.length
          ? !showSign
            ? activeStateKey.includes(j?.runData?.subState?.toString())
            : activeStateKey.includes(j?.runData?.subState?.toString()) && existSignDvsIds.includes(j.deviceId)
          : !showSign
            ? true
            : existSignDvsIds.includes(j.deviceId),
      )
    })
    return resultStnActiveList
  }, [stnDeviceData, activeStateKey, showSign])

  return (
    <div className="station-list" ref={modalRef}>
      {actualUnEmptyDevStation.map((station) => {
        const isEmptyDevice = actStnActiveList[station.value]?.length || 0
        // <Spin tip="Loading">加载渲染中</Spin>
        return !isEmptyDevice ? (
          ""
        ) : (
          <div key={station.value} className="station-list-item">
            <Link
              className="device-matrix-wrap-link"
              to={`/site/${station?.maintenanceComId}/${station?.stationCode}/${getsiteUrl(station?.stationType)}`}
            >
              <div className="station-item-left">{station.label}</div>
            </Link>
            <div className="station-item-right">
              <DeviceGroup
                key={station.value + deviceType}
                deviceType={deviceType}
                layout={layout}
                stationId={station.value}
                deviceData={actStnActiveList[station.value]}
                deviceSignRecord={dvSignStateList}
                refleshSign={refleshSign.current}
              />
            </div>
          </div>
        )
      })}
      <DeviceSignalModal containerDom={modalRef.current} refleshData={refleshData.current} />
    </div>
  )
}
