/*
 * @Author: chenmeifeng
 * @Date: 2023-11-27 16:26:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-28 09:29:56
 * @Description:
 */
import { ISearchFormProps } from "@/components/custom-form/types.ts"
import SelectWithAll from "@/components/select-with-all"

import ChooseInput from "../choose-input"
export type TRpXDataItem = "REGION_COM_ID" | "PROJECT_COM_ID" | "MAINTENANCE_COM_ID" | "STATION_CODE" | "PERIOD" | "LINE" | "DEVICE_CODE" | "MODEL"
export type TRpPowerLineSchFormItemName = "chartsType" | "xData" | "seriesData"
export const RP_POWER_LINE_SCH_FORM_BTNS: ISearchFormProps["buttons"] = [{ name: "confirm", label: "确认" }]
export const SERIES_LIST = [
  { label: "平均有功功率（kW）", value: "activePower" },
  { label: "实际发电量（kWh）", value: "dailyProduction" },
  { label: "理论发电量（kWh）", value: "theoryProduction" },
  { label: "可用发电量（kWh）", value: "availableProduction" },
  { label: "总损失电量（kWh）", value: "totalLossProduction" },
]
export const XDATA_LIST = [
  { label: "时间", value: "transTime" },
]
export const CHARTS_TYPE_OPTION = [
  { label: "柱状图", value: "bar" },
  { label: "折线图", value: "line" },
  { label: "条形图", value: "horizontalBar" },
  { label: "面积图", value: "lineArea" },
  { label: "堆叠图", value: "stacking" },
  { label: "饼状图", value: "pie" },
  { label: "雷达图", value: "radar" },
  { label: "漏斗图", value: "funnel" },
  { label: "组合", value: "conbination" },
]
export type TRpRadioChartType = "pie" // 单选选项
export const XDATA_REGION = [{ label: "区域公司", value: "regionComName" }]
export const XDATA_PROJECT = [{ label: "项目公司", value: "projectComName" }]
export const XDATA_MAINTENANCE = [{ label: "检修公司", value: "maintenanceComName" }]
export const XDATA_STATION = [{ label: "场站", value: "stationName" }]
export const XDATA_PERIOD = [{ label: "期次", value: "periodName" }]
export const XDATA_LINE = [{ label: "线路", value: "lineName" }]
export const XDATA_DEVICE = [{ label: "设备", value: "deviceName" }]
export const XDATA_MODEL = [{ label: "机型", value: "model" }]
export const RP_POWER_LINE_SCH_FORM_ITEMS: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "chartsType",
    label: "图例类型",
    props: {
      // needFirst: true,
      allowClear: false,
      options: CHARTS_TYPE_OPTION,
      placeholder: "请选择查询类型",
      style: { minWidth: "10em" },
    },
  },
  {
    type: SelectWithAll,
    name: "xData",
    label: "X轴",
    props: {
      allowClear: false,
      disabled: false,
      options: XDATA_LIST,
      placeholder: "请选择",
      style: { minWidth: "13em" },
    },
  },
]
export const RP_POWER_ORDINARY_CHART: ISearchFormProps["itemOptions"] = [
  {
    type: SelectWithAll,
    name: "seriesData",
    label: "指标数据",
    props: {
      allowClear: false,
      disabled: false,
      mode: "multiple",
      options: [],
      fieldNames: { label: "title", value: "dataIndex" },
      placeholder: "请选择指标数据",
      style: { minWidth: "13em" },
    },
  },
]

export const RP_POWER_MIX_CHART: ISearchFormProps["itemOptions"] = [
  {
    type: ChooseInput,
    name: "seriesData",
    label: "指标数据",
    props: {
      disabled: false,
      placeholder: "请选择指标数据",
      style: { minWidth: "13em" },
    },
  },
]
