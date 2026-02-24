/*
 * @Author: xiongman
 * @Date: 2023-11-09 15:30:55
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-04 14:08:00
 * @Description: 事故追忆-配置数据们
 */

import CustomDatePicker from "@/components/custom-date-picker"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import CustomTreeSelect from "@/components/custom-tree-select"
import SelectWithAll from "@/components/select-with-all"
// import StationSelect from "@/components/station-select"
import StationTreeSelect from "@/components/station-tree-select"
import { TOptions } from "@/types/i-antd.ts"
import { TreeSelect } from "antd"

export const IMG_NAME_OPTIONS: TOptions<string> = [{ value: "main", label: "主接线图" }]

export const CRASH_TRACK_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationInfo",
    label: "场站",
    formItemProps: { required: false, rules: [{ required: true }] },
    props: { needFirst: true },
  },
  {
    type: SelectWithAll,
    name: "imgName",
    label: "接线图",
    formItemProps: { required: false, rules: [{ required: true }] },
    props: { options: IMG_NAME_OPTIONS },
  },
  // {
  //   type: TreeSelect,
  //   name: "devicePoint",
  //   label: "事故测点",
  //   formItemProps: { required: false, rules: [{ required: true, message: "请选择测点" }] },
  //   props: {
  //     treeData: [],
  //     placeholder: "-",
  //     treeCheckable: true,
  //     autoClearSearchValue: false,
  //     style: { minWidth: "18em" },
  //   },
  // },
  {
    type: CustomDatePicker,
    name: "dateTime",
    label: "时间",
    formItemProps: { required: false, rules: [{ required: true, message: "请选择时间" }] },
    props: { showTime: true, placeholder: "查询1小时的数据" },
  },
]

export const CRASH_TRACK_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]
