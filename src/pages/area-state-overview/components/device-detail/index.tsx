/*
 * @Author: chenmeifeng
 * @Date: 2024-01-15 10:09:26
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-13 11:13:50
 * @Description:
 */
import "./index.less"

import { useContext, useEffect, useMemo, useRef, useState } from "react"

import useDeviceTag from "@/components/device-card/methods/use-device-tag"
import PopoverBox from "@/components/device-card/popover-box"
import PopoverContent from "@/components/device-card/popover-content"
import { DEVICE_RUN_CARD_FIELD_4TYPE } from "@/configs/dvs-state-info"
import DvsDetailContext from "@/contexts/dvs-detail-context"

import useStateType from "../useStateType"
import SignContextmenuBox from "./sign"
import LogModal from "../log-modal"

export default function DeviceDetail(props) {
  const { info, state, deviceType, onClick, showName, deviceSignState, refleshSign } = props
  // const cxtMenuBox = useRef<HTMLDivElement>()
  const overlayRef = useRef(null)
      const [showLogModal, setShowLogModal] = useState(false)

  const [showPopover, setShowPopover] = useState(false)
  const [overlayStyle, setOverlayStyle] = useState(null)
  const [showSign, setShowSign] = useState(false)
  const isCxtMenuOperate = useRef(false)
  const { drawerOpenMap, setDevice, device, closeCtxMenu, chooseColumnKey, setCloseCtxMenu, needShangdevice } =
    useContext(DvsDetailContext)

  const filterChooseKeyColumns = useMemo(() => {
    const allColumns = DEVICE_RUN_CARD_FIELD_4TYPE[deviceType]
    const columns = allColumns?.filter((i) => chooseColumnKey?.[deviceType]?.includes(i.field + "-" + deviceType))
    return columns
  }, [chooseColumnKey, deviceType])
  const { contentList, tagStyle } = useDeviceTag(info, state, filterChooseKeyColumns)
  const { unKnownState } = useStateType(deviceType)

  const isShang = useMemo(() => {
    return needShangdevice.includes(info?.deviceCode)
  }, [needShangdevice])
  const hiddenCtxMenu = useRef(() => {
    // 刷新挂牌信息
    refleshSign?.()
  })
  const openMenu = useRef((e) => {
    isCxtMenuOperate.current = true
    e.preventDefault()
    setShowPopover(false)
    setCloseCtxMenu(false)
    setDevice(info)
  })
  const clickDevice = useRef((e) => {
    isCxtMenuOperate.current = false
    e.stopPropagation()
    onClick?.(info)
  })
  const mouseEnterRef = (event) => {
    setShowPopover(true)
  }
  useEffect(() => {
    if (showPopover) {
      const info = overlayRef?.current?.getBoundingClientRect()
      const position = {}
      if (info.y < 500) {
        position["top"] = "1.8em"
      } else {
        position["bottom"] = "2.5em"
      }
      if (info.x > 600) position["left"] = "-10em"
      setOverlayStyle(position)
    }
  }, [showPopover])
  useEffect(() => {
    if (isCxtMenuOperate.current && device?.deviceId === info?.deviceId) {
      setShowSign(true)
    } else {
      setShowSign(false)
      isCxtMenuOperate.current = false
    }
  }, [device])
  useEffect(() => {
    if (closeCtxMenu && !drawerOpenMap.detail && !drawerOpenMap.dvsPart && !drawerOpenMap.signalModal) {
      // 鼠标点击组件内任意一点关闭挂牌小框
      setShowSign(false)
      setDevice(null)
    }
  }, [closeCtxMenu])
  return (
    <div key={info.deviceId} ref={overlayRef} className={`device-detail-one${deviceSignState ? " sign-border" : ""}`}>
      <div
        className="device-i"
        onClick={(e) => clickDevice.current(e)}
        onContextMenu={openMenu.current}
        onMouseLeave={() => setShowPopover(false)}
        onMouseEnter={(e) => mouseEnterRef(e)}
      >
        <span className={`device-icon ${isShang ? "shang" : ""}`} style={{ background: tagStyle?.color || "#b73cf2" }}>
          {state?.subState || unKnownState?.state}
        </span>
        {showName ? <span className="device-icon-dv">{info?.deviceTags?.operation_code || info?.deviceName}</span> : ""}
      </div>
      {showPopover ? (
        <div className="state-ovw-overlay" style={overlayStyle}>
          <div>{info?.deviceName}</div>
          <PopoverContent list={contentList} />
        </div>
      ) : (
        ""
      )}
      {/* <PopoverBox
        title={info?.deviceTags?.operation_code || info?.deviceName}
        content={<PopoverContent list={contentList} />}
      >
        <div className="device-i" onClick={clickDevice.current}>
          <span className="device-icon" style={{ background: tagStyle?.color || "#b73cf2" }}>
            {state?.subState || unKnownState?.state}
          </span>
          {showName ? (
            <span className="device-icon-dv">{info?.deviceTags?.operation_code || info?.deviceName}</span>
          ) : (
            ""
          )}
        </div>
      </PopoverBox> */}
      {showSign ? (
        <div className="cxt-menu" onMouseMove={(e) => e.preventDefault()}>
          <SignContextmenuBox device={info} hiddenBox={hiddenCtxMenu.current} onShowLogModal={() => setShowLogModal(true)}/>
        </div>
      ) : (
        ""
      )}
      {showLogModal ? (<LogModal open={showLogModal} device={info} onCancel={() => setShowLogModal(false)} />) : ("")}
    </div>
  )
}
