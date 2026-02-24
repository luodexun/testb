/*
 * @Author: xiongman
 * @Date: 2023-08-30 15:21:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-12 09:54:44
 * @Description: 场站设备矩阵卡片组件-卡片
 */

import "./device-card-base.less"

import { DVS_CARD_RUN_INFO_4TYPE } from "@configs/dvs-state-info.ts"
import { AtomStnSignRdMap, TStnSignRdMap } from "@store/atom-signal-record.ts"
import classnames from "classnames"
import { useAtomValue } from "jotai"
import { CSSProperties, useContext, useEffect, useMemo, useRef } from "react"

import DeviceSignal from "@/components/device-card/device-signal.tsx"
import MetricTag from "@/components/metric-tag"
import PanelTag from "@/components/metric-tag/panel-tag.tsx"
import SvgIcon from "@/components/svg-icons/svgIcon.tsx"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IDeviceData, IDeviceRunData4MQ } from "@/types/i-device.ts"

import CustomProgress from "../custom-progress"

interface IProps {
  mixedData: Partial<Partial<Omit<IDeviceData, "runData"> & IDeviceRunData4MQ>>
  tagStyle: CSSProperties
}
const PROGRESS_PROPS = {
  width: "8px",
  bordered: false,
  trailColor: "rgba(38,77,123,0.46)",
  strokeColor: ["#AD8E564D", "#45AF2C"],
}
const showProgress = process.env["VITE_SITE_RATE_SET"] === "show"
export default function DeviceCardBase(props: IProps) {
  const { mixedData, tagStyle } = props
  const signRdMapData: TStnSignRdMap = useAtomValue(AtomStnSignRdMap)
  const { drawerOpenMap, needShangdevice } = useContext(DvsDetailContext)
  const signalMdlOpenRef = useRef(drawerOpenMap["signalModal"])

  const deviceType = useMemo(() => mixedData?.deviceType || "WT", [mixedData])

  const dvsRunInfo = useMemo(() => DVS_CARD_RUN_INFO_4TYPE[deviceType], [deviceType])

  const benchmark = useMemo(() => {
    const benchmarkFlag = mixedData.deviceTags?.["benchmark_flag"]
    const flag = benchmarkFlag === "是" || benchmarkFlag == "1"
    return flag
  }, [mixedData])
  useEffect(() => {
    signalMdlOpenRef.current = drawerOpenMap["signalModal"]
  }, [drawerOpenMap])

  const signalRecord = useMemo(() => {
    if (!mixedData?.deviceId) return []
    return signRdMapData[mixedData.deviceId]?.filter((i) => i.signState) || []
  }, [mixedData?.deviceId, signRdMapData])

  const isFlicker = useMemo(() => {
    if (mixedData?.deviceId && needShangdevice?.includes(mixedData?.deviceId?.toString())) return true
    return false
  }, [needShangdevice, mixedData?.deviceId])

  return (
    <div className={classnames("device-card-base", `card-${deviceType}`)}>
      <div
        className="card-head"
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()
        }}
      >
        <div className="card-name">
          <span>{mixedData.deviceNumber}</span>
          {isFlicker ? <i className="shang"></i> : ""}
        </div>
        <MetricTag value={mixedData.periodName} />
        <MetricTag value={mixedData.lineName} />
        <DeviceSignal signalList={signalRecord} />
      </div>
      <div className="card-content" data-dvscode={mixedData.deviceCode}>
        <div className="card-content-top">
          <SvgIcon
            name={deviceType}
            className="device-icon"
            style={{ color: tagStyle.color }}
            state={mixedData.mainState}
            subState={mixedData.subState}
          />
          <div className="l-full run-info-box">
            {dvsRunInfo?.map(({ field, title, digits }) => (
              // <PanelTag key={field} value={`${mixedData?.[field] ?? "-"}`} title={title} unit={unit} unitInTitle />
              <PanelTag key={field} value={`${mixedData?.[field] ?? "-"}`} title={title} digits={digits} unit="" />
            ))}
          </div>
        </div>
        <div className="card-content-bottom">
          {benchmark ? <i className="benchmark"></i> : ""}
          <div
            style={{ color: tagStyle.color }}
            className="state-label"
            children={mixedData.mainStateLabel ? mixedData.mainStateLabel + "-" + (mixedData.subStateLabel || "") : "-"}
          />
          {/* mixedData.rate */}
          {mixedData?.rate && showProgress ? (
            <div className="card-bottom-pg">
              <CustomProgress {...PROGRESS_PROPS} percent={mixedData.rate ?? 0} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  )
}
