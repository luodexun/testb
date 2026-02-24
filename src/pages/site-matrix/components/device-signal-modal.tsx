/*
 * @Author: xiongman
 * @Date: 2023-11-16 12:08:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-04 10:33:27
 * @Description:
 */

import { getDeviceSignRecordData, updateDvsSignalRecord } from "@pages/area-matrix/methods"
import { useContext, useEffect, useRef, useState } from "react"

import CustomModal, { ICustomModalRef } from "@/components/custom-modal"
import DeviceSignalForm, { IDeviceSignalFormRef } from "@/components/device-card/device-signal-form.tsx"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IDvsSignalRecordInfo } from "@/types/i-monitor-info.ts"
import { showMsg } from "@/utils/util-funs"

interface IProps {
  containerDom: HTMLDivElement
  refleshData?: () => void
}

export default function DeviceSignalModal(props: IProps) {
  const { containerDom, refleshData } = props
  const [loading, setLoading] = useState(false)
  const [signalRecord, setSignalRecord] = useState<IDvsSignalRecordInfo[]>([])
  const { device, setDevice, drawerOpenMap, setDrawerOpenMap } = useContext(DvsDetailContext)

  const modeRef = useRef<ICustomModalRef<IDeviceSignalFormRef>>(null)

  useEffect(() => {
    if (!drawerOpenMap.signalModal || !device?.deviceId) return
    setLoading(true)
    getDeviceSignRecordData({ deviceId: device.deviceId, isEnd: false })
      .then(setSignalRecord)
      .then(() => setLoading(false))
  }, [device?.deviceId, drawerOpenMap.signalModal])

  useEffect(() => {
    if (!device?.deviceId) return
    modeRef.current.getChildrenRef()?.setValue(signalRecord, device?.deviceId)
  }, [device?.deviceId, signalRecord])

  const drawerOpenMapRef = useRef({ setDrawerOpenMap, setDevice })
  drawerOpenMapRef.current = { setDrawerOpenMap, setDevice }
  const closeModalRef = useRef(() => {
    drawerOpenMapRef.current?.setDrawerOpenMap({})
    drawerOpenMapRef.current?.setDevice(null)
  })

  const deviceRef = useRef(device)
  deviceRef.current = device
  const onModelOkRef = useRef(async () => {
    if (!deviceRef.current?.deviceId) return
    const theSignFormData = modeRef.current.getChildrenRef()?.getValue()
    const { isMultiple, deviceIdList } = modeRef.current.getChildrenRef()
    let stnDvSignList = []
    if (isMultiple) {
      stnDvSignList = await getDeviceSignRecordData({ stationId: deviceRef.current.stationId, isEnd: false })
    }
    setLoading(true)
    const res = await updateDvsSignalRecord(theSignFormData, isMultiple, stnDvSignList, deviceIdList)
    setLoading(false)

    if (res.code === "200") {
      closeModalRef.current()
      showMsg("操作成功", "success")
      refleshData?.()
    } else {
      showMsg(res.msg, "error")
    }
  })

  return (
    <CustomModal
      ref={modeRef}
      width="40%"
      destroyOnClose
      open={drawerOpenMap["signalModal"]}
      confirmLoading={loading}
      title={`设备挂牌：${device?.deviceNumber}`}
      okButtonProps={{ size: "small" }}
      cancelButtonProps={{ size: "small" }}
      getContainer={containerDom}
      onCancel={closeModalRef.current}
      onOk={onModelOkRef.current}
      Component={DeviceSignalForm}
      className="device-signal-modal"
      componentProps={{ disabled: loading, device }}
    />
  )
}
