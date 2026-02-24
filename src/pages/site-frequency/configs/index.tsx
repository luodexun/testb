/*
 * @Author: chenmeifeng
 * @Date: 2024-07-15 16:56:25
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-11 10:30:28
 * @Description:
 */
import { Switch } from "antd"
import { ColumnsType } from "antd/es/table"

import { ITbColAction } from "@/components/action-buttons/types"
import PointText from "@/components/trend-line-by-dvs/text"
import { IDvsRunStateInfo } from "@/configs/dvs-state-info"
import { UNIT } from "@/configs/text-constant"
import { IAgvcInfo } from "@/types/i-agvc"
import { IDeviceData } from "@/types/i-device"
import { judgeNull } from "@/utils/util-funs"

import { IFieldsOption, IFrequencyInfo } from "../types"

export function SIT_DEVICE_COLUMNS(config): ColumnsType<IDeviceData> {
  const { onClick, openCtl } = config
  return [
    { dataIndex: "row_idx", title: "序号", align: "center", width: 70 },
    {
      dataIndex: "deviceName",
      title: "设备名称",
      render: (text, record) => (
        <span style={{ cursor: "pointer" }} onClick={() => onClick(record, text)}>
          {record.deviceName}
        </span>
      ),
    },
    {
      dataIndex: "YCTP_OutputActivePower",
      title: "执行目标值（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="YCTP_OutputActivePower" />,
    },
    {
      dataIndex: "AGCActivePowerSet",
      title: "AGC目标值（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="AGCActivePowerSet" />,
    },
    {
      dataIndex: "ActivePowerOfSubStation",
      title: "有功功率（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="ActivePowerOfSubStation" />,
    },
    {
      dataIndex: "AdditionalActivePower",
      title: "实时可增（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="AdditionalActivePower" />,
    },
    {
      dataIndex: "DecreaseActivePower",
      title: "实时可减（MW）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="DecreaseActivePower" />,
    },
    {
      dataIndex: "SystemFreq",
      title: "实时频率（Hz）",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="SystemFreq" />,
    },
    {
      dataIndex: "YCTP_Inputstatus",
      title: "投入状态",
      align: "center",
      render: (value, record) => (
        <div className="status-switch">
          <Switch
            defaultValue={record["YCTP_Inputstatus"] || false}
            value={record["YCTP_Inputstatus"] || false}
            onChange={() => openCtl("YCTP_Inputstatus", record)}
          />
          <span className={`com ${value ? "com-act" : "com-unact"}`}>{value ? "投入" : "退出"}</span>
        </div>
      ),
    },
  ]
}
export const AGCChartSeries: IFieldsOption<keyof IFrequencyInfo, string>[] = [
  { title: "执行目标值", field: "YCTP_OutputActivePower", unit: UNIT.POWER, yAxisIndex: 0, caculate: 1 },
  { title: "AGC目标值", field: "AGCActivePowerSet", unit: UNIT.POWER, yAxisIndex: 0, caculate: 1 },
  { title: "有功功率", field: "ActivePowerOfSubStation", unit: UNIT.POWER, yAxisIndex: 0, caculate: 1 },
  { title: "实时可增", field: "AdditionalActivePower", unit: UNIT.POWER, yAxisIndex: 0, caculate: 1 },
  { title: "实时可减", field: "DecreaseActivePower", unit: UNIT.POWER, yAxisIndex: 0, caculate: 1 },
  // { title: "调度负荷", field: "SystemFreq", unit: UNIT.POWER, yAxisIndex: 0, caculate: 1 },
  { title: "实时频率", field: "SystemFreq", unit: UNIT.FREQUENCY, yAxisIndex: 1, caculate: 1 },
]
