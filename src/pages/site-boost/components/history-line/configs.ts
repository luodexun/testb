/*
 * @Author: chenmeifeng
 * @Date: 2024-04-23 17:11:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-31 17:30:43
 * @Description:
 */
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import TreeSelect from "@/components/custom-tree-select"
import { INTERVAL_OPTIONS } from "@/configs/option-const"

export const SVG_HISTORY_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "export", label: "导出" },
  { name: "maxmin", label: "最值查看" },
  { name: "ymaxmin", label: "设置y轴范围" },
]

export const SVG_HISTORY_SCH_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: TreeSelect,
    name: "devicePoint",
    label: "测点",
    props: {
      treeData: [],
      placeholder: "-",
      treeCheckable: true,
      treeCheckStrictly: false,
      style: { minWidth: "18em" },
    },
  },
  {
    type: SelectWithAll,
    name: "timeInterval",
    label: "刻度间隔",
    props: {
      options: INTERVAL_OPTIONS,
      placeholder: "-",
      style: { minWidth: "13em" },
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
