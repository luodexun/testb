import "./device-matrix-by-list.less"

import { Empty } from "antd"
import { useAtomValue } from "jotai"
import { debounce } from "lodash"
import { useContext, useEffect, useMemo, useRef, useState } from "react"

// import { useLocation } from "react-router-dom"
import { DeviceCard, DeviceTag, PopoverContent } from "@/components/device-card"
import useDeviceTag from "@/components/device-card/methods/use-device-tag"
import { DEVICE_RUN_CARD_FIELD_4TYPE } from "@/configs/dvs-state-info"
import { StorageIsAlarmGo } from "@/configs/storage-cfg"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { AtomConfigMap } from "@/store/atom-config"
import { TDeviceType } from "@/types/i-config"
import { IDeviceData } from "@/types/i-device.ts"
import { queryDevicesByParams } from "@/utils/device-funs"
import { getStorage, setStorage } from "@/utils/util-funs"

interface IProps {
  list?: IDeviceData[]
  allDvs?: IDeviceData[]
  deviceType?: string
}
// const lists = []
// for (let i = 0; i < 900; i++) {
//   lists.push({
//     runData: {},
//     deviceCode: i + 1,
//     deviceNumber: i + 1,
//   })
// }
export default function DeviceMatrixByList(props: IProps) {
  const { list, allDvs = [], deviceType } = props
  const { setDevice, setDrawerOpenMap, setDeviceList, showMode, chooseColumnKey } = useContext(DvsDetailContext)
  // const { pathname } = useLocation()
  const [currentDev, setCurrentDev] = useState("")
  const isFirst = useRef(true)
  const isGoDeviceDetail = getStorage(StorageIsAlarmGo)
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const listBoxRef = useRef<HTMLDivElement>()
  const timeoutRef = useRef(null)
  useEffect(() => {
    setCurrentDev(isGoDeviceDetail)
  }, [isGoDeviceDetail])

  useEffect(() => {
    if (currentDev && isFirst) {
      isFirst.current = false
      const deviceId = parseInt(currentDev)
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        const device = allDvs.find((i) => i.deviceId == deviceId)
        if (!device) return
        onCompClkRef(device)
        setStorage(JSON.stringify(false), StorageIsAlarmGo)
      }, 800)
    }
    return () => clearTimeout(timeoutRef.current)
  }, [currentDev])

  // const DeviceComp = useMemo(() => {
  //   const isSite = pathname?.startsWith("/site")
  //   return isSite ? DeviceCard : DeviceTag
  // }, [pathname])
  const DeviceComp = useMemo(() => {
    return showMode === "box" ? DeviceCard : DeviceTag
  }, [showMode])

  const drawerOpenMapRef = useRef({ setDevice, setDrawerOpenMap, setDeviceList })
  drawerOpenMapRef.current = { setDevice, setDrawerOpenMap, setDeviceList }
  const onCompClkRef = (device: Omit<IDeviceData, "runData">) => {
    drawerOpenMapRef.current?.setDrawerOpenMap({ detail: true })
    drawerOpenMapRef.current?.setDevice(device)
    setCurrentDev("")
    getDeviceList(device)
    setCurrentDeviceCode("")
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

  const currentState = useRef(null)
  const currentInfo = useRef(null)
  const [currentDeviceCode, setCurrentDeviceCode] = useState("")
  const overlayRef = useRef(null)
  const [overlayStyle, setOverlayStyle] = useState({ top: "0", left: "0" })
  const debouncedFunction = useRef(null)

  const filterChooseKeyColumns = useMemo(() => {
    if (!deviceType) return []
    const allColumns = DEVICE_RUN_CARD_FIELD_4TYPE[deviceType]
    const columns = allColumns?.filter((i) => chooseColumnKey?.[deviceType]?.includes(i.field + "-" + deviceType))
    return columns
  }, [chooseColumnKey, deviceType])
  const { contentList } = useDeviceTag(currentInfo.current, currentState.current, filterChooseKeyColumns)
  const handleChange = (e) => {
    setCurrentDeviceCode(e.target.dataset?.dvscode)
    // 获取a节点和b节点
    const aNode = e.target

    // 获取a节点的位置信息
    const aRect = aNode.getBoundingClientRect()

    // 计算b节点相对于a节点的位置
    const bOffsetX = aRect.left - 100 // 水平方向上的偏移量
    const bOffsetY = aRect.top - 240 // 垂直方向上的偏移量

    // bNode.style.transform = "translate(" + bOffsetX + "px, " + bOffsetY + "px)";
    setOverlayStyle({
      top: bOffsetY / 16 + "rem",
      left: bOffsetX / 16 + "rem",
    })
  }
  useEffect(() => {
    if (!listBoxRef.current) return () => {}
    function mouseEnter(e) {
      if (e.target.classList?.contains("card-content")) {
        // 防抖
        debouncedFunction.current = debounce(() => {
          handleChange(e)
        }, 1000)
        debouncedFunction.current()
      }
    }
    function mouseOut(e) {
      if (e.target.classList?.contains("card-content")) {
        // 清除防抖
        debouncedFunction.current.cancel()
        setCurrentDeviceCode("")
      }
    }
    const dom = listBoxRef.current
    dom.addEventListener("mouseenter", mouseEnter, true)
    dom.addEventListener("mouseleave", mouseOut, true)
    return () => {
      dom.removeEventListener("mouseenter", mouseEnter, true)
      dom.removeEventListener("mouseleave", mouseOut, true)
    }
  }, [])

  useEffect(() => {
    if (!currentDeviceCode) {
      overlayRef.current ? (overlayRef.current.style.visibility = "hidden") : ""
      return
    }
    const res = list?.find((j) => j.deviceCode === currentDeviceCode) || null
    if (res) {
      currentState.current = res.runData
      currentInfo.current = res
    }
    overlayRef.current ? (overlayRef.current.style.visibility = "") : ""
  }, [currentDeviceCode, list])

  if (!list?.length) return <div style={{ width: "100%", textAlign: "center" }} children={<Empty />} />
  return (
    <div
      ref={listBoxRef}
      className={`device-matrix-by-list ${showMode === "box" ? "device-matrix-by-list--box" : "device-matrix-by-list--block"}`}
    >
      {list?.map(({ runData, ...deviceInfo }) => {
        return <DeviceComp key={deviceInfo.deviceCode} state={runData} info={deviceInfo} onClick={onCompClkRef} />
      })}
      <div ref={overlayRef} style={{ top: overlayStyle.top, left: overlayStyle.left }} className="site-pop-overlay">
        <div>{currentInfo.current?.deviceName}</div>
        <PopoverContent list={contentList} />
      </div>
    </div>
  )
}
