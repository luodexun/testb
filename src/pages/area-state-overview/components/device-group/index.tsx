/*
 * @Author: chenmeifeng
 * @Date: 2024-01-12 15:54:27
 * @LastEditors: error: git config user.name & please set dead value or install git
 * @LastEditTime: 2025-01-22 09:44:39
 * @Description: 区域中心-状态总览
 */
import "./index.less"

import classnames from "classnames"
import { useAtomValue } from "jotai"
import { useContext, useEffect, useMemo, useRef, useState } from "react"

import DvsDetailContext from "@/contexts/dvs-detail-context"
import { AtomConfigMap } from "@/store/atom-config"
import { IDeviceData } from "@/types/i-device"
import { queryDevicesByParams } from "@/utils/device-funs"
import { isEmpty, reduceList2KeyValueMap } from "@/utils/util-funs"

import { getTypeDeviceSignRecordData } from "../../methods"
import DeviceDetail from "../device-detail"
import { useRefresh } from "@/hooks/use-refresh"
import { IDvsSignInfo } from "../../types"
// import useStateType from "../useStateType"

const NOT_GROUP = "NOT_GROUP"

function isNotGroup(lineName: string) {
  return isEmpty(lineName) || lineName === NOT_GROUP
}
interface IProps {
  deviceType?: string
  layout?: string
  deviceData: Array<IDeviceData>
  stationId?: number
  deviceSignRecord?: IDvsSignInfo
  refleshSign?: () => void
}
export default function DeviceGroup(props: IProps) {
  const { deviceType, stationId, layout, deviceSignRecord, refleshSign, deviceData } = props
  const [dvSignStateList, setDvSignStateList] = useState({})
  const [reload, setReload] = useRefresh(5000)
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  // const { deviceSignal } = useAtomValue(AtomConfigMap).list
  const { setDevice, setDrawerOpenMap, setDeviceList, isTableMode } = useContext(DvsDetailContext)

  const { nameList, groupMap } = useMemo(() => {
    const bySite = layout === "site"
    const groupBy = bySite ? NOT_GROUP : layout
    const fieldInfo = { vField: groupBy }
    const groupMap = bySite ? { [NOT_GROUP]: deviceData || [] } : reduceList2KeyValueMap(deviceData, fieldInfo, [])
    const nameList = Object.keys(groupMap)
    return { nameList, groupMap }
  }, [layout, deviceData])

  const drawerOpenMapRef = useRef({ setDevice, setDrawerOpenMap, setDeviceList })
  // drawerOpenMapRef.current = { setDevice, setDrawerOpenMap, setDeviceList }
  const onCompClkRef = useRef((device: Omit<IDeviceData, "runData">) => {
    drawerOpenMapRef.current?.setDrawerOpenMap({ detail: true })
    drawerOpenMapRef.current?.setDevice(device)
    getDeviceList(device)
  })

  const getDeviceList = async (device) => {
    const deviceList = await queryDevicesByParams(
      {
        stationCode: device.stationCode,
        deviceType: device.deviceType,
      },
      deviceTypeMap,
    )
    drawerOpenMapRef.current?.setDeviceList(deviceList)
  }

  // 获取当前场站下所有挂牌信息
  const getDeviceSignRecord = async () => {
    const params = {
      stationId: stationId,
      deviceType: deviceType,
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

    // const deviceAllSignal = deviceSignal.map((i) => i.signState)
    // 所有设备是否全部挂牌，true表示都挂牌，false表示不完全挂牌
    // const devSignState = Object.keys(records).reduce((prev, cur) => {
    //   const signList = records[cur].map((i) => i.signState)
    //   let flag = true
    //   deviceAllSignal.forEach((one) => {
    //     if (!signList.includes(one)) {
    //       flag = false
    //     }
    //   })
    //   prev[cur] = flag
    //   return prev
    // }, {})
    setDvSignStateList(records)
  }
  useEffect(() => {
    if (!reload) return
    // getDeviceSignRecord()
  }, [reload])

  return (
    <div className="device-group">
      {nameList.map((lineName) => (
        <div key={lineName} className={classnames("line-metrix-group", { "matrix-by-group": !isNotGroup(lineName) })}>
          {isNotGroup(lineName) ? null : <div className="line-name" children={lineName} />}
          <div className="line-group">
            {groupMap[lineName]?.map(({ runData, ...deviceInfo }) => {
              return (
                <DeviceDetail
                  key={deviceInfo.deviceCode}
                  state={runData}
                  deviceType={deviceType}
                  info={deviceInfo}
                  onClick={onCompClkRef.current}
                  showName={!isTableMode}
                  deviceSignState={deviceSignRecord?.[deviceInfo.deviceId]?.length}
                  refleshSign={refleshSign}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
