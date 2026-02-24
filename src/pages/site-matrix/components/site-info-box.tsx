/*
 * @Author: xiongman
 * @Date: 2023-09-21 12:47:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-12 10:38:48
 * @Description: 区域信息展示组件
 */

import { BorderOutlined, DatabaseOutlined, TableOutlined } from "@ant-design/icons"
import { MONITOR_SITE_INFO_LIST } from "@configs/dvs-state-info.ts"
import { AtomStnMonitorDataMap } from "@store/atom-run-station.ts"
import { isEmpty } from "@utils/util-funs.tsx"
import { Button } from "antd"
import { useAtomValue } from "jotai"
import { useCallback, useContext, useMemo, useState } from "react"

import CommonTargetBox from "@/components/common-target-box"
import MetricTag from "@/components/metric-tag"
import ArrowButton from "@/components/radio-button/arrow-button.tsx"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { TDeviceType } from "@/types/i-config.ts"
import { ISiteMonitorInfo } from "@/types/i-monitor-info.ts"
import { IStationData } from "@/types/i-station.ts"
import { TModeShow } from "@/types/i-device"

interface IProps {
  typeList: TDeviceType[]
  station: IStationData
}
const MODEL_OPTION: Array<{ key: TModeShow; icon: string }> = [
  { key: "box", icon: "model-box" },
  { key: "table", icon: "model-table" },
  { key: "block", icon: "model-block" },
]
export default function SiteInfoBox(props: IProps) {
  const { typeList, station } = props
  const { setDrawerOpenMap, setShowMode, showMode } = useContext(DvsDetailContext)
  const [openModal, setOpenModal] = useState(false)
  const stnMonitorDataMap = useAtomValue(AtomStnMonitorDataMap)

  const baseData = useMemo(() => {
    if (!typeList?.length || !station?.stationCode || isEmpty(stnMonitorDataMap)) return {}
    let stnData: ISiteMonitorInfo
    return typeList.reduce((prev, dvsType) => {
      stnData = stnMonitorDataMap[dvsType]?.[station.stationCode]
      if (!stnData) return prev
      prev["activePower"] = (prev["activePower"] || 0) + (stnData["activePower"] || 0)
      prev["dailyProduction"] =
        (prev["dailyProduction"] || 0) + (stnData["dailyProduction"] || stnData["dailyDischarge"] || 0)
      return Object.assign({}, stnData, prev)
    }, {})
  }, [station?.stationCode, stnMonitorDataMap, typeList])

  const closeModal = useCallback((flag) => {
    setOpenModal(flag)
  }, [])
  return (
    <div className="site-info-box">
      {MONITOR_SITE_INFO_LIST.map(({ field, title, unit }) => {
        return (
          <MetricTag key={field} value={baseData[field] ?? "-"} title={title} unit={unit} className="site-info-tag" />
        )
      })}
      <div className="site-info-setting">
        <div className="site-info-ibox site-info-tag">
          {MODEL_OPTION?.map((i) => {
            return (
              <i
                key={i.key}
                onClick={() => setShowMode(i.key)}
                className={`ibox-icon ${i.icon} ${showMode === i.key ? "active-icon-" + i.key : ""}`}
              ></i>
            )
          })}
        </div>
        <Button
          onClick={() => {
            setOpenModal(!openModal)
          }}
        >
          指标设置
        </Button>
      </div>
      {openModal ? <CommonTargetBox closeModal={closeModal} /> : ""}
      {/* <ArrowButton title="全站运行状态" className="mr-1em" onClick={() => setDrawerOpenMap({ glbFilter: true })} /> */}
    </div>
  )
}
