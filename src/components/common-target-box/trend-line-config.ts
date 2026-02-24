/*
 * @Author: chenmeifeng
 * @Date: 2024-01-31 14:44:17
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-08 17:10:29
 * @Description:
 */
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import TreeSelect from "@/components/custom-tree-select"
import RangeDatePicker from "@/components/range-date-picker"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { INTERVAL_OPTIONS } from "@/configs/option-const"
export const COM_TREND_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]
export const COM_TREND_SCH_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationCode",
    label: "场站",
    props: {
      options: [],
      needFirst: true,
      disabled: false,
      style: { width: "10em" },
    },
  },
  {
    type: TreeSelect,
    name: "points",
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
    name: "groupByTime",
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
