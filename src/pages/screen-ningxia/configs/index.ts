/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 15:47:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-03 14:03:04
 * @Description: 云南大屏配置文件
 */
import * as echarts from "echarts"
import { ITableColumn } from "../types"
export const SCREEN_LISTS = [
  { label: "大屏1", key: "ahscreen" },
  { label: "主页", key: "" },
]
const commonItemStyle = (color) => {
  return {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: color[0],
      },
      {
        offset: 1,
        color: color[1],
      },
    ]),
    // 鼠标悬浮状态下的样式
    emphasis: {
      borderColor: "#ffffff", // 高亮边框颜色
      borderWidth: 2, // 高亮边框宽度
    },
  }
}
const commonLineStyle = (color) => {
  return {
    type: "line",
    showSymbol: false,
    smooth: true,
    lineStyle: {
      color: color,
    },
    itemStyle: {
      color: color,
    },
  }
}
export const echartsLineColor = {
  pridict: {
    lineStyle: {
      color: "RGBA(185, 49, 255, 1)",
    },
    itemStyle: {
      color: "RGBA(185, 49, 255, 1)",
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "RGBA(185, 49, 255, 0.4)" },
        { offset: 0.5, color: "RGBA(185, 49, 255, 0.2)" },
        { offset: 1, color: "RGBA(185, 49, 255, 0.1)" },
      ]),
    },
  },
  yearUseRate: {
    name: "年利用小时数",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "rgba(79, 172, 254, 0.63)",
        },
        {
          offset: 0.5,
          color: "rgba(79, 172, 254, 0.5)",
        },
        {
          offset: 1,
          color: "rgba(0, 242, 254, 0.63)",
        },
      ]),
      // 鼠标悬浮状态下的样式
      emphasis: {
        borderColor: "#ffffff", // 高亮边框颜色
        borderWidth: 2, // 高亮边框宽度
      },
    },
  },
  realityElec: {
    name: "实际发电量",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      ...commonItemStyle(["rgba(12, 255, 8, 1)", "rgba(26, 130, 120, 0.95)"]),
    },
  },
  planElec: {
    name: "计划发电量",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      ...commonItemStyle(["rgba(60, 170, 255, 1)", "rgba(37, 81, 204, 1)"]),
    },
  },
  finishRate: {
    name: "完成率",
    type: "line",
    lineStyle: {
      color: "rgba(255, 210, 82, 1)",
    },
    itemStyle: {
      color: "rgba(255, 210, 82, 1)",
    },
  },
  shortPredPower: {
    name: "短期预测功率",
    ...commonLineStyle("rgba(214, 129, 255, 1)"),
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(214, 129, 255, 0.4)" },
        { offset: 0.5, color: "rgba(214, 129, 255, 0.1)" },
        { offset: 1, color: "rgba(214, 129, 255, 0.01)" },
      ]),
    },
  },
  ultraShortPredPower: {
    name: "超短期预测功率",
    ...commonLineStyle("rgba(255, 99, 99, 1)"),
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(255, 99, 99, 0.4)" },
        { offset: 0.5, color: "rgba(255, 99, 99, 0.1)" },
        { offset: 1, color: "rgba(255, 99, 99, 0.01)" },
      ]),
    },
  },
  agvcPower: {
    name: "AGVC有功功率",
    ...commonLineStyle("rgba(255, 128, 0, 1)"),
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(255, 128, 0, 0.4)" },
        { offset: 0.5, color: "rgba(255, 128, 0, 0.1)" },
        { offset: 1, color: "rgba(255, 128, 0, 0.01)" },
      ]),
    },
  },
  syzzzPower: {
    name: "电气出线功率",
    ...commonLineStyle("rgba(191, 253, 144,1)"),
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(191, 253, 144, 0.4)" },
        { offset: 0.5, color: "rgba(191, 253, 144, 0.1)" },
        { offset: 1, color: "rgba(191, 253, 144, 0.01)" },
      ]),
    },
  },
}

export const SELECT_OPTIONS = [
  { label: "大区", value: "REGION_COM_ID" },
  { label: "检修公司", value: "MAINTENANCE_COM_ID" },
  { label: "场站", value: "STATION_CODE" },
]

export const DVS_TYPE_OPTION = [
  { name: "全部", value: "" },
  { name: "风电", value: "WT" },
  { name: "光伏", value: "PVINV" },
]

export const DVS_TYPE_WP_OPTION = [
  { name: "风电", value: "WT" },
  { name: "光伏", value: "PVINV" },
]

export const CENTER_QUOTA = [
  { name: "装机容量", key: "totalInstalledCapacity", unit: "MW", needUnitTrans: 10 },
  { name: "设备数量", key: "totalDeviceCount", unit: "台" },
  { name: "实时功率", key: "activePower", unit: "MW", needUnitTrans: 10 },
  { name: "日发电量", key: "dailyProduction", unit: "万kWh" },
  { name: "月发电量", key: "monthlyProduction", unit: "万kWh" },
  { name: "年发电量", key: "yearlyProduction", unit: "万kWh" },
]

export const WT_PV_CAPACITY_OPTION = [
  {
    name: "风电装机容量",
    key: "wtInstalledCapacity",
    deviceNumKey: "wtNum",
    deviceNumName: "风机台数",
    stnNum: "stationWNum",
    typeName: "机组种类",
    typeKey: "wtTypeNum",
    color: "RGBA(10, 143, 250, 1)",
  },
  {
    name: "光伏装机容量",
    key: "pvinvInstalledCapacity",
    deviceNumKey: "pvinvNum",
    deviceNumName: "逆变器台数",
    stnNum: "stationSNum",
    typeName: "逆变器种类",
    typeKey: "pvTypeNum",
    color: "RGBA(147, 248, 3, 1)",
  },
]

export const HOUR_24_REALTIME_PW = [
  { name: "实时功率", key: "activePower", unit: "MW", calculate: 1000, color: "RGBA(40, 213, 248, 1)" },
  {
    name: "实际功率",
    key: "realTimeTotalActivePowerOfSubStation",
    calculate: 1,
    unit: "MW",
    color: "RGBA(220, 31, 245, 1)",
  },
  { name: "计划功率", key: "AGCActivePowerOrderBySchedule", unit: "MW", calculate: 1, color: "RGBA(250, 214, 26, 1)" },
  { name: "预测功率", key: "shortPredPower", unit: "MW", calculate: 1000, color: "RGBA(64, 236, 58, 1)" },
]
export const AGC_COLUMNS: ITableColumn[] = [
  { name: "序号", key: "index", width: "5%", align: "center", type: "text" },
  { name: "场站名称", key: "stationName", width: "20%", type: "text" },
  { name: "实际有功值（KV）", key: "realTimeTotalActivePowerOfSubStation", width: "20%", type: "text" },
  { name: "调度有功值（KV）", key: "AGCActivePowerOrderBySchedule", width: "20%", type: "text" },
  { name: "负荷率", key: "rate", width: "25%", type: "process" },
  { name: "投退状态", key: "AGCInput", width: "10%", type: "icon" },
]

export const SOCIAL_CONTRIBUTION = [
  { name: "节约标准煤", key: "saveStandar", unit: "t", icon: "sc1" },
  { name: "减少森林砍伐", key: "reduce", unit: "亩", icon: "sc2" },
  { name: "二氧化碳减排量", key: "CO2", unit: "t", icon: "sc3" },
]

export const TEMPORARY_LAT_LONG = [
  { name: "集控中心", value: [106.0628, 36.3686], stnDeviceType: "Control", totalInstalledCapacity: null },
  // { name: "储能", value: [105.6, 37.37], stnDeviceType: "SYZZZ", totalInstalledCapacity: 11 },
  // { name: "风机1", value: [116.39, 30.71], stnDeviceType: "WT" },
]
export const DVS_OPTIONS = [
  { name: "风电", value: "WT" },
  { name: "光伏", value: "PVINV" },
  { name: "储能", value: "ESPCS" },
]
export const DVS_STATISTICS_QUOTA = [
  {
    name: "风电",
    key: "WT",
    stationNumKey: "stationWNum",
    children: [
      { type: "box", name: "装机容量", unit: "万kW", key: "wtInstalledCapacity" },
      { type: "line", name: "容量占比(%)", key: "wtInstalledCapacityTRate" },
      { type: "box", name: "日发电量", unit: "万kWh", key: "wtDailyProduction" },
      { type: "box", name: "风机台数", unit: "台", key: "wtNum" },
    ],
  },
  {
    name: "光伏",
    key: "PVINV",
    stationNumKey: "stationSNum",
    children: [
      { type: "box", name: "装机容量", unit: "万kW", key: "pvinvInstalledCapacity" },
      { type: "line", name: "容量占比(%)", key: "pvinvInstalledCapacityTRate" },
      { type: "box", name: "日发电量", unit: "万kWh", key: "pvinvDailyProduction" },
      { type: "box", name: "逆变器台数", unit: "台", key: "pvinvNum" },
    ],
  },
  {
    name: "储能",
    key: "ESPCS",
    stationNumKey: "stationENum",
    children: [
      { type: "box", name: "装机容量", unit: "万kW", key: "espcsInstalledCapacity" },
      { type: "line", name: "容量占比(%)", key: "espcsInstalledCapacityTRate" },
      { type: "box", name: "放电功率", unit: "万kW", key: "espcsActivePower" },
      { type: "box", name: "储能台数", unit: "台", key: "espcsNum" },
    ],
  },
]

export const QUOTA_LIST_ONE = [
  { name: "总装机容量", key: "totalInstalledCapacity", unit: "万kW" },
  { name: "实时有功", key: "activePower", unit: "万kW", icon: "actPower" },
]
export const QUOTA_LIST_TWO = [
  { name: "实时风速", key: "windSpeed", unit: "m/s", icon: "speed" },
  { name: "辐照强度", key: "totalIrradiance", unit: "W/㎡", icon: "sun" },
]
