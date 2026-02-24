import "./device-matrix-by-table.less"

import { isNumber } from "ahooks/es/utils"
import { useAtomValue } from "jotai"
import { useContext, useMemo, useRef } from "react"

import CustomTable from "@/components/custom-table"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import { AtomConfigMap } from "@/store/atom-config"
import { IDeviceData } from "@/types/i-device"
import { calcRate, queryDevicesByParams } from "@/utils/device-funs"

export default function DeviceMatrixTable(props) {
  const { columns, list } = props
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const { setDevice, setDrawerOpenMap, setDeviceList } = useContext(DvsDetailContext)
  const dataSource = useMemo(() => {
    const result = list.map((i) => {
      const runData = i?.runData
      let rate
      if (isNumber(runData?.activePower) && isNumber(i.ratedPower)) {
        rate = calcRate(runData?.activePower, i.ratedPower)
      }
      return {
        ...i,
        ...i?.runData,
        rate,
      }
    })
    return result
  }, [list])

  const drawerOpenMapRef = useRef({ setDevice, setDrawerOpenMap, setDeviceList })
  drawerOpenMapRef.current = { setDevice, setDrawerOpenMap, setDeviceList }
  const onCompClkRef = (device: Omit<IDeviceData, "runData">) => {
    drawerOpenMapRef.current?.setDrawerOpenMap({ detail: true })
    drawerOpenMapRef.current?.setDevice(device)
    getDeviceList(device)
  }
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

  return (
    <CustomTable
      rowKey="deviceCode"
      onRow={(record) => {
        return {
          onClick: () => {
            onCompClkRef(record)
          }, // 点击行
        }
      }}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  )
}
