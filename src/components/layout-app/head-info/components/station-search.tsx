import "./station-search.less"

import { useEffect, useRef, useState } from "react"

import StationTreeSelect from "@/components/station-tree-select"

export default function SearchStation(props) {
  const { children, isShow, toStationPage, onClickbtn } = props
  const [showSearch, setShowSearch] = useState(isShow)
  useEffect(() => {
    setShowSearch(isShow)
  }, [isShow])
  const changeStation = useRef((stationCode, info) => {
    toStationPage(stationCode, info)
    onClickbtn()
    setShowSearch(false)
  })
  return (
    <div className="stn-search">
      {children}
      {showSearch ? (
        <div className="stn-box">
          <StationTreeSelect allowClear={false} onChange={changeStation.current} />
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
