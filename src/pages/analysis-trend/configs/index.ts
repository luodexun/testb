/*
 * @Author: chenmeifeng
 * @Date: 2024-01-17 17:51:36
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-06 10:48:58
 * @Description:
 */
import { INTERVAL_OPTIONS, POLYMER_OPTIONS } from "@configs/option-const.tsx"
import { Input } from "antd"

import CommonTreeSelect from "@/components/common-tree-select"
import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import TreeSelect from "@/components/custom-tree-select"
import RangeDatePicker from "@/components/range-date-picker"
import SelectOrdinary from "@/components/select-ordinary"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
export const ANLY_TREND_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "export", label: "导出" },
  { name: "contract", label: "对比分析" },
]
export const AL_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "export", label: "导出" },
  { name: "template", label: "模板选择" },
  { name: "saveTemplate", label: "保存模版" },
  { name: "maxmin", label: "最值查看" },
  { name: "ymaxmin", label: "设置y轴范围" },
]
export const ANLY_TREND_SCH_ITEMS: ISearchFormProps["itemOptions"] = [
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
      autoClearSearchValue: false,
      placeholder: "-",
      style: { minWidth: "13em" },
    },
  },
  {
    type: TreeSelect,
    name: "devicePoint",
    label: "测点",
    props: {
      treeData: [],
      placeholder: "-",
      treeCheckable: true,
      autoClearSearchValue: false,
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
    type: SelectWithAll,
    name: "func",
    label: "聚合方式",
    props: {
      options: POLYMER_OPTIONS,
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
export const ANLY_CONTRACT_TREND_SCH_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectOrdinary,
    name: "deviceType",
    label: "设备类型",
    props: {
      allowClear: false,
      options: [],
      placeholder: "请选择查询类型",
      style: { minWidth: "13em" },
    },
  },
  {
    type: TreeSelect,
    name: "deviceIds",
    label: "设备",
    props: {
      treeData: [],
      treeCheckable: true,
      autoClearSearchValue: false,
      treeCheckStrictly: false,
      placeholder: "-",
      style: { minWidth: "13em" },
    },
  },
  {
    type: TreeSelect,
    name: "devicePoint",
    label: "测点",
    props: {
      treeData: [],
      placeholder: "-",
      treeCheckable: true,
      autoClearSearchValue: false,
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
    type: SelectWithAll,
    name: "func",
    label: "聚合方式",
    props: {
      options: POLYMER_OPTIONS,
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
