/*
 *@Author: chenmeifeng
 *@Date: 2023-10-09 13:50:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-20 14:48:31
 *@Description: 升压站批量控制
 */

import "./index.less"

import useRun4deviceData from "@hooks/use-run-4device-data.ts"
import { IBatchStn2DvsTreeData } from "@pages/control-batch/types/i-batch.ts"
import React, { useMemo, useRef, useState } from "react"

import ControlBtnGroup from "@/components/device-control/control-btn-group.tsx"
import SelectWidthAll from "@/components/select-with-all"
import ControlBatchTable from "@/pages/control-batch/components/control-batch-table.tsx"
import { TDeviceType } from "@/types/i-config.ts"
import { IDeviceData } from "@/types/i-device.ts"

import ControlBatchTree, { IControlBatchTreeProps } from "./components/control-batch-tree"
import { dvsTreeItem2DvsData } from "./methods/"
import { SearchOutlined } from "@ant-design/icons"
import { Button } from "antd"

export default function ControlBatch() {
  const CONTROL_SELECT = [{ label: "升压站控制", value: "SYZZZ" }]
  const [deviceType, setDeviceType] = useState<TDeviceType>("SYZZZ")
  const [checkedDevices, setCheckedDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const [btnGroupDevices, setBtnGroupDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const [showSearch, setShowSearch] = useState(false)

  const onSubmitRef = useRef<IControlBatchTreeProps["onSubmit"]>((devices, isSubmit) => {
    if (isSubmit) {
      setBtnGroupDevices(devices)
      return setCheckedDevices(devices)
    }
    setBtnGroupDevices([])
  })

  const btnGroupDvsList: Partial<IDeviceData>[] = useMemo(() => {
    return btnGroupDevices.map((item) => dvsTreeItem2DvsData(item, deviceType))
  }, [btnGroupDevices, deviceType])

  const particalDvsList: Partial<IDeviceData>[] = useMemo(
    () => checkedDevices.map((item) => dvsTreeItem2DvsData(item, deviceType)),
    [checkedDevices, deviceType],
  )

  const changeSearchbox = useRef((e) => {
    setShowSearch(e)
  })
  const runParams = useMemo(() => {
    return { isStart: true, deviceTypeList: [deviceType] }
  }, [deviceType])
  useRun4deviceData(runParams)

  return (
    <div className="l-full control-batch-wrap">
      <div className="control-batch-left">
        <div className="batch-left-top">
          <SelectWidthAll
            style={{ width: "80%" }}
            options={CONTROL_SELECT}
            value={deviceType}
            allowClear={false}
            onChange={setDeviceType}
          />
          <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => setShowSearch(!showSearch)} />
        </div>
        <ControlBatchTree
          deviceType={deviceType}
          onSubmit={onSubmitRef.current}
          showSearchBox={showSearch}
          changeSearchbox={changeSearchbox.current}
        />
      </div>
      <div className="control-batch-right">
        <ControlBtnGroup deviceList={btnGroupDvsList} defaultType={deviceType} btnProps={{ size: "middle" }} />
        <ControlBatchTable deviceType={deviceType} deviceList={particalDvsList} />
      </div>
    </div>
  )
}
