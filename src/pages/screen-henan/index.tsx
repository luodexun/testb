/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 15:46:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-18 11:38:42
 * @Description: 河南大屏
 */
import "./index.less"
import { Suspense, lazy } from "react"
const HNHeader = lazy(() => import("./components/header/index"))
const HNCenter = lazy(() => import("./components/center/index"))
const HNRight = lazy(() => import("./components/right/index"))
const HNLeft = lazy(() => import("./components/left/index"))
export default function HNscreen() {
  return (
    <div className="hn-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <HNHeader />
        <div className="screen-content">
          <div className="screen-left">
            <HNLeft />
          </div>
          <div className="screen-center">
            <HNCenter />
          </div>
          <div className="screen-right">
            <HNRight />
          </div>
        </div>
      </Suspense>
    </div>
  )
}
