/*
 * @Author: chenmeifeng
 * @Date: 2024-02-20 13:44:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-11 10:47:34
 * @Description:
 */
import "./index.less"

import { lazy, Suspense, useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"

// import CompanyDetail from "./components/company"
const GxScreenHeader = lazy(() => import("./components/header"))
const QuotaList = lazy(() => import("./components/quota"))
const SrceenLeft = lazy(() => import("./components/screen-left"))
const SiteMap = lazy(() => import("./components/siteMap"))
import { changeTestjson } from "./configs/configs"
export default function GuangxiScreen() {
  const [settingData, setSettingData] = useState(null)
  const screenRef = useRef(null)
  const initData = async () => {
    const res = await doBaseServer("queryMngStatic", { key: "guangXi" })
    setSettingData(JSON.parse(res.data))
    changeTestjson(JSON.parse(res.data))
  }
  const reflesh = useRef(() => {
    initData()
  })
  const setFontsize = () => {
    screenRef.current ? (screenRef.current.style.fontSize = (window.innerWidth / 6720) * 10 + "px") : ""
    // screenRef.current.style.width = window.innerWidth
  }
  useEffect(() => {
    screenRef.current ? (screenRef.current.style.fontSize = (window.innerWidth / 6720) * 10 + "px") : ""
    window.addEventListener("resize", setFontsize)
    initData()
    return () => {
      window.removeEventListener("resize", setFontsize)
    }
  }, [])
  return (
    <div className="wrap-page guangxi" ref={screenRef}>
      <Suspense fallback={<div>Loading...</div>}>
        <GxScreenHeader reflesh={reflesh.current} />
        <div className="screen-content">
          <div className="screen-content-left">
            <SrceenLeft info={settingData} />
          </div>
          <div className="screen-content-center">
            <SiteMap siteInfo={settingData?.siteInfo} />
          </div>
          <div className="screen-content-right">
            <QuotaList quotaList={settingData?.quotaList} />
          </div>
        </div>
      </Suspense>
    </div>
  )
}
