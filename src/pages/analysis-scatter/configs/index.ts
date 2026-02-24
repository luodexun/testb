import { Input } from "antd"
import type { ColumnsType } from "antd/es/table"

import CommonTreeSelect from "@/components/common-tree-select"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import CustomTreeSelect from "@/components/custom-tree-select"
import MinMaxInput from "@/components/min-max-input"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"

export const ANLY_SCTTR_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const ANLY_SCTTR_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: Input,
    name: "displayType",
    formItemProps: { hidden: true },
    props: { disabled: true },
  },
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      needFirst: true,
      style: { minWidth: "13em" },
      options: [],
    },
  },
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "设备类型",
    props: {
      needFirst: true,
      options: [],
      placeholder: "请选择查询类型",
      style: { minWidth: "13em" },
    },
  },
  {
    type: CommonTreeSelect,
    name: "deviceIds",
    label: "设备",
    props: {
      multiple: true,
      options: [],
      placeholder: "-",
      style: { minWidth: "13em" },
    },
  },
  {
    type: CustomTreeSelect,
    name: "devicePointX",
    label: "x轴测点",
    props: {
      treeData: [],
      placeholder: "-",
      autoClearSearchValue: false,
      style: { minWidth: "18em" },
    },
  },
  {
    type: CustomTreeSelect,
    name: "devicePointY",
    label: "y轴测点",
    props: {
      treeData: [],
      placeholder: "-",
      autoClearSearchValue: false,
      style: { minWidth: "18em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    props: { showTime: true },
  },
  {
    type: MinMaxInput,
    name: "xRange",
    label: "x轴范围",
    props: {
      placeholder: "",
      style: { minWidth: "10em" },
    },
  },
  {
    type: MinMaxInput,
    name: "yRange",
    label: "y轴范围",
    props: {
      placeholder: "",
      style: { minWidth: "10em" },
    },
  },
]

export const ANLY_SCTTR_COLUMNS: ColumnsType<any> = [
  { dataIndex: "index", title: "序号", align: "center", width: 80 },
  { dataIndex: "stationName", title: "场站名称", align: "center" },
  { dataIndex: "deviceName", title: "设备名称", align: "center" },
  { dataIndex: "time", title: "时间", align: "center" },
]
