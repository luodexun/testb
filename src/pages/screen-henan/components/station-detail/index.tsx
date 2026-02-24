/*
 * @Author: chenmeifeng
 * @Date: 2024-09-18 17:12:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-08 10:27:39
 * @Description:场站详情
 */
import "./index.less"
import HnCommonBox from "../common-box"

import { useAtomValue } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"

import CustomTable from "@/components/custom-table"
import { ICustomTabRef } from "@/components/custom-table/interfaces"
import { MAIN_DVS_TYPE } from "@/configs/option-const"
import { getDvsMainStateList } from "@/hooks/use-matrix-device-list"
import useMonitorStationData from "@/hooks/use-monitor-station-data"
import useRun4deviceData from "@/hooks/use-run-4device-data"
import {
  crtSiteDetailColumns,
  stnMonitorDataAndRun4StationData2TableData,
} from "@/pages/area-index/site-detail/methods"
import { ISiteDetailTableData } from "@/pages/area-index/site-detail/types"
import { AtomConfigMap } from "@/store/atom-config"
import { AtomStnMonitorDataMap } from "@/store/atom-run-station"
import { TDeviceType } from "@/types/i-config"
import ComRadioClk from "../common-radio"
const options = MAIN_DVS_TYPE.map((i) => {
  return {
    name: i.label,
    value: i.value,
  }
})
export default function HnStatinDetail() {
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const [dataSource, setDataSource] = useState<ISiteDetailTableData[]>([])
  const tableRef = useRef<ICustomTabRef>(null)

  const stnMonitorDataMap = useAtomValue(AtomStnMonitorDataMap)
  const { deviceStdStateMap } = useAtomValue(AtomConfigMap).map
  const { run4Device } = useRun4deviceData({ isStart: true })
  useMonitorStationData([deviceType])
  useEffect(() => {
    if (!deviceType) return
    getDvsMainStateList(deviceStdStateMap, deviceType, "MAIN")
    const tableData = stnMonitorDataAndRun4StationData2TableData(
      deviceStdStateMap,
      deviceType,
      stnMonitorDataMap,
      run4Device,
    )
    if (!tableData) return setDataSource([])
    let actualSource = []
    if (tableData?.length) {
      const res = tableData.reduce((prev, cur) => {
        if (!prev[cur.maintenanceComId]) {
          prev[cur.maintenanceComId] = []
        }
        if (prev[cur.maintenanceComId]) {
          prev[cur.maintenanceComId].push(cur)
        }
        return prev
      }, {})
      actualSource = Object.values(res).flat()
    }
    setDataSource(actualSource)
  }, [stnMonitorDataMap, run4Device, deviceType, deviceStdStateMap])

  const columns = useMemo(() => {
    return crtSiteDetailColumns(deviceStdStateMap, deviceType, false, false, dataSource)
  }, [deviceStdStateMap, deviceType, dataSource])

  return (
    <HnCommonBox
      title="场站详情"
      className="hn-stn-detail"
      titleBox={
        <ComRadioClk
          options={options}
          onChange={(e) => {
            setDeviceType(e)
          }}
        />
      }
    >
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
    </HnCommonBox>
  )
}
