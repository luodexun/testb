/*
 * @Author: xiongman
 * @Date: 2023-08-31 14:57:50
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-10 14:44:00
 * @Description: 设备标签矩阵-设备类型及运行信息展示
 */

import "./device-type-info-panel.less"

import { MONITOR_SITE_INFO_MAP } from "@configs/dvs-state-info.ts"
import NamePanel from "@pages/area-matrix/components/name-panel.tsx"
import { AtomStnMonitorDataMap } from "@store/atom-run-station.ts"
import { isEmpty } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"
import { useContext, useEffect, useMemo, useRef, useState } from "react"

import TrendLine, { IOperateProps, IPerateRef } from "@/components/common-target-box/trend-line"
import CustomModal from "@/components/custom-modal"
import MetricTag from "@/components/metric-tag"
import DvsDetailContext from "@/contexts/dvs-detail-context"
import { IDeviceData } from "@/types/i-device.ts"
import { IStationData } from "@/types/i-station.ts"

export type TDvsTypeInfo = Pick<IDeviceData, "deviceCode" | "deviceName" | "deviceType" | "deviceTypeLabel">
interface IProps {
  typeInfo: TDvsTypeInfo
  station: IStationData
}
export default function DvsTypeInfoPanel(props: IProps) {
  const { station, typeInfo } = props
  const [stnMtrData, setStnMtrData] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const [ponit, setPoint] = useState("")
  const modalRef = useRef(null)

  // 在父级组件 device-matrix 中，调用 useMonitorStationData 执行获取并赋值
  const stnMonitorDataMap = useAtomValue(AtomStnMonitorDataMap)
  const { siteChooseColumnKey } = useContext(DvsDetailContext)

  const infoList = useMemo(() => {
    if (!typeInfo?.deviceType) return []
    const checks = siteChooseColumnKey?.[typeInfo.deviceType]?.map((i) => i.split("-")?.[0]) || []
    return MONITOR_SITE_INFO_MAP[typeInfo.deviceType]?.filter((i) => checks.includes(i.field)) || []
  }, [typeInfo?.deviceType, siteChooseColumnKey])

  const openDialog = (info) => {
    if (info?.trendNoShow) return
    setOpenModal(true)
    setPoint(info.field)
  }

  useEffect(() => {
    if (!station?.stationCode) return
    const theStnData = stnMonitorDataMap[typeInfo?.deviceType]?.[station?.stationCode]
    if (isEmpty(theStnData)) return

    setStnMtrData(theStnData)
  }, [station?.stationCode, stnMonitorDataMap, typeInfo?.deviceType])

  return (
    <div className="device-type-info-panel">
      <NamePanel name={typeInfo?.deviceTypeLabel} />
      <div className="device-type-info-box">
        {infoList.map(({ title, unit, field, trendNoShow }) => (
          <MetricTag
            key={field}
            title={title}
            unit={unit}
            value={`${stnMtrData?.[field] ?? "-"}`}
            onClickValue={() => openDialog({ title, field, unit, trendNoShow })}
          />
        ))}
      </div>
      <CustomModal<IPerateRef, IOperateProps>
        ref={modalRef}
        width="70%"
        title="历史曲线"
        destroyOnClose
        open={openModal}
        footer={null}
        onCancel={() => setOpenModal(false)}
        Component={TrendLine}
        componentProps={{ deviceType: typeInfo?.deviceType, stationCode: station?.stationCode, point: ponit }}
      />
    </div>
  )
}
