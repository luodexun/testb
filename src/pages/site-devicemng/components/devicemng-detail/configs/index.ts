/*
 *@Author: chenmeifeng
 *@Date: 2024-04-07 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 11:02:00
 *@Description:
 */

import { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

import { StorageStationData } from "@/configs/storage-cfg"
import { getStorage } from "@/utils/util-funs"

export const stationAllInfo = getStorage(StorageStationData)

export const CONTROL_GRID_COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  {
    dataIndex: "stationCode",
    title: "场站",
    align: "center",
    render: (text, record) => stationAllInfo.stationMap[record.stationCode]?.shortName,
  },
  { dataIndex: "deviceTypeName", title: "设备类型", align: "center" },
  { dataIndex: "deviceName", title: "设备", align: "center" },
  { dataIndex: "controlTypeName", title: "控制指令", align: "center" },
  { dataIndex: "targetValue", title: "控制值", align: "center" },
  { dataIndex: "reResult", title: "返回结果", align: "center" },
  { dataIndex: "operatorBy", title: "执行人", align: "center" },
  { dataIndex: "authorizerBy", title: "监护人", align: "center" },
  {
    dataIndex: "operatorTime",
    title: "执行时间",
    align: "center",
    render: (text, record) => (record.operatorTime ? dayjs(record.operatorTime).format("YYYY-MM-DD HH:mm:ss") : ""),
  },
]
