/*
 * @Author: xiongman
 * @Date: 2023-08-31 14:53:56
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-07 10:46:58
 * @Description: 场站设备矩阵-单场站、多设备类型
 */

import "./device-matrix-4area.less"

import useMatrixDeviceList from "@hooks/use-matrix-device-list.ts"
import { useMemo } from "react"
import { Link } from "react-router-dom"

import { getsiteUrl } from "@/router/menu-site.ts"
import { TDeviceType } from "@/types/i-config.ts"
import { IStationData } from "@/types/i-station.ts"

import DeviceMatrixForType from "./device-matrix-for-type.tsx"
import NamePanel from "./name-panel.tsx"

interface IProps {
  station: IStationData
}

export default function DeviceMatrix4area(props: IProps) {
  const { station } = props

  const dvsTypeGroup = useMatrixDeviceList({ station })
  const dTypeList = useMemo(() => Object.keys(dvsTypeGroup || {}) as TDeviceType[], [dvsTypeGroup])

  return (
    <div className="device-matrix-wrap">
      <Link
        className="device-matrix-wrap-link"
        to={`/site/${station?.maintenanceComId}/${station?.stationCode}/${getsiteUrl(station?.stationType)}`}
      >
        <NamePanel name={station?.fullName} className="site-name" />
      </Link>
      <div className="type-of-device-matrix">
        {dTypeList?.map((deviceType) => (
          <DeviceMatrixForType
            key={`${station.id}_${deviceType}`}
            dvsType={deviceType}
            station={station}
            dvsList={dvsTypeGroup[deviceType]}
          />
        ))}
      </div>
    </div>
  )
}
