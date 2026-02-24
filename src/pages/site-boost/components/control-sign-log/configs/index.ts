/*
 * @Author: chenmeifeng
 * @Date: 2023-11-09 17:59:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-15 16:29:14
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import CustomTextInput from "@/components/custom-input/textarea"
import RangeDatePicker from "@/components/range-date-picker"
import SelectOrdinary from "@/components/select-ordinary"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"

import { ISignLogData } from "../types"

export const CTRL_LOG_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "export", label: "导出" },
  { name: "sign", label: "挂牌" },
  {
    name: "unsign",
    label: "摘牌",
    btnType: "popconfirm",
    popProps: { title: "摘牌", description: "是否确认摘牌？", okText: "确认", cancelText: "取消" },
  },
]

export const CTRL_LOG_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      // needFirst: true,
      style: { minWidth: "10em" },
      placeholder: "全部",
      needId: true,
    },
  },
  {
    type: SelectOrdinary,
    name: "isEnd",
    label: "是否关闭",
    props: {
      options: [
        { label: "是", value: true },
        { label: "否", value: false },
      ],
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    // formItemProps: { labelCol: { span: 8 } },
    props: { showTime: true, style: { width: "28em" } },
  },
]

export const CONTROL_LOG_COLUMNS: ColumnsType<ISignLogData> = [
  { dataIndex: "index", title: "序号", align: "center", width: 80 },
  { dataIndex: "stationName", title: "场站", width: 100 },
  { dataIndex: "lineName", title: "线路", width: 100 },
  // { dataIndex: "deviceName", title: "设备", width: 100 },
  { dataIndex: "datasource", title: "挂牌来源", width: 100 },
  { dataIndex: "signDesc", title: "挂牌类型", width: 100 },
  { dataIndex: "remark", title: "挂牌描述" },
  { dataIndex: "createBy", title: "创建人", width: 100 },
  {
    dataIndex: "createTime",
    title: "创建时间",
    width: 120,
    render: (text) => {
      const date = new Date(text)
      return text ? date.toLocaleString() : ""
    },
  },
  { dataIndex: "endBy", title: "关闭人", width: 100 },
  {
    dataIndex: "endTime",
    title: "关闭时间",
    width: 120,
    render: (text) => {
      const date = new Date(text)
      return text ? date.toLocaleString() : ""
    },
  },
]
export function SIGN_FORM(signals): ISearchFormProps["itemOptions"] {
  return [
    {
      type: StationTreeSelect,
      name: "stationId",
      label: "场站",
      formItemProps: {
        labelCol: { span: 6 },
        rules: [{ required: true, message: "请选择场站" }],
      },
      props: {
        // needFirst: true,
        style: { minWidth: "10em" },
        placeholder: "全部",
        needId: true,
      },
    },
    {
      type: SelectWithAll,
      name: "lineCodeList",
      label: "线路",
      formItemProps: {
        labelCol: { span: 6 },
      },
      props: {
        options: [],
        allowClear: true,
        mode: "multiple",
        placeholder: "全场",
        // labelInValue: true,
        style: { minWidth: "10em" },
      },
    },
    {
      type: SelectWithAll,
      name: "signState",
      label: "类型",
      formItemProps: {
        labelCol: { span: 6 },
        rules: [{ required: true, message: "请选择类型" }],
      },
      props: {
        options: signals,
        allowClear: true,
        labelInValue: true,
        placeholder: "全部",
        style: { minWidth: "10em" },
      },
    },
    {
      type: CustomTextInput,
      name: "remark",
      label: "描述",
      formItemProps: {
        labelCol: { span: 6 },
      },
      props: {
        style: { minWidth: "10em" },
      },
    },
  ]
}
