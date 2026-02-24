/*
 * @Author: chenmeifeng
 * @Date: 2024-02-20 13:44:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-30 14:32:50
 * @Description:
 */
import "./index.less"

import { lazy, Suspense, useEffect, useRef, useState } from "react"

const BrandRate = lazy(() => import("./components/brand/brand-rate"))
const CenterContent = lazy(() => import("./components/center/center"))
const DayLoad = lazy(() => import("./components/day-load/day-load"))
const ElecOverview = lazy(() => import("./components/elec-overview/elec-overview"))
const HubeiScreenHeader = lazy(() => import("./components/header/header"))
const Prediction = lazy(() => import("./components/prediction/prediction-elec"))
const WeatherInfo = lazy(() => import("./components/weather/weather"))
const YearUseHour = lazy(() => import("./components/year-use-hour/year-use-hour"))
export default function HubeiScreen() {
  const screenRef = useRef(null)
  // useEffect(() => {
  //   screenRef.current.style.fontSize = (window.innerWidth / 4513) * 10 + "px"
  //   window.addEventListener("resize", () => {
  //     console.log(window.innerWidth, "window.innerWidth")
  //     screenRef.current.style.fontSize = (window.innerWidth / 4513) * 10 + "px"
  //     // screenRef.current.style.width = window.innerWidth
  //   })
  // }, [])
  return (
    <div className="hbscreen-new" ref={screenRef}>
      <Suspense fallback={<div>Loading...</div>}>
        <HubeiScreenHeader />
        <div className="screen-content">
          <div className="screen-left">
            <div className="screen-lr-box">
              <DayLoad />
            </div>
            <div className="screen-lr-box">
              <Prediction />
            </div>
            <div className="screen-lr-box">
              <BrandRate />
            </div>
          </div>
          <div className="screen-center">
            <CenterContent />
          </div>
          <div className="screen-right">
            <div className="screen-lr-20">
              <ElecOverview />
            </div>
            <div className="screen-lr-30">
              <YearUseHour />
            </div>
            <div className="screen-lr-50">
              <WeatherInfo />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
