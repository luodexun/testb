/*
 * @Author: chenmeifeng
 * @Date: 2024-05-30 14:15:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-27 09:44:01
 * @Description:
 */
import "./weather.less"

import { useContext, useEffect, useMemo, useRef, useState } from "react"
import Slider from "react-slick"

import { AtomStnMonitorDataMap } from "@/store/atom-run-station"
import { TDeviceType } from "@/types/i-config"
import { ISiteMonitorInfo } from "@/types/i-monitor-info"
import { validResErr } from "@/utils/util-funs"

import { WEATHER_DEVICETYPE } from "../../configs"
import HBCommonTitle from "../common-box-header/box-header"
import ComRadioClk from "../common-radio"
import WeatherBox from "./weather-box"
import { getMonitorStnInfoData } from "@/utils/screen-funs"
import HB1CommonBox from "../common-box"
import { useRefresh } from "@/hooks/use-refresh"
import LargeScreenContext from "@/contexts/screen-context"
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
export default function Weather() {
  const [currentIdx, setCurrentIdx] = useState<TDeviceType>("WT")
  const content = useRef(null)
  const [animate, setAnimate] = useState(false)
  const [count, setCount] = useState(null)
  const [changeTab, setChangeTab] = useState(0)
  const isFirstRe = useRef(true)

  const isLoadFirst = useRef(false) // 第一次请求完接口后
  const [reload, setReload] = useRefresh(3000)
  const dataTimer = useRef(null) // 接口定时器
  const animateTimer = useRef(null) // 动画定时器1
  const animateTimer2 = useRef(null) // 动画定时器2
  const stnSources = useRef([])
  const [stationInfoList, setStationInfoList] = useState<ISiteMonitorInfo[]>([])

  const { quotaInfo } = useContext(LargeScreenContext)

  const changeType = (e) => {
    setCurrentIdx(e)
  }
  const startAnimate = () => {
    clearTimeout(animateTimer.current)
    clearTimeout(animateTimer2.current)
    animateTimer.current = setTimeout(() => {
      setAnimate(true)
    }, 2000)
    // console.log(stationInfoList, "stationInfoList1111")
    animateTimer2.current = setTimeout(() => {
      setAnimate(false)
      let result = [...stationInfoList]
      const ls = result.splice(0, 2)
      result = result.concat([...ls])
      setStationInfoList([...result])
      setTimeout(() => {
        setCount((prev) => {
          return prev + 1
        })
      }, 300)
    }, 5000)
  }
  const getStationInfo = async () => {
    let res
    if (quotaInfo?.weatherData && !quotaInfo?.weatherData?.useInterfaceData) {
      res = quotaInfo?.weatherData.data?.[currentIdx]
      console.log(quotaInfo?.weatherData.data, "quotaInfo?.weatherData.data")
    } else {
      res = await getMonitorStnInfoData({ deviceType: currentIdx })
      if (validResErr(res)) return
    }
    const result =
      currentIdx === "WT"
        ? [
            { stationCode: "1", stationShortName: "1" },
            { stationCode: "2", stationShortName: "2" },
            { stationCode: "3", stationShortName: "3" },
            { stationCode: "4", stationShortName: "4" },
            { stationCode: "5", stationShortName: "5" },
            { stationCode: "6", stationShortName: "6" },
            { stationCode: "7", stationShortName: "7" },
            { stationCode: "9", stationShortName: "8" },
            { stationCode: "8", stationShortName: "9" },
            { stationCode: "72" },
          ]
        : [
            { stationCode: "22", stationShortName: "34f" },
            { stationCode: "32", stationShortName: "dfgfg" },
            // { stationCode: "31", stationShortName: "jkhjk" },
            // { stationCode: "35" },
            // { stationCode: "42", stationShortName: "24" },
            // { stationCode: "41", stationShortName: "56" },
            // { stationCode: "45" },
          ]
    if (!stnSources.current?.length) {
      setStationInfoList(res)
    } else {
      setStationInfoList((prev) => {
        prev.forEach((i, idx) => {
          const info = res?.find((j) => j.stationCode === i.stationCode)
          prev[idx] = {
            ...info,
          }
        })
        return [...prev]
      })
    }
    stnSources.current = res
    setReload(false)
    isLoadFirst.current = true
    isFirstRe.current = true
  }

  const init = async () => {
    clearInterval(dataTimer.current)
    clearTimeout(animateTimer.current)
    clearTimeout(animateTimer2.current)
    setStationInfoList([])
    stnSources.current = []
    await getStationInfo()
    setTimeout(() => {
      setChangeTab((prev) => prev + 1)
      setAnimate(false)
      setCount(0)
    }, 300)
  }

  useEffect(() => {
    if (!reload || !isLoadFirst.current) return
    getStationInfo()
  }, [reload, currentIdx, quotaInfo])
  useEffect(() => {
    if (isLoadFirst.current && stnSources.current?.length / 2 > 3) {
      startAnimate()
    }
  }, [count, changeTab])
  useEffect(() => {
    if (isFirstRe.current) {
      isFirstRe.current = false
      // eslint-disable-next-line no-inner-declarations
      init()
    }
    return () => {
      clearInterval(dataTimer.current)
    }
  }, [currentIdx])
  return (
    <HB1CommonBox
      headerName="气象信息"
      headerType="weather"
      className="nhb-weather"
      titleBox={
        <ComRadioClk
          options={WEATHER_DEVICETYPE}
          onChange={(e) => {
            changeType(e)
          }}
        />
      }
    >
      <div className="nhb-weather-box">
        <div ref={content} className={`weather-content ${animate ? "animate" : ""}`}>
          {stationInfoList?.map((item) => {
            return (
              <div key={item?.stationCode} className="weather-content-item">
                <WeatherBox key={item?.stationCode} info={item} deviceType={currentIdx} />
              </div>
            )
          })}
        </div>
      </div>
    </HB1CommonBox>
  )
}
