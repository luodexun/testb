/*
 * @Author: chenmeifeng
 * @Date: 2024-09-14 10:39:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-14 10:42:24
 * @Description: 大屏2分屏-中间
 */
import { Suspense, lazy, useRef, useState } from "react"
import "./screen-left.less"
import { Tabs } from "antd"
import { useNavigate } from "react-router-dom"
const HbSrnCenter = lazy(() => import("./components/center/index"))
const screenList = [{ label: "主页", key: "" }]
export default function HbSrcTtCenter() {
  const [showBtn, setShowBtn] = useState(false)
  const [activeKey, setActiveKey] = useState("hbscreen2")

  const navigate = useNavigate()
  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
    navigate(`/${key}`)
  })
  const changeShow = useRef((e) => {
    setShowBtn((prev) => !prev)
  })
  return (
    <div className="hb2-tc">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hb2-tc-hd">
          <span className="hd-span" onClick={changeShow.current}>
            华中大区新能源集中监控系统
          </span>
        </div>
        <div className="hb2-tc-ct">
          <HbSrnCenter />
        </div>
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
      </Suspense>
    </div>
  )
}
