/*
 * @Author: chenmeifeng
 * @Date: 2025-08-13 16:15:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 16:49:15
 * @Description: 控制模式
 */
import { Button, Popover } from "antd"
import { useMemo, useRef, useState } from "react"

import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step"
import { IControlParamMap } from "@/components/device-control/types"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step"
import PointText from "@/components/trend-line-by-dvs/text"

import { AGVC_CONTROL } from "../configs"
const BtnList = ({ type, device }) => {
  const list = useMemo(() => AGVC_CONTROL[type], [type])
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [operateInfo, setOperateInfo] = useState<IControlParamMap["executeInfo"]>()
  const modalRef = useRef<ICustomModalRef<IOperateStepRef>>()
  const controlParamMapRef = useRef<IControlParamMap>({})

  const control = (info) => {
    controlParamMapRef.current.executeInfo = {
      stationName: device.stationName,
      deviceIds: device.deviceId.toString(),
      deviceName: device.deviceName,
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
  return (
    <div className="control-ls">
      {list?.map((i) => {
        return (
          <Button size="small" key={i.value} onClick={() => control(i)}>
            {i.name}
          </Button>
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
        componentProps={{ loading, data: operateInfo, buttonClick: stepBtnClkRef.current, deviceType: "DNJL" }}
      />
    </div>
  )
}
export default function ControlItem(props) {
  const { value, type, device, valkey } = props
  const [open, setOpen] = useState(false)
  const handleOpenChange = () => {
    setOpen((prev) => {
      return !prev
    })
  }
  const acutalList = useMemo(() => {
    return AGVC_CONTROL?.[type] || []
  }, [type])
  const actualValue = useMemo(() => {
    if (value === null || value === undefined) {
      return "-"
    } else if (typeof value === "boolean") {
      return value ? (type == "agc" ? "AGC控制" : "AVC控制") : "本地控制"
    } else {
      return acutalList?.find((i) => i.value == value)?.name || "-"
    }
  }, [value, type, acutalList])
  return (
    <div className="energy-ct-item">
      <Popover
        content={<BtnList type={type} device={device} />}
        title="请选择控制类型"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        {/* <Button type="text">{value !== null ? ctType?.find((i) => i.value == value)?.name || "-" : "-"}</Button> */}
        <PointText text={actualValue} record={device} valkey={valkey} click={() => handleOpenChange()} />
      </Popover>
    </div>
  )
}
