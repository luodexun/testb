/*
 * @Author: chenmeifeng
 * @Date: 2023-11-09 17:59:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-23 14:18:23
 * @Description:
 */
import { ColumnsType } from "antd/es/table"

import CommonTreeSelect from "@/components/common-tree-select"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import SelectOrdinary from "@/components/select-ordinary"
import StationTreeSelect from "@/components/station-tree-select"
import { ISignLogData } from "../types"
import { uDate } from "@/utils/util-funs"
import { day4Y2S } from "@/configs/time-constant"
import RangeDatePicker from "@/components/range-date-picker"

export const CTRL_LOG_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

export const CTRL_LOG_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectOrdinary,
    name: "logType",
    label: "日志类型",
    props: {
      options: [
        { label: "挂牌日志", value: 1 },
        { label: "工单日志", value: 2 },
      ],
    },
  },
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
    name: "deviceType",
    label: "设备类型",
    props: {
      // needFirst: true,
      options: [],
      placeholder: "全部",
      style: { minWidth: "10em" },
    },
  },
  {
    type: CommonTreeSelect,
    name: "deviceId",
    label: "设备",
    props: {
      multiple: true,
      placeholder: "全部",
      treeCheckable: true,
      style: { minWidth: "13em" },
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
  // { dataIndex: "deviceTypeLabel", title: "设备类型", width: 100 },
  { dataIndex: "deviceName", title: "设备", width: 100 },
  { dataIndex: "lineName", title: "线路", width: 100 },
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
export const WORK_LOG_COLUMNS: ColumnsType<ISignLogData> = [
  { dataIndex: "index", title: "序号", align: "center", width: 80 },
  { dataIndex: "stationName", title: "场站", width: 100 },
  { dataIndex: "deviceName", title: "设备", width: 100 },
  { dataIndex: "datasource", title: "挂牌来源", width: 100 },
  { dataIndex: "signDesc", title: "挂牌类型", width: 100 },
  { dataIndex: "description", title: "挂牌描述" },
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
