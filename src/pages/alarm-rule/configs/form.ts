/*
 * @Author: chenmeifeng
 * @Date: 2024-09-09 10:37:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-05 14:49:27
 * @Description:
 */
import { ISearchFormProps } from "@/components/custom-form/types"
import CustomInput from "@/components/custom-input"
import CustomInputNumber from "@/components/custom-input-number"
import SelectWithAll from "@/components/select-with-all"
import CalculateItem from "../components/edit-rule/calculate-itemV2"
import CustomTextInput from "@/components/custom-input/textarea"

export const CAL_OPTION = [
  { label: "大于", value: ">" },
  { label: "小于", value: "<" },
  { label: "等于", value: "=" },
]
export const YAOXIN_OPTION = [
  { label: "是", value: "1" },
  { label: "否", value: "0" },
]
export const RELATION_CAL_OPTION = [
  { label: "或", value: "||" },
  { label: "且", value: "&&" },
]
export const RULE_EDIT_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "alarmLevelId",
    label: "告警等级",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [],
      placeholder: "",
      style: { minWidth: "8em" },
    },
  },
  {
    type: SelectWithAll,
    name: "systemId",
    label: "归属系统",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      // needFirst: true,
      disabled: false,
      // showAll: true,
      options: [],
      placeholder: "",
      style: { minWidth: "8em" },
    },
  },
  {
    type: CustomInputNumber,
    name: "calPeriod",
    label: "计算周期",
    formItemProps: { rules: [{ required: true, message: "请输入计算周期" }] },
    props: {
      disabled: false,
      suffix: "S",
      min: 1,
      style: { minWidth: "8em" },
    },
  },
  {
    type: CustomInputNumber,
    name: "lifeCycle",
    label: "生命周期",
    formItemProps: { rules: [{ required: true, message: "请输入生命周期" }] },
    props: {
      disabled: false,
      suffix: "S",
      style: { minWidth: "8em" },
      min: 3,
    },
  },
  {
    type: CustomTextInput,
    name: "alarmDesc",
    label: "告警描述:",
    formItemProps: { labelCol: { span: 24 }, layout: "vertical", className: "row1" },
    props: {
      autoSize: { minRows: 2, maxRows: 6 },
      disabled: false,
    },
  },
  {
    type: CalculateItem,
    name: "alarmRule",
    label: "自定义告警规则",
    formItemProps: { layout: "vertical", className: "row1", rules: [{ required: true, message: "请输入规则" }] },
  },
  {
    type: SelectWithAll,
    name: "enableFlag",
    label: "是否启用",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      needFirst: true,
      disabled: false,
      // showAll: true,
      allowClear: false,
      options: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      style: { minWidth: "8em" },
    },
  },
  {
    type: SelectWithAll,
    name: "actionFlag",
    label: "告警触发是否关联停机操作",
    // formItemProps: { labelCol: { span: 8 } },
    props: {
      needFirst: true,
      disabled: false,
      // showAll: true,
      allowClear: false,
      options: [
        { label: "不关联", value: 0 },
        { label: "关联", value: 1 },
      ],
      style: { minWidth: "8em" },
    },
  },
]
