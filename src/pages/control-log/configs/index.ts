/*
 * @Author: chenmeifeng
 * @Date: 2023-11-09 17:59:43
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-29 10:02:58
 * @Description:
 */
import { IControlLogData } from "@pages/control-log/types"
import { ColumnsType } from "antd/es/table"

import CommonTreeSelect from "@/components/common-tree-select"
import { SCH_BTN } from "@/components/custom-form/configs.ts"
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import RangeDatePicker from "@/components/range-date-picker"
import SelectOrdinary from "@/components/select-ordinary"
import StationTreeSelect from "@/components/station-tree-select"

export const CTRL_LOG_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [SCH_BTN, { name: "export", label: "导出" }]

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
    name: "deviceIds",
    label: "设备",
    props: {
      multiple: true,
      placeholder: "全部",
      treeCheckable: true,
      style: { minWidth: "13em" },
    },
  },
  {
    type: RangeDatePicker,
    name: "dateRange",
    label: "时间",
    props: { disabled: false, style: { width: "28em" } },
  },
]

export const CONTROL_LOG_COLUMNS: ColumnsType<IControlLogData> = [
  { dataIndex: "index", title: "序号", align: "center", width: 100 },
  { dataIndex: "stationName", title: "场站", width: 150 },
  { dataIndex: "deviceName", title: "设备", width: 150 },
  { dataIndex: "deviceTypeLabel", title: "设备类型", width: 100 },
  { dataIndex: "controlTypeLabel", title: "控制指令", width: 100 },
  { dataIndex: "targetValue", title: "控制值", width: 100 },
  { dataIndex: "reResult", title: "返回结果" },
  { dataIndex: "operatorBy", title: "执行人", width: 100 },
  { dataIndex: "authorizerBy", title: "监护人", width: 100 },
  { dataIndex: "operatorTimeStr", title: "执行时间" },
]
