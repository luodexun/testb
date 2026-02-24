import { numberVal } from "@utils/util-funs.tsx"
import { ColumnsType } from "antd/es/table"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
export const FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]
import { dayY2D } from "@/configs/time-constant"
import { uDate } from "@/utils/util-funs"

import { getDeviceMap } from "../methods"
export const TREE_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "queryType",
    label: "查询类型",
    props: {
      needFirst: true,
      allowClear: false,
      style: { minWidth: "5em" },
      options: [
        {
          label: "风",
          value: "w",
        },
      ],
    },
  },
  {
    type: SelectWithAll,
    name: "timeType",
    label: "",
    props: {
      needFirst: true,
      allowClear: false,
      options: [
        {
          label: "单机多时间段查询",
          value: 0,
        },
        {
          label: "多机单时间段查询",
          value: 1,
        },
      ],
      placeholder: "请选择",
      style: { minWidth: "12em" },
    },
  },
]
export const FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    props: { showTime: true },
    // type: RangeDatePicker,
    // name: "dateRange",
    // label: "时间",
    // props: {
    //   presets: true,
    //   disabled: false,
    //   picker: "date",
    //   format: dayY2D,
    //   style: { width: "30em" },
    // },
  },
]

export const COLUMNS: ColumnsType<any> = [
  { dataIndex: "index", title: "序号", align: "center", width: 100 },
  {
    dataIndex: "deviceCode",
    title: "场站名称",
    align: "center",
    render: (text) => {
      const { stationName } = getDeviceMap(text)
      return stationName
    },
  },
  {
    dataIndex: "deviceCode",
    title: "设备名称",
    align: "center",
    render: (text) => {
      const { deviceName } = getDeviceMap(text)
      return deviceName
    },
  },
  {
    dataIndex: "windSpeed",
    title: "比恩风速（m/s）",
    align: "center",
  },
  {
    dataIndex: "activePower",
    title: "统计功率（kW）",
    align: "center",
    render: (text, row) => {
      return numberVal(text)
    },
  },
  {
    dataIndex: "standardActivePower",
    title: "标准空气密度有功功率（kW）",
    align: "center",
    width: 200,
    render: (text, row) => {
      return numberVal(text)
    },
  },
  {
    dataIndex: "actualActivePower",
    title: "实际空气密度有功功率（kW）",
    align: "center",
    width: 200,
    render: (text, row) => {
      return numberVal(text)
    },
  },
  {
    dataIndex: "startTime",
    title: "开始时间",
    align: "center",
    render: (text) => {
      if (!text) return ""
      return uDate(text, dayY2D)
    },
  },
  {
    dataIndex: "endTime",
    title: "结束时间",
    align: "center",
    render: (text) => {
      if (!text) return ""
      return uDate(text, dayY2D)
    },
  },
]
