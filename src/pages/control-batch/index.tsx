/*
 *@Author: chenmeifeng
 *@Date: 2023-10-09 13:50:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-21 15:42:47
 *@Description: 机组控制
 */

import "./index.less"

import { CloseOutlined, SearchOutlined } from "@ant-design/icons"
import useRun4deviceData from "@hooks/use-run-4device-data.ts"
import { CONTROL_SELECT } from "@pages/control-batch/configs"
import { Button, Input } from "antd"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import ControlBtnGroup from "@/components/device-control/control-btn-group.tsx"
import SelectWidthAll from "@/components/select-with-all"
import { StorageCurDvsInfo } from "@/configs/storage-cfg.ts"
import { TDeviceType } from "@/types/i-config.ts"
import { DvsStateInfo, IDeviceData } from "@/types/i-device.ts"
import { getStorage } from "@/utils/util-funs.tsx"

import ControlBatchTable from "./components/control-batch-table"
import ControlBatchTree, { IControlBatchTreeProps } from "./components/control-batch-tree"
import { dvsTreeItem2DvsData } from "./methods/batch-funs.ts"
import { IBatchStn2DvsTreeData } from "./types/i-batch.ts"
import AtomRun4DvsData from "@/store/atom-run-device.ts"
import { useAtomValue } from "jotai"

export default function ControlBatch() {
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const [checkedDevices, setCheckedDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const [btnGroupDevices, setBtnGroupDevices] = useState<IBatchStn2DvsTreeData[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchVal, setSearchVal] = useState("")
  // const [dvsState, setDvsState] = useState<DvsStateInfo[]>([])
  const onSubmitRef = useRef<IControlBatchTreeProps["onSubmit"]>((devices, isSubmit) => {
    if (isSubmit) {
      setBtnGroupDevices(devices)
      return setCheckedDevices(devices)
    }
    setBtnGroupDevices([])
  })

  const btnGroupDvsList: Partial<IDeviceData>[] = useMemo(
    () => btnGroupDevices.map((item) => dvsTreeItem2DvsData(item, deviceType)),
    [btnGroupDevices, deviceType],
  )
  const particalDvsList: Partial<IDeviceData>[] = useMemo(
    () => checkedDevices.map((item) => dvsTreeItem2DvsData(item, deviceType)),
    [checkedDevices, deviceType],
  )
  const runParams = useMemo(() => {
    return { isStart: true, deviceTypeList: [deviceType] }
  }, [deviceType])
  useRun4deviceData(runParams)
  const run4Device = useAtomValue(AtomRun4DvsData)
  const searchDevice = useRef((e) => {
    setSearchVal(e)
    setShowSearch(false)
  })
  const dvsState = useMemo<DvsStateInfo[]>(() => {
    const run =
      checkedDevices?.map((i) => {
        const state = run4Device?.[deviceType]?.[i.deviceCode]?.mainState
        return {
          deviceName: i.deviceName,
          deviceCode: i.deviceCode,
          stationName: i.stationName,
          state,
        }
      }) || []
    return run
  }, [run4Device, checkedDevices])
  useEffect(() => {
    const deviceInfo = getStorage(StorageCurDvsInfo)
    if (!deviceInfo?.deviceType) return
    setDeviceType(deviceInfo?.deviceType)
  }, [])
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
        <ControlBatchTree deviceType={deviceType} onSubmit={onSubmitRef.current} searchDevice={searchVal} />
      </div>
      <div className="control-batch-right">
        <ControlBtnGroup
          deviceList={btnGroupDvsList}
          btnProps={{ size: "middle" }}
          showTime={true}
          validMarket={false}
          devicesState={dvsState}
        />
        <ControlBatchTable deviceType={deviceType} deviceList={particalDvsList} />
      </div>
      {showSearch ? (
        <div className="float-search">
          <div className="float-search-title">
            <span>查找</span>
            <CloseOutlined onClick={() => setShowSearch(false)} />
          </div>
          <Input.Search
            enterButton={false}
            onSearch={searchDevice.current}
            placeholder="请输入设备名称或设备运营编号"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
