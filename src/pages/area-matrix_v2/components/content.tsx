/*
 * @Author: chenmeifeng
 * @Date: 2024-12-09 16:58:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-05 10:46:22
 * @Description: 矩阵监视主体
 */
import { Spin } from "antd"
import { useAtomValue } from "jotai"
import { useContext, useEffect, useMemo, useState } from "react"

import DvsDetailContext from "@/contexts/dvs-detail-context"
import useRun4deviceData from "@/hooks/use-run-4device-data"
import { AtomConfigMap } from "@/store/atom-config"
import { IDeviceData } from "@/types/i-device"
import { queryDevicesByParams } from "@/utils/device-funs"

import MatrixStnContent from "./matrix-content"
import MatrixTop from "./matrix-top"
export default function MatrixContent() {
  const [deviceList, setDeviceList] = useState<IDeviceData[]>([])
  const [loading, setLoading] = useState(false)
  const { deviceType } = useContext(DvsDetailContext)
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const runParams = useMemo(() => {
    return { isStart: true, deviceTypeList: [deviceType] }
  }, [deviceType])
  const { run4Device } = useRun4deviceData(runParams)
  const realtimeDvsData = useMemo(() => {
    // if (!run4Device?.[deviceType] || !Object.keys(run4Device?.[deviceType])?.length) return deviceList
    return deviceList.map((i) => {
      const runData = run4Device?.[deviceType]?.[i.deviceCode]
      return {
        ...i,
        // runData: test.includes(i.deviceCode) ? { mainState: "1", mainStateStyle: { color: "rgb(52, 197, 55)" } } : null,
        runData: {
          ...runData,
          mainState: runData?.subState == 15 ? "6" : runData?.mainState || "6", // 旧状态： 将无数据返回和状态码15的计入无通讯数量
          // mainState: runData?.mainState || (deviceType === "WT" ? "7" : "6"), // 新状态
        },
      }
    })
  }, [deviceList, run4Device, deviceType])
  const getDvsLs = async () => {
    setLoading(true)
    const res = await queryDevicesByParams({ deviceType }, deviceTypeMap)
    setDeviceList(res)
    setLoading(false)
  }
  useEffect(() => {
    getDvsLs()
  }, [deviceType])
  return (
    <Spin spinning={loading} wrapperClassName="l-full">
      <div className="area-matrix">
        <MatrixTop realtimeDvsData={realtimeDvsData} />
        <MatrixStnContent realtimeDvsData={realtimeDvsData} />
      </div>
    </Spin>
  )
}
