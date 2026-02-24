/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 14:51:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-16 16:28:14
 * @Description: 大屏公用头部
 */
import "./index.less"

import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

// import CustomModal from "@/components/custom-modal"
// import HeadClock from "@/components/layout-app/head-info/head-clock"

// import UpdateSetting, { IPerateMdlProps, IPerateRef } from "./update"

// const screenList = [
//   { label: "大屏1", key: "gdscreen" },
//   { label: "主页", key: "" },
// ]
export default function CommonScreenHeader(props) {
  const { screenList, defaultKey, title } = props
  const [showBtn, setShowBtn] = useState(false)
  const [activeKey, setActiveKey] = useState(defaultKey)
  const contextMenu = useRef(null)
  const [securityDay, setSecurityDay] = useState("0")
  const navigate = useNavigate()
  const changeShow = () => {
    // setShowBtn((prev) => !prev)
    navigate("/")
    contextMenu.current ? (contextMenu.current.style.display = "none") : ""
  }
  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
    navigate(`/${key}`)
  })
  const openContext = (e) => {
    e.preventDefault()
    contextMenu.current.style.display = "block"
  }
  const daysFromNow = (year, month, day) => {
    const now = new Date()
    const targetDate = new Date(year, month - 1, day)
    const timeDifference = (now as any) - (targetDate as any)
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference
  }
  useEffect(() => {
    const days = daysFromNow(2023, 1, 1)
    setSecurityDay(days.toString())
  }, [])
  return (
    <div className="comp-screen-header">
      <div onClick={changeShow} onContextMenu={openContext} className="title">
        {title}
      </div>
      <div className="header-time">{/* <HeadClock /> */}</div>
      {showBtn ? (
        <div className="screenList page-tabs-wrap">
          <Tabs
            type="editable-card"
            hideAdd
            tabBarGutter={4}
            items={screenList}
            activeKey={activeKey}
            onChange={onTabsChgRef.current}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
