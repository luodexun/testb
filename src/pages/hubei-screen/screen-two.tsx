/*
 * @Author: chenmeifeng
 * @Date: 2024-04-09 13:53:38
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-05 10:24:02
 * @Description:
 */
import "./screen-two.less"

import { lazy, Suspense, useEffect, useRef } from "react"
const HbSrnCenter = lazy(() => import("./components/center/index"))
const HbSrnRight = lazy(() => import("./components/right/index"))
const HubeiScreenHeader = lazy(() => import("./components/header"))
const HbStateView = lazy(() => import("./components/state-view"))
export default function HbScreenTwo() {
  const screenRef = useRef(null)
  const getFontSize = () => {
    const width = 4480 || window.innerWidth
    screenRef.current.style.fontSize = (width / 4480) * 10 + "px"
  }
  useEffect(() => {
    getFontSize()
    window.addEventListener("resize", getFontSize)
    return () => window.removeEventListener("resize", getFontSize)
  }, [])
  return (
    <div className="hubei-page hbscreen-two" ref={screenRef}>
      <Suspense fallback={<div>Loading...</div>}>
        <HubeiScreenHeader />
        <div className="hbscreen-two-content">
          <div className="hbs-content-left">
            <HbStateView />
          </div>
          <div className="hbs-content-center">
            <HbSrnCenter />
          </div>
          <div className="hbs-content-right">
            <HbSrnRight />
          </div>
        </div>
      </Suspense>
    </div>
  )
}
