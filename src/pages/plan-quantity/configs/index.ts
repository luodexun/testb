import { StorageStationData } from "@configs/storage-cfg.ts"
import { getStorage } from "@utils/util-funs.tsx"
import { ColumnsType } from "antd/es/table"

import DatePicker from "@/components/custom-date-picker"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import CustomInput from "@/components/custom-input"
import StationTreeSelect from "@/components/station-tree-select"
import { IStationData } from "@/types/i-station.ts"

export const { stationList } = getStorage(StorageStationData) || {}

export const RP_POWER_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "add", label: "新增" },
  { name: "batchRemove", label: "批量删除" },
]

export const RP_POWER_CORRECT_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "export", label: "导出" },
  { name: "import", label: "导入" },
]

export const ACTIONS_TYPE = {
  delete: "删除",
  add: "新增",
  edit: "编辑",
  batchRemove: "批量删除",
}

export const DEFAULT_HEADERS: string[] = ["月份", "实际发电量（kWh）", "计划发电量（kWh）", "计划完成率（%）"]
export const MONTHMAP = {
  0: "一月",
  1: "二月",
  2: "三月",
  3: "四月",
  4: "五月",
  5: "六月",
  6: "七月",
  7: "八月",
  8: "九月",
  9: "十月",
  10: "十一月",
  11: "十二月",
}

export const RP_POWER_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      needFirst: false,
      needId: true,
      disabled: false,
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },

  {
    type: DatePicker,
    name: "year",
    label: "年份",
    props: { picker: "year", style: { minWidth: "13em" } },
  },
]

export const RP_CORRECT_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      needFirst: false,
      disabled: false,
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },

  {
    type: DatePicker,
    name: "year",
    label: "年份",
    props: { picker: "year", style: { minWidth: "13em" } },
  },
]

export const QUANTITY_ADD: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      needFirst: true,
      needId: true,
      disabled: false,
      allowClear: false,
      style: { minWidth: "10em" },
    },
  },

  {
    type: DatePicker,
    name: "year",
    label: "年份",
    props: { picker: "year", allowClear: false, style: { minWidth: "13em" } },
  },
]

export const EDIT_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: CustomInput,
    name: "stationId",
    label: "场站",
    props: {
      disabled: false,
      readOnly: true,
      style: { minWidth: "10em" },
    },
  },

  {
    type: CustomInput,
    name: "year",
    label: "年份",
    props: { readOnly: true, style: { minWidth: "13em" } },
  },
]

export const CONTROL_LOG_COLUMNS: ColumnsType<any> = [
  { title: "序号", align: "center", width: 150, render: (_v, _r, index) => index + 1 },
  {
    dataIndex: "stationName",
    title: "场站",
    align: "center",
  },
  { dataIndex: "year", title: "年份", align: "center" },
]

export const PLAN_CORRECT_TABLE: ColumnsType<any> = [
  { dataIndex: "deviceName", title: "设备名称", align: "center", width: 120 },
  {
    dataIndex: "deviceTypeName",
    title: "设备类型",
    width: 100,
  },
]
