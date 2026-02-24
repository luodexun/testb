/*
 *@Author: chenmeifeng
 *@Date: 2023-10-09 13:50:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-27 15:22:22
 *@Description: 数采控制
 */

import "./index.less"

import useRun4deviceData from "@hooks/use-run-4device-data.ts"
import { useAtomValue } from "jotai"
import React, { useEffect, useMemo, useRef, useState } from "react"

import ControlBtnGroup from "@/components/device-control/control-btn-group.tsx"
import SelectWidthAll from "@/components/select-with-all"
import ControlBatchTable from "@/pages/control-batch/components/control-batch-table.tsx"
import { AtomConfigMap } from "@/store/atom-config"
import { TDeviceType } from "@/types/i-config.ts"
import { IDeviceData } from "@/types/i-device.ts"

import ControlBatchTree, { IControlTreeProps } from "./components/point-tree"
import { dvsTreeItem2DvsData } from "./methods/"
import { ICDGTreeData, ISubmitInfo } from "./types/point"

export default function ControlDataGet() {
  const [deviceType, setDeviceType] = useState<TDeviceType>("PVCOL")
  const [checkedDevices, setCheckedDevices] = useState<ICDGTreeData[]>([])
  const [btnGroupPoints, setBtnGroupPoints] = useState<ICDGTreeData[]>([])
  const [showSearch, setShowSearch] = useState(false)
  // const unExistType = useRef(["WT", "PVINV", "ESPCS", "SYZZZ"])
  const unExistType = useRef(["NO"])
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map

  const actualTypeList = useMemo(() => {
    if (deviceTypeMap && Object.keys(deviceTypeMap)?.length) {
      console.log(deviceTypeMap)
      const typeArr = Object.keys(deviceTypeMap)?.map((i) => {
        return {
          label: deviceTypeMap[i],
          value: i,
        }
      })
      const list = typeArr?.filter((i) => !unExistType.current.includes(i.value))
      return list
    }
    return []
  }, [deviceTypeMap])

  const onSubmitRef = useRef<IControlTreeProps["onSubmit"]>((info: ISubmitInfo, isSubmit) => {
    if (isSubmit) {
      const { checkDvs, checkedPoint } = info
      console.log(checkDvs, "checkDvs")

      setBtnGroupPoints(checkedPoint)
      return setCheckedDevices(checkDvs)
    }
    setBtnGroupPoints([])
  })

  const btnGroupPointList: Partial<IDeviceData>[] = useMemo(() => {
    return btnGroupPoints.map((item) => dvsTreeItem2DvsData(item, "PVCOL"))
  }, [btnGroupPoints, deviceType])

  const particalDvsList: Partial<IDeviceData>[] = useMemo(
    () => checkedDevices.map((item) => dvsTreeItem2DvsData(item, deviceType)),
    [checkedDevices, deviceType],
  )

  const changeSearchbox = useRef((e) => {
    setShowSearch(e)
  })

  useEffect(() => {
    setCheckedDevices([])
  }, [deviceType])
  const runParams = useMemo(() => {
    return { isStart: true, deviceTypeList: ["PVCOL"] as TDeviceType[] }
  }, [deviceType])
  useRun4deviceData(runParams)

  return (
    <div className="l-full control-data-get">
      <div className="control-data-get-left">
        <div className="batch-left-top">
          <SelectWidthAll
            style={{ width: "80%" }}
            options={actualTypeList}
            value={deviceType}
            allowClear={false}
            onChange={setDeviceType}
          />
          {/* <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => setShowSearch(!showSearch)} /> */}
        </div>
        <ControlBatchTree
          deviceType={deviceType}
          onSubmit={onSubmitRef.current}
          showSearchBox={showSearch}
          changeSearchbox={changeSearchbox.current}
        />
      </div>
      <div className="control-data-get-right">
        <ControlBtnGroup deviceList={btnGroupPointList} defaultType={"PVCOL"} btnProps={{ size: "middle" }} />
        <ControlBatchTable deviceType={deviceType} deviceList={particalDvsList} />
      </div>
    </div>
  )
}
