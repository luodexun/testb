/*
 * @Author: xiongman
 * @Date: 2023-12-08 14:57:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 10:26:00
 * @Description:
 */

import "./name-panel.less"

import { useAtomValue } from "jotai"
import { memo, ReactNode, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import StationTreeSelect from "@/components/station-tree-select"
import { getSiteOfMenu } from "@/router/menu-site"
import { AtomStation } from "@/store/atom-station"
import { IStationData } from "@/types/i-station"
import { getParamDataFromUrl } from "@/utils/menu-funs"

const NamePanel = memo((props: { name: ReactNode; className?: string; option?: IStationData; changeSearch?: any }) => {
  const { name, className, option, changeSearch } = props
  const { pathname } = useLocation()
  const { stationOfRegionOptions } = useAtomValue(AtomStation)
  const navigate = useNavigate()
  const getUrl = (type, stationId) => {
    return getSiteOfMenu(type, stationId).map((i) => i.key)
  }
  const urlType = useMemo(() => {
    return getParamDataFromUrl(pathname, 4)
  }, [pathname])
  const stationOptions = useMemo(() => {
    if (!option) return []
    return stationOfRegionOptions.map((i) => {
      return {
        ...i,
        children: i.children?.filter((j) => getUrl(j.type, j.stationId).includes(urlType)),
      }
    })
  }, [stationOfRegionOptions, option, urlType])
  const changeSelect = (e, info) => {
    if (!info) return
    navigate(`/site/${info.maintenanceComId}/${e}/${urlType}`)
    changeSearch(e, info)
  }

  return (
    <div className={className || "device-type-name"}>
      场站选择：
      {option ? (
        <StationTreeSelect options={stationOptions} value={option.stationCode} onChange={changeSelect} />
      ) : (
        <span>{name}</span>
      )}
    </div>
  )
})
export default NamePanel
