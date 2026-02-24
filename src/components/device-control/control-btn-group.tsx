/*
 * @Author: xiongman
 * @Date: 2023-10-23 12:20:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-10 17:46:45
 * @Description:
 */

import "./control-btn-group.less"

import { CONTROL_TYPE_4DEVICE, CTRL, IS_SHOW_BTN_LIST, TControlType } from "@configs/dvs-control.ts"
import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import { setStorage, showMsg } from "@utils/util-funs.tsx"
import { Button, ButtonProps } from "antd"
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import LimitPowerButton from "@/components/custom-input/limit-power-button.tsx"
import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import {
  crtExecuteInfo,
  fiveHeFenValid,
  getDeviceSignRecordData,
  getDvsSignLs,
  getDvsStateStr,
} from "@/components/device-control/methods.ts"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step.tsx"
import { IControlParamMap, ICurrentStateRef } from "@/components/device-control/types.ts"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step.ts"
import { StorageCurDvsInfo } from "@/configs/storage-cfg"
import { TDeviceType } from "@/types/i-config.ts"
import { DvsStateInfo, IDeviceData } from "@/types/i-device.ts"
import { getMngStaticInfo, queryDevicesByParams } from "@/utils/device-funs"

import JudgeFive from "../control-five-rule/control-modal"
import DeviceResetCom, { IDvsRstProps, IDvsRstRef } from "../device-reset-common"
import IntervalBox, { IIntervalProps, IIntervalRefs } from "./interval-input"

interface IProps {
  deviceList: Partial<IDeviceData>[]
  currentStateRef?: MutableRefObject<ICurrentStateRef>
  btnProps?: ButtonProps
  defaultType?: TDeviceType
  hasBatch?: string[]
  showTime?: boolean
  validMarket?: boolean // 是否需要挂牌校验
  devicesState?: DvsStateInfo[]
  isUseNewDvsState?: boolean // 是否使用新版设备运行状态来禁止控制
}

export default function ControlBtnGroup(props: IProps) {
  const {
    deviceList,
    showTime,
    defaultType,
    currentStateRef,
    btnProps,
    hasBatch = [],
    validMarket = false,
    devicesState = [],
    isUseNewDvsState = false,
  } = props
  const [showTimeModal, setShowTimeModal] = useState(false)
  const timeRef = useRef<ICustomModalRef<IIntervalRefs>>()
  const [openModal, setOpenModal] = useState(false)
  const [openRsModal, setOpenRsModal] = useState(false)
  const [openFiveComfirm, setOpenFiveComfirm] = useState(false) // 五防校验是否开启弹框
  const [controlParams, setControlParams] = useState(null)
  const [loading, setLoading] = useState(false)
  const [operateInfo, setOperateInfo] = useState<IControlParamMap["executeInfo"]>()
  const curOperateInfo = useRef(null)
  const modalRef = useRef<ICustomModalRef<IOperateStepRef>>()
  const resetModalRef = useRef<ICustomModalRef<IDvsRstRef>>()
  const controlParamMapRef = useRef<IControlParamMap>({})
  const targetValueRef = useRef<Record<number, number>>({})
  const deviceStateList = useRef<DvsStateInfo[]>([])
  const prohibitModelControl = useRef<number[]>([])

  const BTN_LIST: IDvsRunStateInfo<TControlType, string>[][] = useMemo(
    () => CONTROL_TYPE_4DEVICE[deviceList?.[0]?.deviceType || defaultType || "WT"],
    [deviceList, defaultType],
  )
  const currentDvsType = useMemo(() => {
    return deviceList?.[0]?.deviceType || defaultType || "WT"
  }, [deviceList])
  useEffect(() => {
    deviceStateList.current = devicesState || []
  }, [devicesState])
  useEffect(() => {
    initData()
  }, [])

  const deviceListRef = useRef(deviceList)
  const navigate = useNavigate()
  deviceListRef.current = deviceList

  const initData = async () => {
    const res = await getMngStaticInfo("prohibitModelIdControl")
    if (!res) return
    prohibitModelControl.current = res
  }
  const ctrlBtnClickRef = useRef(async (operateInfo: IDvsRunStateInfo<TControlType, string>, targetValue?: number) => {
    curOperateInfo.current = operateInfo
    if (operateInfo?.title === CTRL.Batch) {
      setStorage(JSON.stringify(deviceList?.[0]), StorageCurDvsInfo)
      return navigate("/control/batch")
    }
    if (!deviceListRef.current?.length) return showMsg("请选择设备，并确认！")
    if (defaultType === "SYZZZ" && deviceListRef.current?.length > 1) return showMsg("仅支持一个设备!")
    controlParamMapRef.current.executeInfo = crtExecuteInfo({
      defaultType,
      operateInfo,
      targetValue,
      deviceList: deviceListRef.current,
      stateInfo: currentStateRef?.current?.getState(),
    })

    setOperateInfo(controlParamMapRef.current.executeInfo)
    // 判断设备是否有挂牌记录, 有挂牌记录就不进行设备控制
    let signRes
    if (validMarket) {
      const deviceId = deviceListRef.current?.map((i) => i.deviceId)?.join(",")
      signRes = await getDeviceSignRecordData({ deviceId, isEnd: false })
    }
    if (validMarket && signRes?.length) {
      const { signMsg } = getDvsSignLs(signRes, deviceListRef.current)
      if (deviceListRef.current?.length === 1) showMsg("当前设备有挂牌记录，禁止控制", "warning", { duration: 6 })
      if (deviceListRef.current?.length > 1)
        showMsg(`以下设备: ${signMsg}有挂牌记录，禁止控制`, "warning", { duration: 10 })
      return
    }
    // 判断设备是否存在某个状态，存在则禁止控制设备
    if (operateInfo.prohibitControl && operateInfo.prohibitControl.length) {
      // console.log(operateInfo.prohibitControl, "operateInfo", currentStateRef?.current?.getState())
      const prohibitControl =
        (isUseNewDvsState ? operateInfo.prohibitNewStateControl : operateInfo.prohibitControl) || []

      const mainState = currentStateRef?.current?.getState()?.mainState
      // 单机控制时
      if (currentStateRef?.current && prohibitControl.includes(mainState)) {
        showMsg("当前设备状态禁止控制", "warning", { duration: 6 })
        return
      }
      // 批量机组控制时
      const existStateDevices = deviceStateList.current?.filter((i) => prohibitControl.includes(i.state))
      if (existStateDevices?.length) {
        const warningStr = getDvsStateStr(existStateDevices)
        showMsg(`以下设备: ${warningStr} 状态禁止控制，不再下发重复的指令`, "warning", { duration: 10 })
        return
      }
    }
    // 对风机指定机组的设备禁止“停止”控制
    if (operateInfo.prohibitModelIdControl) {
      const existModelDvs = deviceListRef.current?.filter((i) => prohibitModelControl.current?.includes(i.modelId))
      if (existModelDvs?.length) {
        const dvsList = existModelDvs?.map((i) => `${i.deviceNumber}-${i.model}`)
        showMsg(`以下设备机组: ${dvsList} 状态禁止控制`, "warning", { duration: 10 })
        return
      }
    }
    if ((operateInfo?.title === CTRL.POWER_SET || operateInfo?.title === CTRL.REACTIVE_SET) && !targetValue) {
      return showMsg(`请输入${operateInfo?.title}！`)
    }
    if (operateInfo?.title === CTRL.CLOSING || operateInfo?.title === CTRL.OPENING) {
      const deviceList = await queryDevicesByParams({
        stationCode: deviceListRef.current?.[0]?.stationCode,
        deviceType: "SYZZZ",
      })
      const params = {
        pointName: controlParamMapRef.current.executeInfo?.pointName,
        controlType: controlParamMapRef.current.executeInfo?.targetValue ? 0 : 1,
        stationCode: deviceListRef.current?.[0]?.stationCode,
        deviceCode: deviceListRef.current?.[0]?.deviceCode,
      }
      setOpenFiveComfirm(true)
      setControlParams(params)
      return
      // const flag = await fiveHeFenValid(params)
      // if (!flag) return
    }
    // 只有机组批量控制才需要输入步长
    if (showTime && deviceListRef.current?.length > 1) {
      return setShowTimeModal(true)
    }
    if (operateInfo?.title === CTRL.RESET) {
      setOpenRsModal(true)
      return
    }
    setOpenModal(true)
  })
  const closeResetValid = useRef((type: "part" | "all" | "cancel", deviceInfo) => {
    setOpenRsModal(false)
    if (type === "part" || type === "all") {
      controlParamMapRef.current.executeInfo.deviceIds = deviceInfo.deviceIds
      controlParamMapRef.current.executeInfo.deviceName = deviceInfo.deviceName
      setOperateInfo(controlParamMapRef.current.executeInfo)
      setOpenModal(true)
    }
  })
  const closeInterval = useRef((value) => {
    setShowTimeModal(false)
    controlParamMapRef.current.executeInfo.interval = value
    setOperateInfo(controlParamMapRef.current.executeInfo)
    if (curOperateInfo.current?.title === CTRL.RESET) {
      setOpenRsModal(true)
      return
    }
    setOpenModal(true)
  })

  const fiveJudgeRes = useRef((type) => {
    setOpenFiveComfirm(false)
    if (type === "next") {
      setOpenModal(true)
    }
  })

  const { stepBtnClkRef } = useDvsControlStep({
    controlParamMapRef,
    modalRef,
    setOpenModal,
    setLoading,
    deviceType: currentDvsType,
  })

  const isCtrlSet = useRef((title: string) => [CTRL.POWER_SET, CTRL.REACTIVE_SET, CTRL.YT].includes(title))
  return (
    <div className="control-btn-group">
      {BTN_LIST.map((itemList, index) => {
        return (
          <div key={`btn_row_${index}`} className="btn-row">
            {itemList.map((item) => {
              if (isCtrlSet.current(item.title)) {
                return (
                  <LimitPowerButton
                    key={item.field}
                    onChange={(val: number) => (targetValueRef.current[item.field] = val)}
                    buttonProps={{
                      size: "small",
                      ...(btnProps || {}),
                      className: `control-${item.icon}`,
                      onClick: () => ctrlBtnClickRef.current(item, targetValueRef.current[item.field]),
                      children: item.title,
                    }}
                  />
                )
              }
              // 判断当前元素是否包含在IS_SHOW_BTN_LIST中，且hasBatch是否有当前元素
              if (IS_SHOW_BTN_LIST.includes(item.title) && hasBatch.includes(item.title)) {
                return (
                  <Button
                    key={item.field}
                    size="small"
                    {...(btnProps || {})}
                    className={`control-${item.icon}`}
                    onClick={() => ctrlBtnClickRef.current(item)}
                    children={item.title}
                  />
                )
              }
              if (!IS_SHOW_BTN_LIST.includes(item.title)) {
                return (
                  <Button
                    key={item.field}
                    size="small"
                    {...(btnProps || {})}
                    className={`control-${item.icon}`}
                    onClick={() => ctrlBtnClickRef.current(item)}
                    children={item.title}
                  />
                )
              }
            })}
          </div>
        )
      })}
      <CustomModal<IOperateStepProps, IOperateStepRef>
        ref={modalRef}
        width="30%"
        title="设备控制"
        destroyOnClose
        open={openModal}
        footer={null}
        onCancel={setOpenModal.bind(null, false)}
        Component={OperateStep}
        componentProps={{ loading, data: operateInfo, buttonClick: stepBtnClkRef.current, deviceType: currentDvsType }}
      />
      <CustomModal<IDvsRstProps, IDvsRstRef>
        ref={resetModalRef}
        width="40%"
        title="复位校验"
        destroyOnClose
        open={openRsModal}
        footer={null}
        onCancel={setOpenRsModal.bind(null, false)}
        Component={DeviceResetCom}
        componentProps={{ data: operateInfo, buttonClick: closeResetValid.current }}
      />
      <CustomModal<IIntervalProps, IIntervalRefs>
        ref={timeRef}
        width="20%"
        title="控制步长"
        destroyOnClose
        open={showTimeModal}
        footer={null}
        onCancel={setShowTimeModal.bind(null, false)}
        Component={IntervalBox}
        componentProps={{ buttonClick: closeInterval.current }}
      />
      <JudgeFive open={openFiveComfirm} setOpen={fiveJudgeRes.current} controlParam={controlParams} />
    </div>
  )
}
