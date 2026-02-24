/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 15:46:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-11 14:30:13
 * @Description: 河南头部
 */
import "./index.less"

import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SCREEN_LISTS } from "../../configs"
import { day4YDot2S } from "@/configs/time-constant"
import { uDate } from "@/utils/util-funs"
import { useRefresh } from "@/hooks/use-refresh"
export default function HNHeader() {
  const [showBtn, setShowBtn] = useState(false)
  const [activeKey, setActiveKey] = useState("jsscreen")
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
  const transNum = useRef((value) => {
    if (!value) return ["-"]
    const VirVal = value.toString()
    return VirVal.split("")
  })
  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
    navigate(`/${key}`)
  })
  useEffect(() => {
    // 安全运行天数开始日期
    const days = daysFromNow(2023, 11, 10)
    setSecurityDay(days.toString())
  }, [])
  useEffect(() => {
    if (!reload) return
    setClock(uDate("", day4YDot2S))
    setReload(false)
  }, [reload])
  return (
    <div className="hn-header">
      <div className="hn-header-center">
        <span className="left">{clock.split(" ")[0]}</span>
        <span className="center" onClick={changeShow}>
          中西新能源运行公司集中监控系统
        </span>
        <span className="right">{clock.split(" ")[1]}</span>
      </div>
      <div className="security-day">
        <span className="scrt-name">安全运行天数</span>
        <div className="scrt-val">
          {transNum.current(securityDay)?.map((i, idx) => {
            return (
              <span key={idx} className="scrt-vitem">
                {i}
              </span>
            )
          })}
        </div>
        <span className="scrt-name">天</span>
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
