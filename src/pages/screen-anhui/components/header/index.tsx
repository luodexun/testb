import "./index.less"

import { Tabs } from "antd"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SCREEN_LISTS } from "../../configs"
import { useRefresh } from "@/hooks/use-refresh"
import { uDate } from "@/utils/util-funs"
import { day4YDot2S } from "@/configs/time-constant"
export default function JSHeader() {
  const [showBtn, setShowBtn] = useState(false)
  const [activeKey, setActiveKey] = useState("jsscreen")
  const [reload, setReload] = useRefresh(1000)
  // const [securityDay, setSecurityDay] = useState("0")
  const [clock, setClock] = useState<string>(uDate("", day4YDot2S))
  const navigate = useNavigate()
  const changeShow = () => {
    navigate("/")
    // setShowBtn((prev) => !prev)
  }

  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
    navigate(`/${key}`)
  })
  useEffect(() => {
    if (!reload) return
    setClock(uDate("", day4YDot2S))
    setReload(false)
  }, [reload])
  return (
    <div className="ah-header">
      <div className="ah-header-center">
        {/* <span className="left">{clock.split(" ")[0]}</span> */}
        <span className="center" onClick={changeShow}>
          安徽新能源公司集控系统总览
        </span>
        <p className="time">{clock}</p>
        {/* <span className="left">{clock.split(" ")[1]}</span> */}
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
