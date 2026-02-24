/*
 * @Author: xiongman
 * @Date: 2023-09-27 10:02:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-30 17:01:57
 * @Description: 故障报警信息-配置数据
 */

import { ColumnsType } from "antd/es/table"

import { IDvsAlarmData } from "./types.ts"

export const FAULT_ALARM_COLUMNS: ColumnsType<IDvsAlarmData> = [
  { title: "故障开始时间", dataIndex: "startTime", width: 150, align: "center" },
  { title: "故障结束时间", dataIndex: "endTime", width: 150, align: "center" },
  { title: "故障码", dataIndex: "alarmId", width: 60, align: "center" },
  { title: "故障描述", dataIndex: "alarmDesc", align: "center" },
  { title: "是否确认", dataIndex: "confirmLabel", width: 80, align: "center" },
]
