/*
 * @Author: chenmeifeng
 * @Date: 2024-09-25 10:23:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-26 14:29:56
 * @Description: 河南大屏二
 */
import "./screen-two.less"

import { Suspense, lazy } from "react"
const HNHeader = lazy(() => import("./components/header/index"))
const HnStateView = lazy(() => import("./components/state-view"))
const Hn2Center = lazy(() => import("./components/center/screen-two-center"))
const HN2Right = lazy(() => import("./components/right/screen-two-right"))
export default function HN2screen() {
  return (
    <div className="hn2-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <HNHeader />
        <div className="screen-content">
          <div className="screen-left">
            <HnStateView />
          </div>
          <div className="screen-center">
            <Hn2Center />
          </div>
          <div className="screen-right">
            <HN2Right />
          </div>
        </div>
      </Suspense>
    </div>
  )
}
