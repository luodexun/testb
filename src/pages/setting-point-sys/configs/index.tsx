/*
 * @Author: chenmeifeng
 * @Date: 2024-01-08 13:50:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-25 11:22:16
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import { SCH_BTN } from "@/components/custom-form/configs"
import { ISearchFormProps } from "@/components/custom-form/types"
import SelectWithAll from "@/components/select-with-all"
import StationTreeSelect from "@/components/station-tree-select"

// import { IStationIndexInfo } from "../types"

export const ST_POINT_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "save", label: "编辑" }]
export const POINT_TYPE = [
  { label: "遥信", value: "1" },
  { label: "遥测", value: "2" },
  { label: "遥控", value: "3" },
  { label: "遥调", value: "4" },
]
export const ST_STATION_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: StationTreeSelect,
    name: "stationId",
    label: "场站",
    props: {
      needFirst: true,
      disabled: false,
      needId: true,
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "modelId",
    label: "设备型号",
    props: {
      options: [],
      needFirst: true,
      disabled: false,
      allowClear: false,
      placeholder: "全部",
    },
  },
  {
    type: SelectWithAll,
    name: "pointTypes",
    label: "测点类型",
    props: {
      options: POINT_TYPE,
      needFirst: false,
      disabled: false,
      mode: "multiple",
    },
  },
  {
    type: SelectWithAll,
    name: "systemId",
    label: "归属系统",
    props: {
      options: [],
      needFirst: false,
      disabled: false,
      placeholder: "全部",
    },
  },
]
export const ST_STATION_SYS_COLUMNS_SHOW: ColumnsType = [
  { dataIndex: "row_idx", title: "序号", width: 60 },
  { dataIndex: "pointDesc", title: "测点描述" },
  { dataIndex: "modelName", title: "设备型号" },
  { dataIndex: "pointName", title: "测点编码" },
  {
    dataIndex: "pointType",
    title: "测点类型",
    render: (text) => POINT_TYPE.find((i) => i.value === text)?.label || text,
  },
  { dataIndex: "systemName", title: "归属系统" },
  { dataIndex: "display", title: "展示", render: (text) => (text === 1 ? "是" : "否") },
  { dataIndex: "priority", title: "顺序" },
]

export const ST_STATION_SYS_COLUMNS: ColumnsType = [
  { dataIndex: "row_idx", title: "序号", width: 60 },
  { dataIndex: "pointDesc", title: "测点描述" },
  { dataIndex: "modelName", title: "设备型号" },
  { dataIndex: "pointName", title: "测点编码" },
  {
    dataIndex: "pointType",
    title: "测点类型",
    render: (text) => POINT_TYPE.find((i) => i.value === text)?.label || text,
  },
]
