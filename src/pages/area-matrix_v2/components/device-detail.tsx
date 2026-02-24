/*
 * @Author: chenmeifeng
 * @Date: 2024-12-10 11:48:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-13 11:20:05
 * @Description: 单个设备详情
 */
import "./device-detail.less"

import { useContext, useEffect, useMemo, useRef, useState } from "react"

import { PopoverContent } from "@/components/device-card"
import useDeviceTag from "@/components/device-card/methods/use-device-tag"
import { DEVICE_RUN_CARD_FIELD_4TYPE } from "@/configs/dvs-state-info"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import { TDeviceType } from "@/types/i-config"
import { IDeviceData, IDeviceRunData4MQ } from "@/types/i-device"
import { queryDevicesByParams } from "@/utils/device-funs"

interface IProps {
  device: IDeviceData
  deviceType?: TDeviceType
  state: IDeviceRunData4MQ
  deviceTypeMap?: any
}
export default function DeviceDetail(props: IProps) {
  const { device, state, deviceTypeMap } = props
  const overlayRef = useRef(null)
  const [showPopover, setShowPopover] = useState(false)
  const [overlayStyle, setOverlayStyle] = useState(null)
  const { setDevice, setDrawerOpenMap, setDeviceList, chooseColumnKey } = useContext(DvsDetailContext)
  const filterChooseKeyColumns = useMemo(() => {
    if (!device) return []
    const allColumns = DEVICE_RUN_CARD_FIELD_4TYPE[device.deviceType]
    const columns = allColumns?.filter((i) =>
      chooseColumnKey?.[device.deviceType]?.includes(i.field + "-" + device.deviceType),
    )
    return columns
  }, [chooseColumnKey, device])
  const { contentList, tagStyle } = useDeviceTag(device, state, filterChooseKeyColumns)
  const styleRef = useMemo(() => {
    return {
      borderColor: tagStyle.color,
      color: "var(--white-color)", // tagStyle.color
      background:
        state && state.mainState != 6
          ? `linear-gradient(180deg, ${tagStyle.color} 0%, rgba(19,102,19,0.1) 40%)`
          : "none",
    }
  }, [tagStyle])
  const drawerOpenMapRef = useRef({ setDevice, setDrawerOpenMap, setDeviceList })
  drawerOpenMapRef.current = { setDevice, setDrawerOpenMap, setDeviceList }
  const onCompClkRef = () => {
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
  const mouseEnterRef = (event) => {
    setShowPopover(true)
  }
  useEffect(() => {
    if (showPopover) {
      const info = overlayRef?.current?.getBoundingClientRect()
      const position = {}
      if (info.y < 560) {
        position["top"] = "3em"
      } else {
        position["bottom"] = "3.5em"
      }
      if (info.x > 500) position["left"] = "-9em"
      setOverlayStyle(position)
    }
  }, [showPopover])
  return (
    <div className="area-dvs-detail">
      <span
        ref={overlayRef}
        className="detail-name"
        style={styleRef}
        onClick={onCompClkRef}
        onMouseLeave={() => setShowPopover(false)}
        onMouseEnter={(e) => mouseEnterRef(e)}
      >
        {device?.deviceName}
      </span>
      {showPopover ? (
        <div className="amatrix-pop-overlay" style={overlayStyle}>
          <div>{device?.deviceName}</div>
          <PopoverContent list={contentList} />
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
