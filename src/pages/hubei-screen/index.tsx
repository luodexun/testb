/*
 * @Author: chenmeifeng
 * @Date: 2024-02-20 13:44:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-15 11:00:29
 * @Description:
 */
import "./index.less"

import { lazy, Suspense, useEffect, useRef, useState } from "react"

const BrandRate = lazy(() => import("./components/brand-rate"))
const CenterContent = lazy(() => import("./components/center"))
const DayLoad = lazy(() => import("./components/day-load"))
const ElecOverview = lazy(() => import("./components/elec-overview"))
const HubeiScreenHeader = lazy(() => import("./components/header"))
const Prediction = lazy(() => import("./components/prediction-ele"))
const WeatherInfo = lazy(() => import("./components/weather-info"))
const YearUseHour = lazy(() => import("./components/year-use-hour"))
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
    <div className="hubei-page hbscreen-one" ref={screenRef}>
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
            <div className="screen-lr-box">
              <ElecOverview />
            </div>
            <div className="screen-lr-box">
              <YearUseHour />
            </div>
            <div className="screen-lr-box">
              <WeatherInfo />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  )
}
