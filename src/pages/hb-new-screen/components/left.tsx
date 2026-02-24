/*
 * @Author: chenmeifeng
 * @Date: 2024-09-09 10:56:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-15 10:37:23
 * @Description: 湖北大屏1左侧
 */
import LargeScreenContext from "@/contexts/screen-context"
import "./left.less"
import { Suspense, lazy, useEffect, useState } from "react"
import { testScreenData } from "../configs/form-json"
import { getScreenStaticInfo } from "../methods"
const BrandRate = lazy(() => import("./brand/brand-rate"))
const DayLoad = lazy(() => import("./day-load/day-load"))
const Prediction = lazy(() => import("./prediction/prediction-elec"))
export default function Hb1SrcTtLeft() {
  const [settingData, setSettingData] = useState(testScreenData)
  const initData = async () => {
    // 获取接口临时数据
    const res = await getScreenStaticInfo()
    setSettingData(JSON.parse(res.data))
    // changejson(JSON.parse(res.data))
  }
  useEffect(() => {
    initData()
  }, [])
  return (
    <div className="l-full hb1-tl">
      <LargeScreenContext.Provider value={{ quotaInfo: settingData, setQuotaInfo: setSettingData }}>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <div className="hb1-tr-hd"></div> */}
          <div className="screen-lr-box">
            <DayLoad />
          </div>
          <div className="screen-lr-box">
            <Prediction />
          </div>
          <div className="screen-lr-box">
            <BrandRate />
          </div>
        </Suspense>
      </LargeScreenContext.Provider>
    </div>
  )
}
