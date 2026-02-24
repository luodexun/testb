/*
 * @Author: chenmeifeng
 * @Date: 2023-11-07 17:38:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-11 10:24:16
 * @Description:
 */

import "./index.less"

import { getDvsMeasurePointsData } from "@utils/device-funs.ts"
import { Select } from "antd"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"

import swo1 from "@/assets/weather/sw01.png"
import NamePanel from "@/pages/area-matrix/components/name-panel"
import { AtomStation } from "@/store/atom-station"
import { getParamDataFromUrl } from "@/utils/menu-funs"

import WtStationLs from "./components/station-list"
import { getSWDeviceList } from "./methods"
import { TPiontData } from "./types"

export default function SiteWtStation() {
  const [siteWeaList, setSiteWeaList] = useState<TPiontData[]>()
  const [swDeviceList, setSwDeviceList] = useState([])

  const { stationMap } = useAtomValue(AtomStation)

  const { pathname } = useLocation()

  const stationInfo = useMemo(() => {
    const stationCode = getParamDataFromUrl(pathname)
    return stationMap[stationCode]
  }, [pathname, stationMap])
  // const isRefresh = useRef(false)
  const [deviceCode, setDeviceCode] = useState("")

  const dvsInfo = useMemo(() => {
    return swDeviceList.find((i) => i.deviceCode === deviceCode)
  }, [deviceCode, swDeviceList])
  const initData = async () => {
    const res = await getSWDeviceList(stationInfo.stationCode)
    setSwDeviceList(res)
    if (!res?.[0]?.modelId) {
      setSiteWeaList([])
      setDeviceCode("")
      return
    }
    const getPiontData = await getDvsMeasurePointsData({ modelId: res?.[0]?.modelId || null })
    setSiteWeaList([
      ...getPiontData.map((i) => {
        return {
          ...i,
          icon: swo1,
          key: i.pointName,
          name: i.pointDesc,
          itemValue: null,
        }
      }),
    ])

    setDeviceCode(res?.[0]?.deviceCode || "")
  }
  useEffect(() => {
    initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationInfo])
  const handleChange = (e) => {
    setDeviceCode(e)
  }
  return (
    <div className="page-wrap sweather">
      <NamePanel name={stationInfo?.fullName} option={stationInfo} className="site-name" />
      <div className="sweather-header">
        <Select
          value={swDeviceList?.[0]?.deviceCode || ""}
          style={{ width: 120 }}
          fieldNames={{ label: "deviceName", value: "deviceCode" }}
          onChange={handleChange}
          options={swDeviceList}
        />
      </div>
      <div className="sweather-content">
        <WtStationLs dvsInfo={dvsInfo} siteWeaList={siteWeaList} deviceCode={deviceCode} />
        {/* <div className="sweather-icon"></div> */}
      </div>
    </div>
  )
}
