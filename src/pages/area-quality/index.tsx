/*
 * @Author: chenmeifeng
 * @Date: 2024-08-08 09:58:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-26 14:57:09
 * @Description: 数据质量评价
 */
import "./index.less"

import { Col, Row } from "antd"
import AreaActQuality from "./components/actual-quality"
import QualityTrend from "./components/quality-trend"
import SiteaDataQuality from "./components/site-data-quality"
import QualityAnalyse from "./components/quality-analyse"
import { useContext, useState, useRef } from "react"
import AreaQualityContext from "./configs/use-data-context"
import DvsQualityDrawer from "./components/drawer"
export default function AreaDataQuality() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [areaQualityCt, setAreaQualityCt] = useState({
    stationCode: "",
    stationId: null,
    openDraw: false,
  })
  return (
    <div className="area-quality l-full" ref={containerRef}>
      <AreaQualityContext.Provider value={{ areaQualityCt, setAreaQualityCt }}>
        <div className="area-quality-content l-full">
          <div className="area-quality-left">
            <SiteaDataQuality title="今日数据质量一览" />
          </div>
          <div className="area-quality-right">
            <AreaActQuality />
            <div className="aq-40">
              <QualityTrend title="近14日阶段数据质量趋势图" />
            </div>
            <div className="aq-40">
              <QualityAnalyse title="今日数据质量最低的N个设备" />
            </div>
          </div>
        </div>
        <DvsQualityDrawer containerDom={containerRef.current} />
      </AreaQualityContext.Provider>
    </div>
  )
}
