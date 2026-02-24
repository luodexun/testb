/*
 * @Author: xiongman
 * @Date: 2023-09-27 11:10:27
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-11 09:42:06
 * @Description: 设备控制
 */

import "./index.less"

import { useContext, useMemo, useRef } from "react"

import ControlBtnGroup from "@/components/device-control/control-btn-group.tsx"
import { ICurrentStateRef } from "@/components/device-control/types.ts"
import InfoCard from "@/components/info-card"
import { CTRL } from "@/configs/dvs-control.ts"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { IBaseProps } from "@/types/i-page.ts"

import CurrentState from "./components/current-state.tsx"

interface IProps extends IBaseProps {}

export default function DeviceControl(props: IProps) {
  const { className } = props

  const cStateRef = useRef<ICurrentStateRef>()
  const { device, isUseNewDvsState } = useContext(DvsDetailContext)
  const curDevice = useMemo(() => [device], [device])

  return (
    <InfoCard title="设备控制" className={`dvs-control-wrap ${className}`}>
      <CurrentState ref={cStateRef} device={device} isUseNewDvsState={isUseNewDvsState} />
      <ControlBtnGroup
        deviceList={curDevice}
        isUseNewDvsState={isUseNewDvsState}
        currentStateRef={cStateRef}
        hasBatch={[CTRL.Batch]}
        validMarket={false}
      />
    </InfoCard>
  )
}
