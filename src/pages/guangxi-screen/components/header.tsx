/*
 * @Author: chenmeifeng
 * @Date: 2024-02-21 16:37:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-25 13:46:59
 * @Description:
 */
import "./header.less"

import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import CustomModal from "@/components/custom-modal"

// import HeadClock from "@/components/layout-app/head-info/head-clock"
import { screenList } from "../configs/configs"
import UpdateSetting, { IPerateMdlProps, IPerateRef } from "./update"

export default function GxScreenHeader(props) {
  const { reflesh } = props
  const [showBtn, setShowBtn] = useState(false)
  const [activeKey, setActiveKey] = useState("gxscreen")
  const contextMenu = useRef(null)
  const modalRef = useRef()
  const [openModal, setOpenModal] = useState(false)
  const [, setSecurityDay] = useState("0")
  const navigate = useNavigate()
  const changeShow = () => {
    setShowBtn((prev) => !prev)
    contextMenu.current.style.display = "none"
  }
  const onTabsChgRef = (key: string) => {
    setActiveKey(key)
    navigate(`/${key}`)
  }
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
  const btnClk = useRef((type) => {
    if (type === "ok") {
      reflesh?.()
    }
  })
  useEffect(() => {
    const days = daysFromNow(1996, 11, 10)
    setSecurityDay(days.toString())
  }, [])
  useEffect(() => {
    contextMenu.current.style.display = "none"
  }, [openModal])
  return (
    <div className="screen-header">
      {/* <div className="header-day">
        <span>安全运行天数</span>
        {securityDay.split("").map((i, index) => {
          return (
            <div className="header-day-item" key={index}>
              {i}
            </div>
          )
        })}
      </div> */}
      <div onClick={changeShow} onContextMenu={openContext} className="title">
        华润电力广西公司
      </div>
      {/* <div className="header-time">
        <HeadClock />
      </div> */}
      <div ref={contextMenu} className="screen-contextmenu">
        <div onClick={() => setOpenModal(true)}>修改大屏各指标</div>
      </div>
      {showBtn ? (
        <div className="screenList page-tabs-wrap">
          <Tabs
            type="editable-card"
            hideAdd
            tabBarGutter={4}
            items={screenList}
            activeKey={activeKey}
            onChange={onTabsChgRef}
          />
        </div>
      ) : (
        ""
      )}
      <CustomModal<IPerateMdlProps, IPerateRef>
        ref={modalRef}
        width="90%"
        title="修改属性"
        destroyOnClose
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        Component={UpdateSetting}
        componentProps={{ setOpenModal, btnClk: btnClk.current }}
      />
    </div>
  )
}
