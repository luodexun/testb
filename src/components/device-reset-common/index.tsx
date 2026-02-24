/*
 * @Author: chenmeifeng
 * @Date: 2024-04-08 15:24:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-09 09:34:22
 * @Description: 复位校验组件
 */
import "./index.less"

import { Button, Space } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"

import CustomTable from "../custom-table"
import { IControlParamMap } from "../device-control/types"
import { DV_RESET_COLUMNS } from "./configs"
import { IResetTable } from "./types"
export interface IDvsRstRef {}
export interface IDvsRstProps {
  data: IControlParamMap["executeInfo"]
  buttonClick?: (type: "part" | "all" | "cancel", deviceIds: { deviceIds: string; deviceName: string }) => void
}
const DeviceResetCom = forwardRef<IDvsRstRef, IDvsRstProps>((props, ref) => {
  const { data, buttonClick } = props
  const [dataSource, setDataSource] = useState<IResetTable[]>([])
  const [loading, setLoading] = useState(true)
  const getResetVerify = async () => {
    const result = await doBaseServer("resetVarify", { params: { deviceIds: data?.deviceIds } })
    if (validResErr(result)) return

    const list = data?.deviceIds?.split(",")?.map((i, idx) => {
      return {
        index: idx + 1,
        deviceId: i,
        deviceName: data.deviceName?.split(",")?.[idx],
        stationName: data.stationName,
        resetType: result?.[i],
      }
    })
    setDataSource(list)
    setLoading(false)
  }
  const operateBtn = (type) => {
    let deviceIds = data?.deviceIds
    let deviceName = data?.deviceName
    if (type === "part") {
      deviceIds = dataSource
        ?.filter((i) => i.resetType)
        ?.map((item) => item.deviceId)
        ?.join(",")
      deviceName = dataSource
        ?.filter((i) => i.resetType)
        ?.map((item) => item.deviceName)
        ?.join(",")
    }
    buttonClick?.(type, { deviceIds, deviceName })
  }
  useEffect(() => {
    getResetVerify()
  }, [data])

  useImperativeHandle(ref, () => () => {})
  return (
    <div className="dv-reset">
      <CustomTable
        rowKey="deviceId"
        limitHeight
        columns={DV_RESET_COLUMNS}
        dataSource={dataSource}
        pagination={false}
      />
      <div className="dv-reset-bottom">
        <Space size={"large"}>
          <Button disabled={loading} size={"large"} onClick={() => operateBtn("part")}>
            满足条件机组复位
          </Button>
          <Button disabled={loading} size={"large"} onClick={() => operateBtn("all")}>
            强制全部机组复位
          </Button>
          <Button size={"large"} onClick={() => operateBtn("cancel")}>
            取消
          </Button>
        </Space>
      </div>
    </div>
  )
})
export default DeviceResetCom
