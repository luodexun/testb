/*
 * @Author: xiongman
 * @Date: 2023-09-26 11:33:49
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-07 10:09:33
 * @Description:
 */

import "./detail-title.less"

import { Button } from "antd"
import { useContext, useEffect, useRef, useState } from "react"

import DvsDetailContext from "@/contexts/dvs-detail-context.ts"

import DeviceInfoBox from "./device-info-box.tsx"

interface IProps {
  showPart?: boolean
}
export default function DetailTitle(props: IProps) {
  const { showPart } = props
  const { setDevice, setDrawerOpenMap, device, deviceList } = useContext(DvsDetailContext)

  const [lastDisabled, setLastDisabled] = useState(false) // 上一步是否禁用
  const [nextDisabled, setNextDisabled] = useState(false) // 上一步是否禁用

  useEffect(() => {
    // 监听设备改变，查找设备在设备列表中的位置，设置上一步/下一步是否禁用
    if (!deviceList?.length) return
    const deviceIdx = deviceList?.findIndex((i) => i.deviceId == device?.deviceId)
    setLastDisabled(deviceIdx === 0)
    setNextDisabled(deviceIdx === deviceList.length - 1)
  }, [device, deviceList])

  const clickTimeChange = useRef<any>()
  const clickRef = (type: "back" | "part" | "last" | "next") => {
    if (type === "back" && !showPart) {
      clearTimeout(clickTimeChange.current)
      clickTimeChange.current = setTimeout(() => {
        setDrawerOpenMap({ detail: true })
      }, 400)
      return
    }
    if (type === "back") {
      setDrawerOpenMap({})
      setDevice(null)
      return
    }
    if (showPart && type === "part") return setDrawerOpenMap({ dvsPart: true })
    if (type == "last") {
      const devices = deviceList.findIndex((i) => i.deviceId == device.deviceId)
      setDevice(deviceList[devices - 1])
    }
    if (type == "next") {
      const devices = deviceList.findIndex((i) => i.deviceId == device.deviceId)
      setDevice(deviceList[devices + 1])
    }
  }

  const doubleClk = useRef(() => {
    if (!showPart) {
      clearTimeout(clickTimeChange.current)
      setDrawerOpenMap({})
      setDevice(null)
    }
  })
  return (
    <div title="设备详情" className="detail-title-wrap">
      <Button
        size="small"
        shape="circle"
        title="返回"
        onClick={clickRef.bind(null, "back")}
        onDoubleClick={doubleClk.current}
      />
      <div style={{ flex: 1 }}>
        <DeviceInfoBox />
      </div>
      <div>
        {showPart ? (
          <Button size="small" children="部件监视" className="dvs-part-btn" onClick={clickRef.bind(null, "part")} />
        ) : (
          ""
        )}
        <Button
          size="small"
          disabled={lastDisabled}
          children="上一台"
          className="dvs-part-btn"
          onClick={clickRef.bind(null, "last")}
        />
        <Button
          size="small"
          disabled={nextDisabled}
          children="下一台"
          className="dvs-part-btn"
          onClick={clickRef.bind(null, "next")}
        />
      </div>
    </div>
  )
}
