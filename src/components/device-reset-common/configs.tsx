/*
 * @Author: chenmeifeng
 * @Date: 2024-04-08 15:31:50
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-08 16:57:12
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import { IResetTable } from "./types"

export const DV_RESET_COLUMNS: ColumnsType<IResetTable> = [
  { dataIndex: "index", title: "序号", align: "center", width: 50 },
  { dataIndex: "stationName", title: "场站" },
  { dataIndex: "deviceName", title: "设备名称" },
  {
    dataIndex: "resetType",
    title: "复位条件",
    render: (text) =>
      text ? <div style={{ color: "#0CAC31" }}>满足</div> : <div style={{ color: "#FF0000" }}>不满足</div>,
  },
]
