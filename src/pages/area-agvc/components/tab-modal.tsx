/*
 * @Author: chenmeifeng
 * @Date: 2024-01-24 14:09:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-24 15:38:51
 * @Description:
 */
import { Tabs } from "antd"
import { useMemo, useRef, useState } from "react"

import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import OperateStep, { IOperateStepProps, IOperateStepRef } from "@/components/device-control/operate-step"
import { IControlParamMap } from "@/components/device-control/types"
import useDvsControlStep from "@/components/device-control/use-dvs-control-step"

import { AREA_AGVC_POWER_COLUMNS, AREA_AGVC_REACTIVE_COLUMNS } from "../configs"
import { transformCurData } from "../methods"
import TInput from "./tinput"

const tabsList = [
  { key: "1", label: "AGC有功调节", closable: false },
  { key: "2", label: "AVC无功调节", closable: false },
]
export default function TabAreaAgvc(props) {
  const { dataSource } = props
  const [activeKey, setActiveKey] = useState("1")
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const controlParamMapRef = useRef<IControlParamMap>({})
  const [operateInfo, setOperateInfo] = useState<IControlParamMap["executeInfo"]>()
  const modalRef = useRef<ICustomModalRef<IOperateStepRef>>()

  const modalIpRef = useRef()
  const [openIpModal, setOpenIpModal] = useState(false)
  const openCtl = useRef((key, record, isDiao) => {
    controlParamMapRef.current.executeInfo = transformCurData(record, key, isDiao)
    setOperateInfo(controlParamMapRef.current.executeInfo)
    if (isDiao) return setOpenIpModal(true)
    setOpenModal(true)
  })

  const { stepBtnClkRef } = useDvsControlStep({
    deviceType: "AGVC",
    controlParamMapRef,
    modalRef,
    setOpenModal,
    setLoading,
  })
  const columns = useMemo(() => {
    return activeKey === "1" ? AREA_AGVC_POWER_COLUMNS(openCtl.current) : AREA_AGVC_REACTIVE_COLUMNS(openCtl.current)
  }, [activeKey])

  const onTabsChgRef = useRef((key: string) => {
    setActiveKey(key)
  })
  const changeInput = useRef((type, val) => {
    if (type === "ok") {
      controlParamMapRef.current.executeInfo.targetValue = val
      controlParamMapRef.current.executeInfo.operateName =
        controlParamMapRef.current.executeInfo.operateName + " " + val
      setOperateInfo(controlParamMapRef.current.executeInfo)
      setOpenIpModal(false)
      setOpenModal(true)
    } else {
      setOpenIpModal(false)
    }
  })

  return (
    <div className="l-full area-agvc-tabs">
      <Tabs
        type="editable-card"
        hideAdd
        tabBarGutter={4}
        items={tabsList}
        activeKey={activeKey}
        onChange={onTabsChgRef.current}
      />
      <CustomTable rowKey="deviceCode" dataSource={dataSource} columns={columns} limitHeight pagination={false} />
      <CustomModal<IOperateStepProps, IOperateStepRef>
        ref={modalRef}
        width="30%"
        title="设备控制"
        destroyOnClose
        open={openModal}
        footer={null}
        onCancel={setOpenModal.bind(null, false)}
        Component={OperateStep}
        componentProps={{ loading, data: operateInfo, buttonClick: stepBtnClkRef.current, deviceType: "AGVC" }}
      />
      <CustomModal
        ref={modalIpRef}
        width="30%"
        title="设定值"
        destroyOnClose
        open={openIpModal}
        footer={null}
        onCancel={setOpenIpModal.bind(null, false)}
        Component={TInput}
        componentProps={{ submit: changeInput.current }}
      />
    </div>
  )
}
