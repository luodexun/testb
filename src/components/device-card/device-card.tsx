/*
 * @Author: xiongman
 * @Date: 2023-08-30 15:24:06
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-18 20:02:48
 * @Description: 场站设备矩阵卡片组件
 */

import "./device-card.less"

import { MouseEvent, useContext, useRef, useState, useEffect } from "react"

import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IDeviceData, IDeviceRunData4MQ } from "@/types/i-device.ts"

import DeviceCardBase from "./device-card-base.tsx"
import useDeviceTag from "./methods/use-device-tag.ts"
import SignContextmenuBox from "./sign"
import LogModal from "../../pages/area-state-overview/components/log-modal"

interface IProps {
  info: Omit<IDeviceData, "runData">
  state: IDeviceRunData4MQ
  onClick?: (info: IProps["info"]) => void
  onRightClick?: (info: IProps["info"]) => void
  onContextMenu?: (event,info: any) => void
}

export default function DeviceCard(props: IProps) {
  const { info, state, onClick, onContextMenu } = props
  const [showSign, setShowSign] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
  const { setDrawerOpenMap, setDevice } = useContext(DvsDetailContext)

  const { tagStyle, mixedData } = useDeviceTag(info, state)

  const drawerOpenMapRef = useRef({ setDrawerOpenMap, setDevice })
  drawerOpenMapRef.current = { setDrawerOpenMap, setDevice }
  const rightClkRef = useRef((device: IDeviceData, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (onContextMenu) {
      onContextMenu(event,device)
    }
    setShowSign(true)
    // drawerOpenMapRef.current?.setDrawerOpenMap({ signalModal: true })
    drawerOpenMapRef.current?.setDevice(device)
  })
  const hiddenCtxMenu = useRef(() => {
    // refleshSign?.()
    setShowSign(false)
  })
  const handleLogModal = () => {
    setShowLogModal(true)
    setShowSign(false)
  }
  const handleCloseLogModal = (e) => {
    if(e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setShowLogModal(false)
  }
  const signMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (signMenuRef.current && !signMenuRef.current.contains(event.target as Node)) {
        setShowSign(false)
      }
    }
    
    if (showSign) {
      document.addEventListener("mousedown", handleClickOutside as any);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as any);
    };
  }, [showSign]);
  return (
    <div
      onClick={() => onClick?.(info)}
      onContextMenu={rightClkRef.current.bind(null, info)}
      className="popover-content-wrap"
    >
      <DeviceCardBase mixedData={mixedData} tagStyle={tagStyle} />
      {showSign ? (
          <div className={'sign-contextmenu-box'} ref={signMenuRef}onMouseMove={(e) => e.preventDefault()} style={{ position: "relative", zIndex:1, }}>
            <SignContextmenuBox device={info} hiddenBox={hiddenCtxMenu.current} onShowLogModal={handleLogModal}/>
          </div>
        ) : (
          ""
        )}
      {showLogModal ? (
        <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} style={{ pointerEvents: 'auto' }}>
          <LogModal open={showLogModal} device={info} onCancel={handleCloseLogModal} />
        </div>
      ) : ("")}

    </div>
  )
}
