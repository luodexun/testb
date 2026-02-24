/*
 *@Author: chenmeifeng
 *@Date: 2024-03-29 17:30:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-03 10:53:00
 *@Description:
 */
import { ColumnsType } from "antd/es/table"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import { TOptions } from "@/types/i-antd.ts"
import { TDeviceType } from "@/types/i-config.ts"

import { dealTime } from "../methods"

export const CONTROL_SELECT: TOptions<TDeviceType> = [
  { label: "风机", value: "WT" },
  { label: "光伏逆变器", value: "PVINV" },
  { label: "储能变流器", value: "ESPCS" },
]
export const ALARM_ANALYSE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]
export const ALARM_ANALYSE_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "查询类型",
    props: {
      needFirst: true,
      disabled: false,
      options: CONTROL_SELECT,
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

export const ALARM_ANALYSE_COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  { dataIndex: "stationDesc", title: "场站", align: "center" },
  { dataIndex: "deviceModel", title: "型号", align: "center" },
  { dataIndex: "deviceId", title: "设备ID", align: "center" },
  { dataIndex: "deviceDesc", title: "设备", align: "center" },
  { dataIndex: "parentClass", title: "父类", align: "center" },
  { dataIndex: "childClass", title: "子类", align: "center" },
  { dataIndex: "alarmCount", title: "累计告警次数", align: "center" },
  {
    dataIndex: "firstTriggerTime",
    title: "首次触发时间",
    align: "center",
    render: (_, record) => dealTime(record.firstTriggerTime),
  },
  {
    dataIndex: "lastTriggerTime",
    title: "末次触发时间",
    align: "center",
    render: (_, record) => dealTime(record.lastTriggerTime),
  },
  { dataIndex: "confirmCount", title: "累计确认次数", align: "center" },
  {
    dataIndex: "firstConfirmTime",
    title: "首次确认时间",
    align: "center",
    render: (_, record) => dealTime(record.firstConfirmTime),
  },
  {
    dataIndex: "lastConfirmTime",
    title: "末次确认时间",
    align: "center",
    render: (_, record) => dealTime(record.lastConfirmTime),
  },
]
