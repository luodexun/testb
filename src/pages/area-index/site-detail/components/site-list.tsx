/*
 * @Author: chenmeifeng
 * @Date: 2024-01-19 15:35:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-08 10:30:38
 * @Description:
 */
import "./site-list.less"

import { useAtomValue } from "jotai"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import CustomTable from "@/components/custom-table"
import { ICustomTabRef } from "@/components/custom-table/interfaces"
import RadioButton from "@/components/radio-button"
import { MAIN_DVS_TYPE } from "@/configs/option-const"
import { getDvsMainStateList } from "@/hooks/use-matrix-device-list"
import useMonitorStationData from "@/hooks/use-monitor-station-data"
// import useRun4deviceData from "@/hooks/use-run-4device-data"
import { AtomConfigMap } from "@/store/atom-config"
import { AtomStnMonitorDataMap } from "@/store/atom-run-station"
import { TDeviceType } from "@/types/i-config"

import { crtSiteDetailColumns, stnMonitorDataAndRun4StationData2TableData } from "../methods"
import { ISiteDetailTableData } from "../types"

export interface IPerateRef {}
export interface IOperateProps {
  run4Device?: any
  siteQuota: any
}
const SiteModalList = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { run4Device, siteQuota } = props
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const [dataSource, setDataSource] = useState<ISiteDetailTableData[]>([])
  const tableRef = useRef<ICustomTabRef>(null)
  // const tableScrollRef = useRef<TableScroll>(null)
  const stnMonitorDataMap = useAtomValue(AtomStnMonitorDataMap)
  const { deviceStdStateMap } = useAtomValue(AtomConfigMap).map

  // const { run4Device } = useRun4deviceData({ isStart: true })
  useMonitorStationData([deviceType])
  useEffect(() => {
    if (!deviceType) return
    if (!stnMonitorDataMap[deviceType]) return setDataSource([])
    getDvsMainStateList(deviceStdStateMap, deviceType, "MAIN", "old")
    const tableData = stnMonitorDataAndRun4StationData2TableData(
      deviceStdStateMap,
      deviceType,
      stnMonitorDataMap,
      run4Device,
    )
    if (!tableData) return
    setDataSource(tableData)
  }, [stnMonitorDataMap, run4Device, deviceType, deviceStdStateMap])

  const columns = useMemo(() => {
    return crtSiteDetailColumns(deviceStdStateMap, deviceType, true, true, null, siteQuota)
  }, [deviceStdStateMap, deviceType, siteQuota])

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="site-model">
      <div className="site-model-top">
        <RadioButton size="small" options={MAIN_DVS_TYPE} onChange={setDeviceType} />
      </div>
      <CustomTable
        ref={tableRef}
        rowKey="id"
        size="small"
        limitHeight
        loading={false}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  )
})

export default SiteModalList
