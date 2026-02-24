/*
 * @Author: chenmeifeng
 * @Date: 2023-10-26 17:41:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-18 11:31:40
 * @Description:
 */

import { TIME_OPTIONS } from "@configs/option-const.tsx"
import { ColumnsType } from "antd/es/table"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { day4Y2S } from "@/configs/time-constant"
import { parseNum, uDate } from "@/utils/util-funs"

export const RP_POWER_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const RP_POWER_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationCodeList",
    label: "场站",
    props: {
      disabled: false,
      multiple: true,
      placeholder: "全部",
      style: { minWidth: "13em" },
    },
  },
  {
    type: SelectWithAll,
    name: "timeInterval",
    label: "间隔时间",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      needFirst: true,
      options: TIME_OPTIONS,
      placeholder: "请选择统计周期",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "gatewayType",
    label: "电表类型",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      placeholder: "请选择统计对象",
      needFirst: true,
      options: [
        { label: "全部", value: 0 },
        { label: "关口表", value: 1 },
        { label: "非关口表", value: 2 },
      ],
      style: { minWidth: "10em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    // formItemProps: { labelCol: { span: 8 } },
    props: { showTime: true, style: { width: "28em" } },
  },
]

export const CONTROL_LOG_COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  { dataIndex: "stationName", title: "场站名称", align: "center" },
  { dataIndex: "meterName", title: "电表名称", align: "center" },
  {
    dataIndex: "forwardActivePower",
    title: "正向有功(kWh)",
    align: "center",
    render: (text) => parseNum(text, 4, null),
  },
  { dataIndex: "backActivePower", title: "反向有功(kWh)", align: "center", render: (text) => parseNum(text, 4, null) },
  {
    dataIndex: "forwardReactivePower",
    title: "正向无功(kVar)",
    align: "center",
    render: (text) => parseNum(text, 4, null),
  },
  {
    dataIndex: "backReactivePower",
    title: "反向无功(kVar)",
    align: "center",
    render: (text) => parseNum(text, 4, null),
  },
  { dataIndex: "time", title: "时间", align: "center", render: (text) => uDate(text, day4Y2S) },
]
