/*
 * @Author: chenmeifeng
 * @Date: 2024-04-01 10:00:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 10:38:00
 * @Description: 控制按钮组件
 */
import { showMsg } from "@utils/util-funs.tsx"
import { Button } from "antd"
import { useRef, useState } from "react"

import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step.tsx"
import { IControlParamMap } from "@/components/device-control/types.ts"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step.ts"

import { BTNLIST } from "../configs/index"
interface IProps {
  dataSource?: any
  pagination?: any
  rowSelection?: any
  deviceList?: any
  onSelect?: (value: number) => void
}
export default function ControlBtnGroup(props: IProps) {
  const { rowSelection, deviceList, dataSource, pagination, onSelect } = props
  const [btnSelectKey, setBtnSelectKey] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [operateInfo, setOperateInfo] = useState<IControlParamMap["executeInfo"]>()
  const modalRef = useRef<ICustomModalRef<IOperateStepRef>>()
  const controlParamMapRef = useRef<IControlParamMap>({})

  const btnOnClick = (v) => {
    if (rowSelection.selectedRowKeys.length == 0) {
      showMsg("请勾选设备！")
    } else {
      const deviceCompareData = deviceList.filter((item) => rowSelection.selectedRowKeys.includes(item.deviceId))
      setOpenModal(true)
      setBtnSelectKey(v.key)
      controlParamMapRef.current.executeInfo = {
        stationName: deviceList[0]?.stationName,
        deviceName: deviceCompareData.map((item) => item.deviceName).join(","),
        // stateName: stateInfo?.state,
        operateName: v.value,
        // 控制信息
        deviceIds: deviceCompareData.map((item) => item.deviceId).join(","),
        pointName: v.name,
        pointDesc: "",
        controlType: v.key,
        operatorBy: "",
        authorizerBy: "",
        targetValue: v.target,
        interval: 0,
      }

      setOperateInfo(controlParamMapRef.current.executeInfo)
    }
  }
  const { stepBtnClkRef } = useDvsControlStep({ controlParamMapRef, modalRef, setOpenModal, setLoading })

  return (
    <div className="btn-group-wrap">
      {BTNLIST.map((item) => {
        return (
          <Button
            key={item.key}
            className={`btn ${item.key == btnSelectKey ? "btn-selected" : ""}`}
            onClick={() => btnOnClick(item)}
          >
            {item.value}
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
        componentProps={{ loading, data: operateInfo, buttonClick: stepBtnClkRef.current }}
      />
    </div>
  )
}
