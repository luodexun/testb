

import "./control-batch-table.less"

import { CONTROL_TABLE_TYPE_BUTTON, EXECUTE_LOG, TControlTableType, TIME_STATE } from "@configs/dvs-control.ts"
import usePagination from "@hooks/use-pagination.ts"
import { dealControlLogData } from "@pages/control-log/methods"
import { IControlLogSchForm } from "@pages/control-log/types"
import { AtomConfigMap } from "@store/atom-config.ts"
import AtomRun4DvsData from "@store/atom-run-device.ts"
import { calcRate } from "@utils/device-funs.ts"
import { listPagination } from "@utils/table-funs.tsx"
import { useAtomValue } from "jotai"
import React, { useEffect, useMemo, useRef, useState } from "react"

import CustomTable from "@/components/custom-table"
import TypeButtonGroup from "@/components/type-button-group"
import { TDeviceType } from "@/types/i-config.ts"
import { IDeviceData } from "@/types/i-device.ts"

import { CONTROL_BATCH_COLUMNS_MAP } from "../configs"
import { getBatchCtrlLogData, getPvinvDvsforPvcolDvs } from "../methods/batch-funs.ts"
import { IBatchRealTimeData, TBatchRealTimeTable } from "../types/i-batch.ts"

interface IProps {
  deviceType: TDeviceType
  deviceList: Partial<IDeviceData>[]
}

export default function ControlBatchTable(props: IProps) {
  const { deviceType, deviceList } = props

  //实时状态和执行日志切换
  const [tableType, setTableType] = useState<TControlTableType>(TIME_STATE)
  const [dataSource, setDataSource] = useState<TBatchRealTimeTable[]>([])
  const [loading, setLoading] = useState(false)
  const [pageInfo, setTotal, pagination, setPageInfo] = usePagination()
  const run4Device = useAtomValue(AtomRun4DvsData)
  const { deviceTypeMap, controlTypeMap } = useAtomValue(AtomConfigMap).map
  const unExistType = useRef(["WT", "PVINV", "ESPCS", "PVCOL"])

  const columns = useMemo(() => {
    if (tableType === TIME_STATE) return CONTROL_BATCH_COLUMNS_MAP[tableType][deviceType]
    return CONTROL_BATCH_COLUMNS_MAP[tableType]
  }, [deviceType, tableType])

  const typeButtons = useMemo(() => {
    if (!unExistType.current.includes(deviceType)) {
      return CONTROL_TABLE_TYPE_BUTTON?.filter(({ field }) => field === EXECUTE_LOG)
    }
    return CONTROL_TABLE_TYPE_BUTTON
  }, [deviceType])

  const initSoure = async () => {
    if (tableType === EXECUTE_LOG) return
    console.log(22222, tableType)

    setLoading(true)
    let actualDvsList = []
    // 如果设备类型为PVCOL， 根据选择的数采设备获取光伏逆变器设备
    if (deviceType === "PVCOL") {
      actualDvsList = await getPvinvDvsforPvcolDvs(deviceList)
    } else {
      actualDvsList = deviceList
    }
    const records = listPagination(actualDvsList, pageInfo)
    const dvsType = deviceType === "PVCOL" ? "PVINV" : deviceType
    const dvsDataList = records.map((item) => {
      const dvsRunData = run4Device[dvsType]?.[item.deviceCode]
      return {
        id: item.deviceCode,
        deviceTypeLabel: deviceTypeMap[item.deviceType],
        rate: calcRate(dvsRunData?.activePower, item.ratedPower),
        ...item,
        ...(dvsRunData || {}),
      }
    })
    setTotal(deviceList?.length ?? 0)
    setDataSource(dvsDataList as IBatchRealTimeData[])
    setLoading(false)
  }
  useEffect(() => {
    setPageInfo((prevState) => ({ ...prevState, current: 1 }))
    setTotal(0)
    setDataSource([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableType])
  useEffect(() => {
    if (!unExistType.current.includes(deviceType)) {
      setTableType("execute-log")
    }
  }, [deviceType])

  useEffect(() => {
    initSoure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceList, deviceType, deviceTypeMap, pageInfo, run4Device, tableType])

  const timerFlag = useRef(0)

  useEffect(() => {
    if (tableType === TIME_STATE || !deviceList?.length) return
    setLoading(true)
    window.clearTimeout(timerFlag.current)
    timerFlag.current = window.setTimeout(async () => {
      const params: IControlLogSchForm = { deviceType, deviceIds: deviceList.map(({ deviceId }) => deviceId) }
      const { records, total } = (await getBatchCtrlLogData(pageInfo, params)) || {}
      setTotal(total ?? 0)
      setDataSource(dealControlLogData(records, controlTypeMap, deviceTypeMap))
      setLoading(false)
    }, 400)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => window.clearTimeout(timerFlag.current)
  }, [deviceList, deviceType, pageInfo, tableType])

  return (
    <div className="control-batch-table">
      <TypeButtonGroup buttons={typeButtons} onChange={setTableType} />
      <CustomTable
        rowKey="id"
        limitHeight
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
      />
    </div>
  )
}
