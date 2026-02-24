/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 16:42:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-19 15:39:25
 * @Description:
 */
import { isNumber } from "ahooks/es/utils"
import { ColumnsType } from "antd/es/table"

import { ITbColAction } from "@/components/action-buttons/types"
import { day4Y2S } from "@/configs/time-constant"
import { getTableActColumn } from "@/utils/table-funs"
import { uDate } from "@/utils/util-funs"

import { setAlarmColor } from "../methods"
import { TAlarmmergeTbActInfo } from "../types"
import { IAlMgDataInfo } from "../types/detail"
const TABLE_ACTION = [{ key: "ensure", label: "确认" }]
export function ALARM_MERGE_DETAIL_COLUMNS(
  config: ITbColAction<TAlarmmergeTbActInfo, IAlMgDataInfo>,
): ColumnsType<IAlMgDataInfo> {
  const { onClick } = config
  return [
    {
      dataIndex: "index",
      title: "序号",
      width: 60,
      align: "center",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "stationDesc",
      title: "场站",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "deviceTypeName",
      title: "设备类型",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "deviceDesc",
      title: "设备名称",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmId",
      title: "故障码",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmDesc",
      title: "故障描述",
      width: 400,
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "systemName",
      title: "归属系统",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmLevelName",
      title: "告警等级",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "brakeLevelName",
      title: "停机等级",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "startTime",
      title: "故障开始时间",
      render: (text, record) => (
        <span style={{ color: setAlarmColor(record) }}>{isNumber(text) ? uDate(text, day4Y2S) : text}</span>
      ),
    },
    {
      dataIndex: "endTime",
      title: "故障结束时间",
      render: (text, record) => (
        <span style={{ color: setAlarmColor(record) }}>{isNumber(text) ? uDate(text, day4Y2S) : text}</span>
      ),
    },
    {
      dataIndex: "confirmBy",
      title: "确认人",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "confirmTime",
      title: "确认时间",
      render: (text, record) => (
        <span style={{ color: setAlarmColor(record) }}>{isNumber(text) ? uDate(text, day4Y2S) : text}</span>
      ),
    },
    {
      dataIndex: "confirmMsg",
      title: "备注",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    // { dataIndex: "deviceName", title: "操作人" }, // 没有字段
    ...getTableActColumn<IAlMgDataInfo, TAlarmmergeTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          ensure: {
            disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15,
          },
        },
      }),
      null,
      { width: 150 },
    ),
  ]
}
