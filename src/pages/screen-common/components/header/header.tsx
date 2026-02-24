/*
 * @Author: chenmeifeng
 * @Date: 2024-05-29 09:55:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-26 14:55:11
 * @Description: 大屏头部
 */
import "./header.less"

import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { day4YDot2S } from "@/configs/time-constant"
import { useRefresh } from "@/hooks/use-refresh"
import { uDate } from "@/utils/util-funs"

export default function HBHeader(props) {
  const { openUpdateForm } = props
  const [showBtn, setShowBtn] = useState(false)
  const [activeKey, setActiveKey] = useState("hbscreen")
  // const [securityDay, setSecurityDay] = useState("0")
  const [reload, setReload] = useRefresh(1000)
  const [clock, setClock] = useState<string>(uDate("", day4YDot2S))
  const contextMenu = useRef(null)
  const navigate = useNavigate()
  const changeShow = () => {
    // setShowBtn((prev) => !prev)
    navigate("/")
  }
  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
    navigate(`/${key}`)
  })
  const openContext = (e) => {
    e.preventDefault()
    contextMenu.current.style.display = "block"
  }
  const closeMenu = useRef((flag) => {
    contextMenu.current.style.display = "none"
    if (flag) openUpdateForm(true)
  })
  useEffect(() => {
    if (!reload) return
    setClock(uDate("", day4YDot2S))
    setReload(false)
  }, [reload, setReload])
  return (
    <div className="nhb-header">
      <div className="nhb-header-center" onClick={() => closeMenu.current(false)}>
        <div className="header-content">
          <span className="left">{clock.split(" ")[0]}</span>
          <span className="center" onClick={changeShow}>
            华润电力新能源集中监控系统
          </span>
          <span className="right">{clock.split(" ")[1]}</span>
        </div>
      </div>
      {/* <div ref={contextMenu} className="screen-contextmenu">
        <div onClick={() => closeMenu.current(true)}>修改大屏各指标</div>
      </div> */}
    </div>
  )
}
