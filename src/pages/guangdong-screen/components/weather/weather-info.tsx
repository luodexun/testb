/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 10:46:05
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-27 14:33:46
 * @Description: 广东大屏-气象信息
 */
import "./weather-info.less"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import { useEffect, useRef, useState } from "react"
import Slider from "react-slick"

import WSiteBox from "@/components/screen-weather-site-box"
import { WEATHER_DEVICETYPE } from "@/pages/hb-new-screen/configs"
import { ISiteMonitorInfo } from "@/types/i-monitor-info"
import { validResErr } from "@/utils/util-funs"
import { getMonitorStnInfoData } from "@/utils/screen-funs"
import ComRadioClk from "../common-radio"
import HBCommonTitle from "../common-title"
import { useRefresh } from "@/hooks/use-refresh"
import { TDeviceType } from "@/types/i-config"
const settings = {
  dots: false,
  infinite: true,
  speed: 3000,
  // slidesToShow: 2,
  slidesToScroll: 1,
  vertical: true,
  verticalSwiping: true,
  cssEase: "linear",
  autoplay: true, // 添加这一行
  autoplaySpeed: 4000, // 设置自动播放速度，单位为毫秒
  slickPrev: "none",
}
export default function GDWeatherInfo() {
  const [currentIdx, setCurrentIdx] = useState<TDeviceType>("WT")
  const weatherRef = useRef(null)
  const count = useRef(1) // 3s
  const [reload, setReload] = useRefresh(3000) // 3s
  const stnSources = useRef([])
  const isFirstRe = useRef(true)
  const [stationInfoList, setStationInfoList] = useState<ISiteMonitorInfo[]>([])
  const [isShow, setIsShow] = useState(true)
  const [autoplay, setAutoplay] = useState(false)
  const [infinite, setInfinite] = useState(false)
  const [slidesToShow, setSlidesToShow] = useState(2)
  const getStationInfo = async () => {
    const res = await getMonitorStnInfoData({ deviceType: currentIdx })
    if (validResErr(res)) return
    const result =
      currentIdx === "WT"
        ? [
            { stationCode: "1", stationShortName: "1", windSpeed: count.current },
            { stationCode: "2", stationShortName: "2", windSpeed: count.current },
            { stationCode: "3", stationShortName: "3", windSpeed: count.current },
            { stationCode: "4", stationShortName: "4", windSpeed: count.current },
            { stationCode: "5", stationShortName: "5", windSpeed: count.current },
            { stationCode: "6", stationShortName: "6", windSpeed: count.current },
            { stationCode: "7", stationShortName: "7", windSpeed: count.current },
            { stationCode: "9", stationShortName: "8", windSpeed: count.current },
            { stationCode: "8", stationShortName: "9", windSpeed: count.current },
            { stationCode: "72", stationShortName: "34", windSpeed: count.current },
            { stationCode: "12", stationShortName: "6", windSpeed: count.current },
            { stationCode: "14", stationShortName: "7", windSpeed: count.current },
            { stationCode: "15", stationShortName: "8", windSpeed: count.current },
            { stationCode: "16", stationShortName: "9", windSpeed: count.current },
            { stationCode: "17", stationShortName: "34", windSpeed: count.current },
          ]
        : [
            { stationCode: "22", stationShortName: "34f" },
            { stationCode: "32", stationShortName: "dfgfg" },
            { stationCode: "31", stationShortName: "jkhjk" },
            // { stationCode: "35" },
            // { stationCode: "42", stationShortName: "24" },
            // { stationCode: "41", stationShortName: "56" },
            // { stationCode: "45" },
          ]
    setStationInfoList(res)
    console.log(res, "加快速度家乐福")
    const flag = res?.length > 2
    setInfinite(flag)
    setAutoplay(flag)
    setIsShow(true)
    setReload(false)
    isFirstRe.current = true
  }
  const changeType = (e) => {
    setCurrentIdx(e)
  }
  const init = async () => {
    // setIsShow(false)
    await getStationInfo()
    // setIsShow(true)
  }
  useEffect(() => {
    if (isFirstRe.current && reload) {
      isFirstRe.current = false
      count.current = count.current + 1
      init()
    }
  }, [currentIdx, reload])
  useEffect(() => {
    setStationInfoList([])
    setIsShow(false)
  }, [currentIdx])
  useEffect(() => {
    setTimeout(() => {
      setSlidesToShow(Math.round(weatherRef.current?.clientHeight / 110))
    }, 100)
  }, [])
  return (
    <div className="screen-box gd-scn-weather">
      <HBCommonTitle
        title="气象信息"
        children={
          <ComRadioClk
            options={WEATHER_DEVICETYPE}
            onChange={(e) => {
              changeType(e)
            }}
          />
        }
      />
      <div className="screen-box-content weather-chart" ref={weatherRef}>
        {isShow ? (
          <Slider {...settings} autoplay={autoplay} infinite={infinite} slidesToShow={slidesToShow}>
            {stationInfoList.map((i) => {
              return (
                <div key={i.stationCode} className="weather-site-box">
                  <WSiteBox siteInfo={i} key={i.stationCode} deviceType={currentIdx} />
                </div>
              )
            })}
          </Slider>
        ) : (
          ""
        )}
      </div>
    </div>
  )
}
