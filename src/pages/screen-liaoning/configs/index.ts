/*
 * @Author: chenmeifeng
 * @Date: 2024-07-19 15:47:29
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-17 11:14:22
 * @Description: 云南大屏配置文件
 */
import * as echarts from "echarts"
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
    label: {
      show: true,
      position: "top",
      color: "#ffffff",
    },
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
}

export const SELECT_OPTIONS = [
  { label: "大区", value: "REGION_COM_ID" },
  { label: "检修基地", value: "MAINTENANCE_COM_ID" },
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
  { name: "装机容量", key: "totalInstalledCapacity", unit: "MW", needUnitTrans: 0.1 },
  { name: "功率", key: "activePower", unit: "MW", needUnitTrans: 0.1 },
  { name: "风速", key: "windSpeed", unit: "m/s" },
  { name: "日发电量", key: "dailyProduction", unit: "MWh", needUnitTrans: 0.1 },
  { name: "月发电量", key: "monthlyProduction", unit: "MWh", needUnitTrans: 0.1 },
  { name: "年发电量", key: "yearlyProduction", unit: "MWh", needUnitTrans: 0.1 },
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
  { name: "可用功率", key: "AGCAvailablePower", unit: "MW", calculate: 1, color: "RGBA(40, 213, 248, 1)" },
  {
    name: "并网功率",
    key: "realTimeTotalActivePowerOfSubStation",
    calculate: 1,
    unit: "MW",
    color: "RGBA(220, 31, 245, 1)",
  },
  { name: "计划功率", key: "AGCActivePowerOrderBySchedule", unit: "MW", calculate: 1, color: "RGBA(250, 214, 26, 1)" },
  { name: "预测功率", key: "shortPredPower", unit: "MW", calculate: 1000, color: "RGBA(64, 236, 58, 1)" },
]

export const SOCIAL_CONTRIBUTION = [
  { name: "节约标准煤", key: "saveStandar", unit: "t", icon: "sc1", decimal: 3 },
  { name: "多植树木多少棵", key: "reduce", unit: "棵", icon: "sc2", decimal: 0 },
  { name: "二氧化碳减排量", key: "CO2", unit: "t", icon: "sc3", decimal: 3 },
]
// 预留YWT，在建ZWT
export const TEMPORARY_LAT_LONG = [
  { name: "集控中心", value: [123.46, 41.68], stnDeviceType: "Control" },
  { name: "预留1", value: [130.32, 46.8], stnDeviceType: "YWT" },
  { name: "预留2", value: [130.52, 46.87], stnDeviceType: "YWT" },
  { name: "预留3", value: [129.75, 46.71], stnDeviceType: "YWT" },
  { name: "预留4", value: [130.83, 47.02], stnDeviceType: "YWT" },
  { name: "预留5", value: [133.12, 47.28], stnDeviceType: "YWT" },
  { name: "预留6", value: [133.76, 47.92], stnDeviceType: "YWT" },
  { name: "东堤", value: [132.21111, 47.3772], stnDeviceType: "ZWT" },
  { name: "尖山", value: [130.87694, 46.8825], stnDeviceType: "ZWT" },
  { name: "万福（光伏）", value: [125.1257075, 46.3490375], stnDeviceType: "PVINV" },
  { name: "胜利（光伏）", value: [123.5925918, 46.4211825], stnDeviceType: "PVINV" },
  { name: "先锋风电场", value: [123.449166, 45.3847222], stnDeviceType: "ZWT" },
  { name: "万顺风电场", value: [124.91666, 44.53333], stnDeviceType: "ZWT" },
]
export const MAP_ICONS = [
  { name: "集控中心", icon: "ccn" },
  { name: "风电场", icon: "zwt" },
  { name: "光伏场", icon: "cpvinv" },
  { name: "未接入电场", icon: "cwt" },
  { name: "预留电场", icon: "ywt" },
]
