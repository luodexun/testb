/*
 * @Author: chenmeifeng
 * @Date: 2024-08-26 10:06:33
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-18 11:29:07
 * @Description:
 */
import { ColumnsType } from "antd/es/table"
import dayjs from "dayjs"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageStationData } from "@/configs/storage-cfg"
import { day4Y2S } from "@/configs/time-constant"
import { getStorage, parseNum, uDate } from "@/utils/util-funs"
import CommonTreeSelect from "@/components/common-tree-select"
import SelectOrdinary from "@/components/select-ordinary"
export const RP_DEVICE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const RP_DEVICE_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      needId: true,
      disabled: false,
      multiple: false,
      placeholder: "",
      style: { minWidth: "13em" },
      // allowClear: false,
    },
  },
  {
    type: SelectOrdinary,
    name: "deviceType",
    label: "设备类型",
    props: {
      disabled: false,
      options: [],
      placeholder: "",
      style: { minWidth: "10em" },
    },
  },
  {
    type: CommonTreeSelect,
    name: "deviceCode",
    label: "设备",
    props: {
      needFirst: true,
      disabled: false,
      placeholder: "",
      style: { minWidth: "10em" },
      multiple: true,
      treeCheckable: true,
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    // formItemProps: { labelCol: { span: 3 } },
    props: {
      showTime: true,
      style: { width: "22em" },
      // disabledDate: (current) => {
      //   return current && current.isAfter(dayjs(), "day")
      // },
    },
  },
]
export const REPORT_DEVICE_COLUMNS1: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  { dataIndex: "stationName", title: "场站", align: "center" },
  // { dataIndex: "ruleName", title: "设备类型", align: "center" },
  { dataIndex: "deviceName", title: "设备", align: "center" },
  { dataIndex: "dailyProduction", title: "发电量(kWh)", align: "center", render: (text) => parseNum(text, 2, null) },
  {
    dataIndex: "theoryProduction ",
    title: "理论发电量(kWh)",
    align: "center",
    render: (text) => parseNum(text, 2, null),
  },
  {
    dataIndex: "totalLossProduction",
    title: "损失电量(kWh)",
    align: "center",
    render: (text) => parseNum(text, 2, null),
  },
  { dataIndex: "startFormatTime", title: "开始时间", align: "center" },
  { dataIndex: "endFormatTime", title: "结束时间", align: "center" },
]
export const REPORT_DEVICE_COLUMNS2: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  { dataIndex: "stationName", title: "场站", align: "center" },
  // { dataIndex: "ruleName", title: "设备类型", align: "center" },
  { dataIndex: "deviceName", title: "设备", align: "center" },
  { dataIndex: "dailyCharge", title: "充电量(kWh)", align: "center", render: (text) => parseNum(text, 2, null) },
  { dataIndex: "dailyDischarge", title: "放电量(kWh)", align: "center", render: (text) => parseNum(text, 2, null) },
  { dataIndex: "startFormatTime", title: "开始时间", align: "center" },
  { dataIndex: "endFormatTime", title: "结束时间", align: "center" },
]
export const REPORT_DEVICE_COLUMNS3: ColumnsType<any> = [
  { title: "序号", align: "center", width: 100, render: (text, record, index) => index + 1 },
  { dataIndex: "stationName", title: "场站", align: "center" },
  // { dataIndex: "ruleName", title: "设备类型", align: "center" },
  { dataIndex: "deviceName", title: "设备", align: "center" },
  { dataIndex: "windSpeed", title: "风速(m/s)", align: "center", render: (text) => parseNum(text, 4, null) },
  { dataIndex: "dailyProduction", title: "发电量(kWh)", align: "center", render: (text) => parseNum(text, 2, null) },
  {
    dataIndex: "theoryProduction",
    title: "理论发电量(kWh)",
    align: "center",
    render: (text) => parseNum(text, 2, null),
  },
  {
    dataIndex: "totalLossProduction",
    title: "损失电量(kWh)",
    align: "center",
    render: (text) => parseNum(text, 2, null),
  },
  { dataIndex: "startFormatTime", title: "开始时间", align: "center" },
  { dataIndex: "endFormatTime", title: "结束时间", align: "center" },
]
export const CONTROL_DEFAULT_TYPE = {
  WT: "风机",
  PVINV: "光伏逆变器",
  ESPCS: "储能变流器系统",
  // SYZZZ: "升压站",
}

export const CONTROL_OPTION = [
  { label: "风机", value: "WT" },
  { label: "光伏逆变器", value: "PVINV" },
  { label: "储能变流器系统", value: "ESPCS" },
]
