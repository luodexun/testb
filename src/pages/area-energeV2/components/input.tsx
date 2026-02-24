/*
 * @Author: chenmeifeng
 * @Date: 2025-08-13 15:27:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 16:48:01
 * @Description:
 */
import { Input } from "antd"
import { SearchProps } from "antd/es/input"
import { useRef, useState } from "react"

import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step"
import { IControlParamMap } from "@/components/device-control/types"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step"
import { IDeviceData } from "@/types/i-device"
import { showMsg } from "@/utils/util-funs"
interface IProps {
  valKey: string
  valLabel: string
  valControlType: string
  device: IDeviceData
}
export default function InputSet(props: IProps) {
  const { valKey, valLabel, valControlType, device } = props
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [operateInfo, setOperateInfo] = useState<IControlParamMap["executeInfo"]>()
  const modalRef = useRef<ICustomModalRef<IOperateStepRef>>()
  const controlParamMapRef = useRef<IControlParamMap>({})
  const [inputValue, setInputValue] = useState(null)
  const changeVal = (e) => {
    setInputValue(e.target.value)
  }
  const controlVal: SearchProps["onSearch"] = () => {
    if (inputValue === null || inputValue === "") {
      showMsg("请输入设定值")
      return
    }
    controlParamMapRef.current.executeInfo = {
      stationName: device.stationName,
      deviceIds: device.deviceId.toString(),
      deviceName: device.deviceName,
      pointName: valKey,
      pointDesc: valLabel,
      controlType: valControlType,
      targetValue: inputValue,
      interval: 0,
      operateName: inputValue,
      operatorBy: "",
      authorizerBy: "",
    }
    console.log(controlParamMapRef.current.executeInfo)
    setOperateInfo(controlParamMapRef.current.executeInfo)

    setOpenModal(true)
  }
  const { stepBtnClkRef } = useDvsControlStep({ controlParamMapRef, modalRef, setOpenModal, setLoading })
  return (
    <div>
      <Input.Search enterButton="设定" value={inputValue} onChange={changeVal} onSearch={controlVal} />
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
