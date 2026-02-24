/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 15:14:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-19 15:38:04
 * @Description: 告警分组配置文件
 */
import { isNumber } from "ahooks/es/utils"
import { ColumnsType } from "antd/es/table"

import { ITbColAction } from "@/components/action-buttons/types"
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import { MAIN_DVS_TYPE } from "@/configs/option-const"
import { day4Y2S } from "@/configs/time-constant"
import { getTableActColumn } from "@/utils/table-funs"
import { uDate } from "@/utils/util-funs"

import { setAlarmColor } from "../methods"
import { IAlarmMgData, TAlarmmergeTbActInfo } from "../types"
const GROUPTYPE = [
  { label: "按首发故障分组", value: 1 },
  { label: "按设备故障点分组", value: 2 },
]
const SORTTYPE = [
  { label: "按故障发生时间降序", value: 1 },
  { label: "按故障发生次数降序", value: 2 },
]
const TABLE_ACTION = [
  { key: "ensure", label: "确认" },
  { key: "detail", label: "详情" },
]
export const AL_MERGE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "export", label: "导出" },
  { name: "batchCmomfirm", label: "批量确认" },
]
export const ALARM_MERGE_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "查询类型",
    props: {
      needFirst: true,
      disabled: false,
      options: MAIN_DVS_TYPE,
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "groupType",
    label: "分组类型",
    props: {
      needFirst: true,
      disabled: false,
      options: GROUPTYPE,
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "sortType",
    label: "查询类型",
    props: {
      needFirst: true,
      disabled: false,
      options: SORTTYPE,
      style: { minWidth: "10em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    props: {
      showTime: true,
      presets: false,
      style: { width: "32.2em" },
    },
  },
]

export function ALARM_MERGE_COLUMNS(
  config: ITbColAction<TAlarmmergeTbActInfo, IAlarmMgData>,
): ColumnsType<IAlarmMgData> {
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
      // width: 400,
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
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    {
      dataIndex: "alarmNum",
      title: "故障次数",
      render: (text, record) => <span style={{ color: setAlarmColor(record) }}>{text}</span>,
    },
    // { dataIndex: "deviceName", title: "操作人" }, // 没有字段
    ...getTableActColumn<IAlarmMgData, TAlarmmergeTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
        // 已处理和误报状态不能处理
        buttonProps: {
          ensure: {
            disabled: record.confirmFlag || record.alarmLevelId === "3" || record.alarmLevelId === "15",
          },
        },
      }),
      null,
      { width: 150 },
    ),
  ]
}
