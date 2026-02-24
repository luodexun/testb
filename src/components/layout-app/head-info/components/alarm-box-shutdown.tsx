/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 14:04:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 17:02:48
 * @Description: 告警弹框外部组件
 */

import "./alarm-box-shutdown.less"

import { CloseOutlined } from "@ant-design/icons"
import { useAtomValue } from "jotai"
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import Draggable from "react-draggable"

import { doBaseServer } from "@/api/serve-funs"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step"
import { IControlParamMap } from "@/components/device-control/types"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step"
import { IDvsStateData } from "@/types/i-device"

export interface IPerateRef {
  setConfirmMsg: (step: string) => void
}
export interface IOperateProps {
  realtimeData?: any
  buttonClick?: (type: "ok" | "close") => void
}
const AlarmShutdownDetail = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { realtimeData, buttonClick } = props
  const nodeRef = useRef(null)
  const [confirmMsg, setConfirmMsg] = useState("")

  // const [operateInfo, setOperateInfo] = useState<IDeviceData>(null)
  const controlParamMapRef = useRef<IControlParamMap>({})
  const [operateCellInfo, setOperateCellInfo] = useState<IControlParamMap["executeInfo"]>()
  const [openIpModal, setOpenIpModal] = useState(false)
  const modalRef = useRef<IOperateStepRef>()
  const [modalLoading, setLoading] = useState(false)
  useEffect(() => {
    // controlParamMapRef.current.executeInfo = {
    //   stationName: "内黄",
    //   deviceName: "F020",
    //   operateName: "停机",
    //   deviceIds: "2",
    //   pointName: "TurbineStop",
    //   controlType: "20",
    //   operatorBy: "",
    //   authorizerBy: "",
    //   targetValue: 1,
    //   interval: 0,
    // }
  }, [])

  const { stepBtnClkRef } = useDvsControlStep({
    controlParamMapRef,
    modalRef,
    setOpenModal: setOpenIpModal,
    setLoading,
  })

  const dealAlarm = async () => {
    const { stationName, deviceName, deviceId, deviceCode, deviceType } = realtimeData
    const resData = await doBaseServer<any, IDvsStateData>("getDeviceStateData", { deviceCode })
    const { MState } = resData || {}
    if (MState == 4 || MState == 5 || MState == 6) return
    const pointName =
      deviceType === "WT"
        ? "TurbineStop"
        : deviceType === "ESPCS"
          ? "pcsgstatecmd"
          : deviceType === "PVINV"
            ? "StartStop"
            : "TurbineStop"
    const data = {
      stationName,
      deviceName,
      operateName: "停机",
      deviceIds: deviceId?.toString(),
      pointName,
      controlType: "2",
      operatorBy: "",
      authorizerBy: "",
      targetValue: 1,
      interval: 0,
    }
    setOperateCellInfo(data)
    controlParamMapRef.current.executeInfo = data
    setOpenIpModal(true)
  }
  useEffect(() => {
    if (realtimeData?.actionFlag === 1) {
      dealAlarm()
    }
  }, [realtimeData])

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    confirmMsg: confirmMsg,
    setConfirmMsg,
  }))
  return (
    <Draggable nodeRef={nodeRef}>
      <div className="alarm-shutdown" ref={nodeRef}>
        {openIpModal ? (
          <div className="alarm-shutdown-content">
            <div className="alarm-shutdown-title">
              <span>停机控制</span>
              <CloseOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpenIpModal(false)
                }}
              />
            </div>
            <OperateStep ref={modalRef} data={operateCellInfo} buttonClick={stepBtnClkRef.current} />
          </div>
        ) : (
          ""
        )}
      </div>
    </Draggable>
  )
})

export default AlarmShutdownDetail
