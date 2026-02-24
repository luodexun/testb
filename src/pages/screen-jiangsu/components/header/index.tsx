/*
 * @Author: chenmeifeng
 * @Date: 2024-05-29 09:55:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-11 10:46:45
 * @Description: 大屏头部
 */
import "./index.less"

import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { day4YDot2S } from "@/configs/time-constant"
import { useRefresh } from "@/hooks/use-refresh"
import { uDate } from "@/utils/util-funs"

import { SCREEN_LISTS } from "../../configs"
export default function JSHeader() {
  const [showBtn, setShowBtn] = useState(false)
  const [activeKey, setActiveKey] = useState("jsscreen")
  // const [securityDay, setSecurityDay] = useState("0")
  const [reload, setReload] = useRefresh(1000)
  const [clock, setClock] = useState<string>(uDate("", day4YDot2S))
  const [securityDay, setSecurityDay] = useState("0")
  const navigate = useNavigate()
  const changeShow = () => {
    navigate("/")
    // setShowBtn((prev) => !prev)
  }
  const daysFromNow = (year, month, day) => {
    const now = new Date()
    const targetDate = new Date(year, month - 1, day)
    const timeDifference = (now as any) - (targetDate as any)
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference
  }
  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
    navigate(`/${key}`)
  })
  useEffect(() => {
    const days = daysFromNow(2023, 11, 10)
    setSecurityDay(days.toString())
  }, [])
  useEffect(() => {
    if (!reload) return
    setClock(uDate("", day4YDot2S))
    setReload(false)
  }, [reload, setReload])
  return (
    <div className="js-header">
      <div className="js-header-center">
        <div className="header-content">
          <span className="left">{clock.split(" ")[0]}</span>
          <span className="center" onClick={changeShow}>
            华东大区新能源集控中心
          </span>
          <span className="right">{clock.split(" ")[1]}</span>
        </div>
        <div className="header-security">
          <span>安全运行天数</span>
          <span className="day-white">{securityDay}</span>
          <span>天</span>
        </div>
      </div>
      {showBtn ? (
        <div className="screenList page-tabs-wrap">
          <Tabs
            type="editable-card"
            hideAdd
            tabBarGutter={4}
            items={SCREEN_LISTS}
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
