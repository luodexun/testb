/*
 * @Author: xiongman
 * @Date: 2023-10-16 11:31:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 10:42:10
 * @Description: 设备控制-当前状态组件
 */

import { MS_SCEND_2 } from "@configs/time-constant.ts"
import { useRefresh } from "@hooks/use-refresh.ts"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

import { ICurrentStateRef, IDvsCurrentStateInfo } from "@/components/device-control/types.ts"
import { IDeviceData } from "@/types/i-device.ts"

import { getCurrentDvsStateData } from "../methods.ts"

interface IProps {
  device: IDeviceData
  isUseNewDvsState: boolean
}

const CurrentState = forwardRef<ICurrentStateRef, IProps>((props, ref) => {
  const { device, isUseNewDvsState } = props
  const [stateInfo, setStateInfo] = useState<IDvsCurrentStateInfo>()
  const [reload, setReload] = useRefresh(MS_SCEND_2) // 2s
  const [isWarranty, setIsWarranty] = useState(false)

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    getState: () => stateInfo,
  }))

  const init = () => {
    const time = new Date().getTime()
    const out_of_warranty_date = device.deviceTags?.out_of_warranty_date
    const out_warranty = new Date(out_of_warranty_date).getTime()
    const flag = !out_of_warranty_date ? true : time > out_warranty
    setIsWarranty(flag)
  }
  useEffect(() => {
    if (!reload || !device?.deviceCode) return
    getCurrentDvsStateData(device, isUseNewDvsState)
      .then(setStateInfo)
      .then(() => setReload(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device, isUseNewDvsState, reload])
  useEffect(() => {
    if (!device?.deviceCode) return
    init()
  }, [device])

  return (
    <div className="current-state">
      <span>当前状态：</span>
      <span style={{ color: stateInfo?.color }}>{stateInfo?.state || ""}</span>
      <span>{isWarranty ? "" : "质保内"}</span>
    </div>
  )
})
export default CurrentState
