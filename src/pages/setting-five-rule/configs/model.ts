/*
 * @Author: chenmeifeng
 * @Date: 2023-10-30 10:16:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-22 15:30:24
 * @Description:
 */

import { ISearchFormProps } from "@/components/custom-form/types"
import CustonInput from "@/components/custom-input"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"

// 新增用户弹框
export function editColumns(disabled): ISearchFormProps["itemOptions"] {
  return [
    {
      type: StationTreeSelect,
      name: "stationCode",
      label: "场站",
      formItemProps: {
        labelCol: { span: 3 },
        rules: [{ required: true, message: "请选择场站" }],
      },
      props: {
        disabled,
        style: { width: "15em" },
        allowClear: false,
      },
    },
    {
      type: SelectWithAll,
      name: "pointName",
      label: "控点",
      formItemProps: {
        labelCol: { span: 3 },
        rules: [{ required: true, message: "请选择测点" }],
      },
      props: {
        disabled,
        style: { width: "20em" },
        allowClear: false,
      },
    },
  ]
}

// 编辑用户弹框
export const ST_USER_EDIT_MODEL_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: CustonInput,
    name: "fullName",
    label: "场站全称",
    formItemProps: {
      labelCol: { span: 6 },
      rules: [{ required: true, message: "请输入场站全称" }],
    },
    props: {},
  },
  {
    type: CustonInput,
    name: "shortName",
    label: "场站简称",
    formItemProps: {
      labelCol: { span: 6 },
      rules: [{ required: true, message: "请输入场站简称" }],
    },
    props: {},
  },
  {
    type: CustonInput,
    name: "maintenanceComShortName",
    label: "上级公司",
    formItemProps: {
      labelCol: { span: 6 },
      rules: [{ required: true, message: "请输入上级公司" }],
    },
    props: {},
  },
]
