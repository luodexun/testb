/*
 * @Author: chenmeifeng
 * @Date: 2024-08-28 16:38:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-14 15:19:02
 * @Description:
 */
import "./index.less"

import { Button } from "antd"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"

import SelectWidthAll from "@/components/select-with-all"
import { AtomConfigMap } from "@/store/atom-config"

import BatchDevice from "./components/batch-device"
import AlarmRuleTable from "./components/rule-table"
import { DVS_CONTROL_SELECT } from "./configs"
import { IBatchStn2DvsTreeData } from "./types"

export default function AlarmRule(props) {
  const { setDrawer } = props
  const [deviceType, setDeviceType] = useState("WT")
  const [devices, setDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const deviceTypes = useMemo(() => {
    const dvsTypes = Object.keys(deviceTypeMap)?.map((i) => {
      return {
        value: i,
        label: deviceTypeMap[i],
      }
    })
    return dvsTypes
  }, [deviceTypeMap])
  return (
    <div className="l-full alarm-rule-wrap">
      <Button size="small" shape="circle" title="返回" className="alarm-rule-back" onClick={() => setDrawer(false)} />
      <div className="alarm-rule-left">
        <div className="rule-left-top">
          <SelectWidthAll style={{ width: "80%" }} options={deviceTypes} value={deviceType} onChange={setDeviceType} />
        </div>
        <div className="rule-left-bottom">
          <BatchDevice deviceType={deviceType} onSelect={(e) => setDevices(e)} />
        </div>
        {/* <ControlBatchTree deviceType={deviceType} onSubmit={onSubmitRef.current} searchDevice={searchVal} /> */}
      </div>
      <div className="alarm-rule-right">
        <AlarmRuleTable devices={devices} />
      </div>
    </div>
  )
}
