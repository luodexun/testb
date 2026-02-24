/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 14:04:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-15 14:57:44
 * @Description: 告警弹框外部组件
 */

import "./alarm-info-detal.less"

import { CloseOutlined } from "@ant-design/icons"
import { Button, Space } from "antd"
import Draggable from "draggable"
import { useAtomValue } from "jotai"
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import AlarmConfirmModel, {
  IOperateProps as AIOperateProps,
  IPerateRef as AIPerateRef,
} from "@/components/alarm-confirm-model"
import CustomModal from "@/components/custom-modal"
import { StorageDeviceType, StorageIsAlarmGo } from "@/configs/storage-cfg"
import { day4Y2S } from "@/configs/time-constant"
// import { bacthPass } from "@/pages/alarm-history/methods"
import { SITE_AGVC, SITE_BOOST, SITE_MATRIX } from "@/router/variables"
import { alarmInfoAtom } from "@/store/atom-alarm"
import { AtomStation } from "@/store/atom-station"
import { IConfigTypeData } from "@/types/i-config.ts"
import { getStorage, setStorage, uDate } from "@/utils/util-funs"

import { IAlarmMessages } from "./types/alarm-ifty"
import { bacthPass } from "@/utils/device-funs"
import { bacthPass as customPass } from "@/pages/report-alarm/methods"
import { doBaseServer } from "@/api/serve-funs"

export interface IPerateRef {
  setConfirmMsg: (step: string) => void
}
export interface IOperateProps {
  dialogInfo: {
    realtime_alarm: boolean
    custom_alarm: boolean
  }
  data?: any
  customRealtimeData?: any
  isJump?: boolean

  buttonClick?: (type: "ok" | "close") => void
  loading?: boolean
  alarmList?: Array<any>
}
const showlabelList = [
  { label: "场站", key: "stationDesc" },
  { label: "设备类型", key: "deviceTypeName" },
  { label: "设备描述", key: "deviceDesc" },
  { label: "故障开始时间", key: "startTime" },
  { label: "故障描述", key: "alarmDesc" },
]
const customAlarmList = [
  { label: "场站", key: "stationName" },
  // { label: "设备类型", key: "deviceTypeName" },
  { label: "设备描述", key: "deviceName" },
  { label: "故障开始时间", key: "startTime" },
  { label: "故障描述", key: "alarmDesc" },
]
const tabs = [
  { label: "告警信息", value: "realtime_alarm" },
  { label: "自定义告警信息", value: "custom_alarm" },
]
const AlarmDetail = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { dialogInfo, buttonClick, isJump = false, customRealtimeData } = props
  const [confirmMsg, setConfirmMsg] = useState("")
  const modeRef = useRef(null)
  const alarmDetailRef = useRef(null)
  const [alarmModel, setAlarmModel] = useState(false)
  const [alarmOneInfo, setAlarmOneInfo] = useState<IAlarmMessages>()
  const [currentActive, setCurrentActive] = useState("realtime_alarm") // realtime_alarm实时告警，custom_alarm自定义告警

  const alarmInfo = useAtomValue(alarmInfoAtom)
  const { stationMap } = useAtomValue(AtomStation)
  const timeoutRef = useRef(null)

  const actualTab = useMemo(() => {
    if (!dialogInfo) return []
    return tabs.filter((i) => dialogInfo[i.value])
  }, [dialogInfo])
  useEffect(() => {
    if (dialogInfo.realtime_alarm && alarmInfo?.alarmMessages?.length) {
      const info = alarmInfo.alarmMessages[alarmInfo.alarmMessages.length - 1]
      setCurrentActive("realtime_alarm")
      setAlarmOneInfo({
        ...info,
        deviceTypeName:
          getStorage<IConfigTypeData[]>(StorageDeviceType)?.find((i) => i.code === info.deviceType)?.name ||
          info.deviceType,
      })
    }
  }, [alarmInfo])
  useEffect(() => {
    if (dialogInfo.custom_alarm && customRealtimeData) {
      setCurrentActive("custom_alarm")
    }
  }, [customRealtimeData])
  const actualShowInfo = useMemo(() => {
    return currentActive === "realtime_alarm" ? alarmOneInfo : customRealtimeData
  }, [currentActive, alarmOneInfo, customRealtimeData])
  const maintenanceComId = useMemo(() => {
    return stationMap[actualShowInfo?.stationCode]?.maintenanceComId || 1
  }, [stationMap, actualShowInfo])
  const actualAlarmList = useMemo(() => {
    return currentActive === "realtime_alarm" ? showlabelList : customAlarmList
  }, [currentActive, alarmOneInfo])
  const btnClkRef = useRef((type: "ok" | "close" | "previous" | "next") => {
    if (type === "ok") {
      setAlarmModel(true)
    }
    if (type === "close") {
      buttonClick?.(type)
      setAlarmModel(false)
    }
  })
  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      // 电气告警根据等级跳转升压站
      if (isJump && alarmOneInfo?.deviceType === "SYZZZ" && alarmOneInfo?.alarmLevelId === 11) {
        alarmDetailRef.current.style.top = "50%"
        alarmDetailRef.current.style.left = "50%"
        alarmDetailRef.current.style.transform = "translate(-50%, -50%)"
        toMonitorPage()
      }
      alarmDetailRef.current ? new Draggable(alarmDetailRef.current) : ""
    }, 100)
    return () => clearTimeout(timeoutRef.current)
  }, [alarmOneInfo])

  const confirmbtn = async (type: "ok" | "close", data: string) => {
    // 执行
    if (type === "ok") {
      const alarmInfo = [actualShowInfo]
      const fuc = currentActive === "realtime_alarm" ? bacthPass : customPass
      const res = await fuc(alarmInfo, data)
      if (!res) return
      setAlarmModel(false)
      buttonClick?.("close")
    }
    if (type === "close") {
      setAlarmModel(false)
    }
  }

  const navigate = useNavigate()
  const toAlarmPage = () => {
    if (currentActive === "realtime_alarm") {
      navigate("/alarm/realtime-two")
    } else {
      const { deviceId, stationId, deviceType } = customRealtimeData
      navigate(`/customize/alarm?deviceId=${deviceId}&stationId=${stationId}&deviceType=${deviceType}`)
    }
  }
  const toMonitorPage = async () => {
    let urlDetail = SITE_MATRIX
    if (
      actualShowInfo.deviceType === "WT" ||
      actualShowInfo.deviceType === "PVINV" ||
      actualShowInfo.deviceType === "ESPCS"
    ) {
      urlDetail = SITE_MATRIX
      setStorage(actualShowInfo.deviceId, StorageIsAlarmGo)
      navigate(`/site/${maintenanceComId}/${actualShowInfo.stationCode}/${urlDetail}`, {
        state: { deviceId: actualShowInfo.deviceId },
      })
      return
    } else if (actualShowInfo.deviceType === "AGVC") {
      urlDetail = SITE_AGVC
    } else if (actualShowInfo.deviceType === "SYZZZ") {
      urlDetail = SITE_BOOST
    }
    navigate(`/site/${maintenanceComId}/${actualShowInfo.stationCode}/${urlDetail}`)
  }

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    confirmMsg: confirmMsg,
    setConfirmMsg,
  }))
  return (
    <div ref={alarmDetailRef} className="alarm-new-detail">
      <div className="alarm-detail-title">
        <div className="two-alarm-title">
          {actualTab?.map((i) => {
            return (
              <span
                key={i.value}
                onClick={setCurrentActive.bind(null, i.value)}
                className={`title-span ${currentActive === i.value ? "active" : ""}`}
              >
                {i.label}
              </span>
            )
          })}
        </div>
        <CloseOutlined
          style={{ cursor: "pointer" }}
          // onClick={() => {
          //   buttonClick?.("close")
          // }}
          onClick={async () => {
            try {
              await doBaseServer("closeAlarm");
              buttonClick?.("close"); // 成功后再关闭弹窗
            } catch (err) {
              console.error("关闭告警请求失败:", err);
              buttonClick?.("close"); // 即使请求失败也关闭弹窗（可选）
            }
          }}
        />
      </div>
      <div className="alarm-detail-form">
        {actualAlarmList.map((i) => {
          return (
            <div key={i.key} className="gutter-row">
              <span>{i.label}：</span>
              <span>{i.key === "startTime" ? uDate(actualShowInfo?.[i.key], day4Y2S) : actualShowInfo?.[i.key]}</span>
            </div>
          )
        })}
      </div>
      <div className="alarm-detail--bottom">
        <Space>
          <Button onClick={btnClkRef.current.bind(null, "ok")}>确认</Button>
          <Button onClick={toAlarmPage}>查看详情</Button>
          <Button onClick={toMonitorPage}>设备监视</Button>
        </Space>
      </div>
      <CustomModal<AIOperateProps, AIPerateRef>
        ref={modeRef}
        width="30%"
        title="确认"
        destroyOnClose
        open={alarmModel}
        footer={null}
        onCancel={() => setAlarmModel(false)}
        Component={AlarmConfirmModel}
        componentProps={{ buttonClick: confirmbtn }}
      />
    </div>
  )
})

export default AlarmDetail
