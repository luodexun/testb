/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 13:47:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-23 17:23:51
 * @Description:
 */

import { ColumnsType } from "antd/es/table"

import { ITbColAction } from "@/components/action-buttons/types"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import CustonInputNumber from "@/components/custom-input-number"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"
import { StorageStationData, StorageStnDvsType } from "@/configs/storage-cfg"
import { IStnDvsType4LocalStorage } from "@/types/i-device.ts"
import { getTableActColumn } from "@/utils/table-funs"
import { getStorage } from "@/utils/util-funs"

import IntervalButton from "../components/interval-input"
import { IPowerData, TPowerTbActInfo } from "../types/index"
export const { stationOptions4Id } = getStorage(StorageStationData) || {}

export const deviceTypesOfSt = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)

const TABLE_ACTION = [
  { key: "see", label: "查看" },
  { key: "edit", label: "编辑" },
  { key: "deleted", label: "删除" },
]

export const ST_MANAGE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [
  SCH_BTN,
  { name: "add", label: "新增" },
  { name: "batchDel", label: "批量删除" },
]

export const DEVICETYPE_CODE = [
  { value: "WT", key: "WT" },
  { value: "PVINV", key: "PVINV" },
]

export const ST_MANAGE_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "curveId",
    label: "查询类型",
    props: {
      options: [
        { label: "风", value: "WT" },
        { label: "光", value: "PVINV" },
      ],
      needFirst: true,
      disabled: false,
      allowClear: false,
    },
  },
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      disabled: false,
      options: [],
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "modelId",
    label: "设备型号",
    props: {
      disabled: false,
      options: [],
      placeholder: "请选择设备型号",
      style: { minWidth: "10em" },
    },
  },
]

export function DEVICE_ATT_COLUMNS(
  config: ITbColAction<TPowerTbActInfo, IPowerData>,
  dvsType,
): ColumnsType<IPowerData> {
  const { onClick } = config
  return [
    { dataIndex: "index", title: "序号", width: 60, align: "center" },
    {
      dataIndex: "stationId",
      title: "场站",
      render: (text) => stationOptions4Id?.find((i) => i.value === text)?.label || text,
    },
    {
      dataIndex: "deviceType",
      title: "类型",
      render: (text) => (text === "WT" ? "风" : "光"),
    },
    {
      dataIndex: "modelName",
      title: "型号",
    },
    {
      dataIndex: dvsType === "WT" ? "actualAirDensity" : "actualTemperature",
      title: dvsType === "WT" ? "实际空气密度" : "实际环境温度",
    },
    ...getTableActColumn<IPowerData, TPowerTbActInfo>(
      TABLE_ACTION,
      (record) => ({
        onClick: onClick.bind(null, record),
      }),
      null,
      { width: 200 },
    ),
  ]
}

export const POWER_MODER_LINE_COLUMNS: (ColumnsType[number] & {
  editable?: boolean
  showEditStatusButnoEdit?: boolean
  dataIndex: string
})[] = [
  { dataIndex: "index", title: "序号", width: 60, align: "center", render: (_text, _record, index) => index + 1 },
  { dataIndex: "beanWindSpeed", title: "风速（m/s）", width: 120, showEditStatusButnoEdit: true },
  { dataIndex: "standardActivePower", width: 120, editable: true, title: "标准空气密度有功功率（kW）" },
  { dataIndex: "actualActivePower", width: 120, editable: true, title: "实际空气密度有功功率（kW）" },
]

export const POWER_MODER_PV_LINE_COLUMNS: (ColumnsType[number] & {
  editable?: boolean
  showEditStatusButnoEdit?: boolean
  dataIndex: string
})[] = [
  { dataIndex: "index", title: "序号", width: 60, align: "center", render: (_text, _record, index) => index + 1 },
  { dataIndex: "irradiance", title: "辐照度（W/m²）", width: 120, showEditStatusButnoEdit: true },
  { dataIndex: "standardActivePower", width: 120, editable: true, title: "标准环境温度有功功率（kW）" },
  { dataIndex: "actualActivePower", width: 120, editable: true, title: "实际环境温度有功功率（kW）" },
]

export const POWER_MODEL_FORM: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "stationId",
    label: "场站",
    formItemProps: { rules: [{ required: true, message: "请选择场站" }] },
    props: {
      options: [],
      style: { width: 140 },
      disabled: false,
      allowClear: false,
    },
  },
  {
    type: SelectWithAll,
    name: "modelId",
    label: "设备型号",
    formItemProps: { rules: [{ required: true, message: "请选择设备型号" }] },
    props: {
      options: [],
      style: { width: 140 },
      disabled: false,
    },
  },
  {
    type: CustonInputNumber,
    name: "standardAirDensity",
    label: "标准空气密度",
    formItemProps: { rules: [{ required: true, message: "请输入标准空气密度" }] },
    props: {
      disabled: false,
      style: { width: 130 },
      suffix: "kg/m³",
    },
  },
  {
    type: CustonInputNumber,
    name: "actualAirDensity",
    label: "实际空气密度",
    formItemProps: { rules: [{ required: true, message: "请输入实际空气密度" }] },
    props: {
      disabled: false,
      style: { width: 130 },
      suffix: "kg/m³",
    },
  },
  {
    type: IntervalButton,
    name: "interval",
    label: "资源区间",
    props: {
      value: [],
      disabled: false,
      min: 2,
      max: 25,
      step: 1,
      precision: 2,
      style: { width: 80 },
    },
  },
  {
    type: CustonInputNumber,
    name: "step",
    label: "步长",
    formItemProps: { rules: [{ required: true, message: "请输入步长" }] },
    props: {
      // options: [
      //   { label: "0.5", value: 0.5 },
      //   { label: "1", value: 1 },
      // ],
      style: { width: 140 },
      disabled: false,
    },
  },
]

export const POWER_MODEL_PV_FORM: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "stationId",
    label: "场站",
    formItemProps: { rules: [{ required: true, message: "请选择场站" }] },
    props: {
      options: [],
      style: { width: 140 },
      disabled: false,
      allowClear: false,
    },
  },
  {
    type: SelectWithAll,
    name: "modelId",
    label: "设备型号",
    formItemProps: { rules: [{ required: true, message: "请选择设备型号" }] },
    props: {
      options: [],
      style: { width: 140 },
      disabled: false,
    },
  },
  {
    type: CustonInputNumber,
    name: "standardTemperature",
    label: "标准环境温度",
    formItemProps: { rules: [{ required: true, message: "请输入标准环境温度" }] },
    props: {
      disabled: false,
      style: { width: 130 },
      suffix: "℃",
    },
  },
  {
    type: CustonInputNumber,
    name: "actualTemperature",
    label: "实际环境温度",
    formItemProps: { rules: [{ required: true, message: "请输入实际环境温度" }] },
    props: {
      disabled: false,
      style: { width: 130 },
      suffix: "℃",
    },
  },
  {
    type: IntervalButton,
    name: "interval",
    label: "资源区间",
    props: {
      value: [],
      disabled: false,
      min: 2,
      max: 25,
      step: 1,
      precision: 2,
      style: { width: 80 },
    },
  },
  {
    type: CustonInputNumber,
    name: "step",
    label: "步长",
    formItemProps: { rules: [{ required: true, message: "请输入步长" }] },
    props: {
      // options: [
      //   { label: "0.5", value: 0.5 },
      //   { label: "1", value: 1 },
      // ],
      style: { width: 140 },
      disabled: false,
    },
  },
]
