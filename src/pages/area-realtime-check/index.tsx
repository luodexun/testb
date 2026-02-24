/*
 * @Author: chenmeifeng
 * @Date: 2025-05-26 10:07:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-30 14:46:18
 * @Description: 实时巡视
 */
import "./index.less"

import { Button } from "antd"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"

import CustomModal from "@/components/custom-modal"
import useInterval from "@/hooks/useInterval.ts"
import { getsiteUrl } from "@/router/menu-site"
import { AtomStation } from "@/store/atom-station"

import RealtimePoint from "./components/point.tsx"
import DvsPointsCheck from "./components/setting-point.tsx"
import { getStnDvsPointData } from "./methods/setting.tsx"

export default function AreaRltmCheck() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modeRef = useRef(null)
  const [reload, setReload] = useInterval(3000)

  const { stationList } = useAtomValue(AtomStation)
  const [stationPointsData, setStationPointsData] = useState([])
  const actualUnEmpPointsStation = useMemo(() => {
    if (!stationList?.length || !stationPointsData) return []
    const stationCodes = stationPointsData.map((i) => i.stationCode)

    return stationList?.filter((i) => stationCodes.includes(i.stationCode))
  }, [stationList, stationPointsData])
  const btnClkRef = (type) => {
    setIsModalOpen(false)
    if (type === "ok") {
      getPointData()
    }
  }
  const getPointData = async () => {
    const res = await getStnDvsPointData()
    if (!res) return
    setReload(false)
    setStationPointsData(res)
  }
  useEffect(() => {
    if (!reload) return
    getPointData()
  }, [reload])
  return (
    <div className="area-jsrltm">
      <Button onClick={setIsModalOpen.bind(null, true)}>配置点位</Button>
      {actualUnEmpPointsStation.map((station) => {
        const device = stationPointsData?.find((i) => i.stationCode === station.stationCode)
        return (
          <div key={station.id} className="station-list-item">
            <Link
              className="wrap-link"
              to={`/site/${station?.maintenanceComId}/${station?.stationCode}/${getsiteUrl(station?.stationType)}`}
            >
              <div className="station-item-left">{station.shortName}</div>
            </Link>
            <div className="station-item-right">
              {/* {device?.device?.map((dvs) => {
                return (
                  <div key={dvs.deviceCode} className="dvs-list">
                    {dvs.point?.map((point) => {
                      const value = dvs.data?.[point.pointName]
                      const className = typeof value === "undefined" ? "no" : value ? "red" : "blue"
                      return point?.pointType === "2" ? (
                        <div key={point.pointName} className="point-item">
                          <YCBox name={point.pointDesc} value={value} unit={point.unit} />
                        </div>
                      ) : (
                        <div key={point.pointName} className="point-item">
                          <YXBox value={value} name={point.pointDesc} className={className} color={point.color} />
                        </div>
                      )
                    })}
                  </div>
                )
              })} */}
              <RealtimePoint device={device.device} />
            </div>
          </div>
        )
      })}
      <CustomModal
        ref={modeRef}
        width="70%"
        title="配置点位"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={DvsPointsCheck}
        componentProps={{ buttonClick: btnClkRef }}
      />
    </div>
  )
}
