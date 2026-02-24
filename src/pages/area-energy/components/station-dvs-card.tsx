/*
 * @Author: chenmeifeng
 * @Date: 2024-01-31 18:18:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-11 14:46:22
 * @Description: 场站卡片
 */

import { Input, Radio, RadioChangeEvent } from "antd"
import type { SearchProps } from "antd/es/input/Search"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step.tsx"
import { useEffect, useRef, useState } from "react"

import { IStationData } from "@/types/i-station"
import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import { IControlActExecuteParams, IControlParamMap, IDualPsdSafeLoginForm } from "@/components/device-control/types"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step"
import { queryDevicesByParams } from "@/utils/device-funs"
import { IDeviceData } from "@/types/i-device"
import { STEP_KEY } from "@/components/device-control/configs"
import { doBaseServer } from "@/api/serve-funs"
import { judgeNull, validOperate } from "@/utils/util-funs"
import { AGVC_CONTROL } from "../configs"
const { AUTH_VERIFY } = STEP_KEY
const CONTROL_LS = {
  EMSInput: "投入状态",
  EMSRemoteOperatrion: "集控模式",
  EMSLocalOperatrion: "本地模式",
}
const CONTROL_VAL = {
  ActivePowerSet: "设定有功(MW)",
  ReactivePowerSet: "设定无功(MVar)",
}
interface IProps {
  deviceData: IDeviceData
  tabKey: string
  deviceRealTimeData?: any
}
export default function StationCard(props: IProps) {
  const { deviceData, tabKey, deviceRealTimeData } = props
  const modalRef = useRef<ICustomModalRef<IOperateStepRef>>()
  const controlLs = useRef(AGVC_CONTROL)
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [operateInfo, setOperateInfo] = useState<IControlParamMap["executeInfo"]>()
  const controlParamMapRef = useRef<IControlParamMap>({})
  const operateInfoTwo = useRef(null)
  const [inputValue, setInputValue] = useState({
    ActivePowerSet: null,
    ReactivePowerSet: null,
  })

  const onSearch: SearchProps["onSearch"] = (value) => {
    console.log(value, "sfsdf")
    let pointName = "ActivePowerSet"
    let pointDesc = "能管有功指令设定"
    let pointNameTwo = "ActivePowerSet"
    let pointDescTwo = "能管有功指令设定"
    let controlTypeTwo = "27"
    if (value === "ReactivePowerSet") {
      pointName = "ReactivePowerSet"
      pointDesc = "能管无功指令设定"
      pointNameTwo = "ReactivePowerSet"
      pointDescTwo = "能管无功指令设定"
      controlTypeTwo = "28"
    }
    controlParamMapRef.current.executeInfo = {
      deviceIds: deviceData.deviceId.toString(),
      deviceName: deviceData.deviceName,
      pointName,
      pointDesc,
      controlType: value === "ActivePowerSet" ? "33" : "34",
      targetValue: inputValue[value],
      interval: 0,
      operateName: inputValue[value] || "0",
      operatorBy: "",
      authorizerBy: "",
    }
    console.log(controlParamMapRef.current.executeInfo)
    operateInfoTwo.current = {
      deviceIds: deviceData.deviceId.toString(),
      pointName: pointNameTwo,
      controlType: controlTypeTwo,
      operatorBy: "",
      authorizerBy: "",
      targetValue: inputValue[value],
      interval: 0,
    }
    setOperateInfo(controlParamMapRef.current.executeInfo)

    setOpenModal(true)
  }
  const controlVals = (info) => {
    controlParamMapRef.current.executeInfo = {
      deviceIds: deviceData.deviceId.toString(),
      deviceName: deviceData.deviceName,
      pointName: info.controlKey,
      // pointDesc: info.controlPointName,
      controlType: info.controlType,
      targetValue: info.value.toFixed(1),
      interval: 0,
      operateName: info.name,
      operatorBy: "",
      authorizerBy: "",
    }
    setOperateInfo(controlParamMapRef.current.executeInfo)
    setOpenModal(true)
  }
  const { stepBtnClkRef } = useDvsControlStep({ controlParamMapRef, modalRef, setOpenModal, setLoading })

  const operateStepClk = useRef(async (type: "ok" | "close", currentStep: number, data?: IDualPsdSafeLoginForm) => {
    const res = await stepBtnClkRef?.current(type, currentStep, data)
    if (currentStep === AUTH_VERIFY && res) {
      operateInfoTwo.current.operatorBy = data.name1
      operateInfoTwo.current.authorizerBy = data.name2
      setTimeout(async () => {
        const exeResData = await doBaseServer<IControlActExecuteParams>("fetchControlAction", operateInfoTwo.current)
        if (validOperate(exeResData)) {
          setOpenModal(false)
        }
      }, 1000)
    }
  })
  useEffect(() => {}, [])

  return (
    <div className="device-card-base">
      <div className="card-head">
        <span className="card-name">{deviceData.stationFullName}</span>
        <span className="card-name">{deviceData.deviceName}</span>
      </div>
      <div className="card-content" data-dvscode={deviceData.stationCode}>
        <div className="card-content-top">
          <div className="l-full run-info-box">
            <div className="value-top">
              <span>{judgeNull(deviceRealTimeData?.RealTimeTotalActivePower, 1, 2, "-")} MW</span>
              <span>{judgeNull(deviceRealTimeData?.RealTimeTotalReactivePower, 1, 2, "-")} Mvar</span>
            </div>
            {Object.keys(controlLs.current)?.map((j) => {
              return (
                <div className="title-bottom" key={j}>
                  {controlLs.current[j]?.map((i) => {
                    return (
                      <div className="title-bottom-item" key={i.name}>
                        <i
                          onClick={() => controlVals(i)}
                          className={`${deviceRealTimeData?.[i.valKey] == i.value ? "iblur" : "igrey"}`}
                        ></i>
                        <span className="title-bottom-name" onClick={() => controlVals(i)}>
                          {i.name}
                        </span>
                        {i.key ? <span>{judgeNull(deviceRealTimeData?.[i.key], 1, 2, "-")}</span> : ""}
                      </div>
                    )
                  })}
                </div>
              )
            })}
            {/* <div className="title-bottom">
              {Object.keys(CONTROL_LS)?.map((i) => {
                return (
                  <div className="title-bottom-item" key={i}>
                    <i className={`${deviceRealTimeData?.[i] ? "iblur" : "igrey"}`}></i>
                    <span>{CONTROL_LS[i]}</span>
                  </div>
                )
              })}
            </div> */}
          </div>
        </div>
        {Object.keys(CONTROL_VAL)?.map((i) => {
          return (
            <div key={i} className="card-content-bottom">
              <span>{CONTROL_VAL[i]}</span>
              <Input.Search
                enterButton="设定"
                value={inputValue[i]}
                onChange={(e) =>
                  setInputValue((prev) => {
                    prev[i] = e.target.value
                    return { ...prev }
                  })
                }
                onSearch={() => onSearch(i)}
              />
            </div>
          )
        })}
      </div>
      <CustomModal<IOperateStepProps, IOperateStepRef>
        ref={modalRef}
        width="30%"
        title="设备控制"
        destroyOnClose
        open={openModal}
        footer={null}
        onCancel={setOpenModal.bind(null, false)}
        Component={OperateStep}
        componentProps={{ loading, data: operateInfo, buttonClick: stepBtnClkRef.current, deviceType: "DNJL" }}
      />
    </div>
  )
}
