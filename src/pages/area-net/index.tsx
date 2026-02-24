/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-29 10:08:43
 * @Description: 区域中心-场站总览
 */

import "./index.less"

import { useRefresh } from "@hooks/use-refresh.ts"
import { TNetStateData } from "@pages/area-net/types"
import { AtomStation } from "@store/atom-station.ts"
import { useAtomValue } from "jotai"
import { useEffect, useRef, useState } from "react"

import { MS_SCEND_3 } from "@/configs/time-constant"

import { getNetSiteImg, getStaNetworkSt } from "./methods"

function scaleElement(dom: HTMLDivElement) {
  if (!dom) return
  const contentBoxDom = dom.firstElementChild as HTMLDivElement
  contentBoxDom.style.transform = `unset`
  contentBoxDom.style.width = contentBoxDom.style.height = `auto`
  window.setTimeout(() => {
    const { offsetWidth, offsetHeight } = dom
    const { scrollHeight, scrollWidth } = contentBoxDom
    const widthScale = Math.min(offsetWidth / scrollWidth, 1)
    const heightScale = Math.min(offsetHeight / scrollHeight, 1)
    contentBoxDom.style.transform = `scale(${widthScale}, ${heightScale})`
    contentBoxDom.style.width = `${Math.max(scrollWidth, offsetWidth)}px`
    contentBoxDom.style.height = `${Math.max(scrollHeight, offsetHeight)}px`
  }, 0)
}

export default function AreaNet(props) {
  const { isScreen = false } = props
  const [netData, setNetData] = useState<TNetStateData[][]>([])
  const container = useRef<HTMLDivElement>()
  const [reload, setReload] = useRefresh(MS_SCEND_3)
  const { stationMap } = useAtomValue(AtomStation)

  useEffect(() => {
    if (!container.current || isScreen) return
    scaleElement(container.current)
  }, [netData?.length])

  useEffect(() => {
    if (!reload || !stationMap) return
    getStaNetworkSt(stationMap)
      .then(setNetData)
      .then(() => setReload(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, stationMap])

  return (
    <div ref={container} data-list={netData.length} className="l-full area-net-wrap">
      <div className="content-box">
        <div className="center-box">
          <img src={getNetSiteImg("CENTER")} alt="区域中心" className="l-full" />
        </div>
        {netData.map((rowArr, index) => (
          <div key={`row_${index}`} className="row-box">
            {rowArr.map((item) => (
              <div key={item.stationCode} className="site-box">
                <div className="site-icon" style={{ color: item.color, backgroundImage: `url(${item.siteIcon})` }}>
                  <div className="site-state" style={{ color: item.color }} />
                </div>
                <div children={item.shortName} />
                {!isScreen ? <div children={item.ipPort} /> : ""}
                {!isScreen ? <div children={item.net} /> : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
