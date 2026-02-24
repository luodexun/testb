/*
 * @Author: xiongman
 * @Date: 2023-09-27 10:02:10
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-27 10:02:10
 * @Description: 状态转换-配置数据
 */

import { ColumnsType } from "antd/es/table"

import { IDvsStateTrendData } from "./types.ts"

export const STATE_SWITCH_COLUMNS: ColumnsType<IDvsStateTrendData> = [
  { title: "序号", dataIndex: "index", width: 50 },
  {
    title: "状态",
    dataIndex: "stateLabel",
    render: (value, { color }) => <span style={{ color }}>{value}</span>,
  },
  { title: "开始时间", dataIndex: "startDate" },
  { title: "结束时间", dataIndex: "endDate" },
]
