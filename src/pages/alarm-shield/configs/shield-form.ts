/*
 * @Author: chenmeifeng
 * @Date: 2024-03-06 09:57:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-01 13:56:41
 * @Description:
 */
import CommonTreeSelect from "@/components/common-tree-select"
import { ISearchFormProps } from "@/components/custom-form/types"
// import SelectOrdinary from "@/components/select-ordinary"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"

import TimeShield from "../components/time"

// import RuleModel from "../components/rule-model"

export const SHIELD_ADD_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "shieldType",
    label: "屏蔽类型",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请选择屏蔽类型" }] },
    props: {
      // needFirst: true,
      style: { minWidth: "10em" },
      placeholder: "",
      options: [
        { label: "场站", value: "1" },
        { label: "型号", value: "2" },
        { label: "设备", value: "3" },
        { label: "设备规则", value: "4" },
        { label: "型号规则", value: "5" },
      ],
    },
  },
]

export const SHIELD_SITE_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请选择场站" }] },
    props: {
      style: { minWidth: "10em" },
      placeholder: "",
      needId: true,
    },
  },
]
export const SHIELD_DEVICETYPE_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "deviceType",
    label: "设备类型",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请选择设备类型" }] },
    props: {
      options: [],
      placeholder: "",
      style: { minWidth: "10em" },
    },
  },
]
export const SHIELD_DEVICE_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: CommonTreeSelect,
    name: "deviceId",
    label: "设备",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请选择设备" }] },
    props: {
      placeholder: "",
      style: { minWidth: "13em" },
    },
  },
]
export const SHIELD_MODEL_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "modelId",
    label: "模型",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请选择模型" }] },
    props: {
      placeholder: "",
      style: { minWidth: "13em" },
    },
  },
]

export const SHIELD_ALARM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "alarmId",
    label: "规则",
    formItemProps: { labelCol: { span: 6 }, rules: [{ required: true, message: "请选择规则" }] },
    props: {
      placeholder: "",
      style: { minWidth: "13em" },
    },
  },
]

export const SHIELD_ALARM_TIME_CANCEL: ISearchFormProps["itemOptions"] = [
  {
    type: TimeShield,
    name: "cancelTime",
    label: "是否定时取消",
    formItemProps: { labelCol: { span: 6 } },
    props: {
      placeholder: "",
      style: { minWidth: "13em" },
    },
  },
]
