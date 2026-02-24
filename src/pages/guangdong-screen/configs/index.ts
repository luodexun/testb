/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 11:34:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-27 11:17:51
 * @Description: 广东大屏公用设置
 */
import * as echarts from "echarts"

export const SELECTOPTION = [
  { label: "大区", value: "REGION_COM_ID" },
  { label: "检修公司", value: "MAINTENANCE_COM_ID" },
  { label: "场站", value: "STATION_CODE" },
]
export const TREND_OPTION = [
  { name: "风", value: "wtYearlyUtilizationHour" },
  { name: "光", value: "pvinvYearlyUtilizationHour" },
]
export const BRAND_RATE_OPTION = [
  { name: "风", value: "wt" },
  { name: "光", value: "pvinv" },
  { name: "储", value: "espcs" },
]
export const echartsLineColor = {
  huang: {
    lineStyle: {
      color: "#FF8000",
    },
    itemStyle: {
      color: "#FF8000",
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(255,128,0,0.57)" },
        { offset: 0.5, color: "rgba(255,128,0,0.37)" },
        { offset: 1, color: "rgba(255,128,0,0.1)" },
      ]),
    },
  },
  red: {
    lineStyle: {
      color: "rgba(255, 99, 99, 0.57)",
    },
    itemStyle: {
      color: "rgba(255, 99, 99, 0.57)",
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(255, 99, 99, 0.57)" },
        { offset: 0.5, color: "rgba(255, 99, 99,0.37)" },
        { offset: 1, color: "rgba(255, 99, 99,0.1)" },
      ]),
    },
  },
  green: {
    lineStyle: {
      color: "rgba(191, 253, 144, 1)",
    },
    itemStyle: {
      color: "rgba(191, 253, 144, 1)",
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(191, 253, 144, 0.57)" },
        { offset: 0.5, color: "rgba(191, 253, 144, 0.37)" },
        { offset: 1, color: "rgba(191, 253, 144, 0.1)" },
      ]),
    },
  },
  purple: {
    lineStyle: {
      color: "rgba(214, 129, 255, 1)",
    },
    itemStyle: {
      color: "rgba(214, 129, 255, 1)",
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(214, 129, 255, 0.57)" },
        { offset: 0.5, color: "rgba(214, 129, 255, 0.37)" },
        { offset: 1, color: "rgba(214, 129, 255, 0.1)" },
      ]),
    },
  },
}

export const brandBarStyle = {
  itemStyle: {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: "rgba(67, 115, 255, 1)",
      },
      {
        offset: 1,
        color: "rgba(143, 50, 247, 0.59)",
      },
    ]),
  },
}

export const yearUseBarStyle = {
  itemStyle: {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: "rgba(255, 128, 0, 1)",
      },
      {
        offset: 1,
        color: "rgba(110, 57, 4, 0.40)",
      },
    ]),
  },
}

export const mapTypeQuota = [
  {
    name: "风机",
    key: "WT",
    children: [
      { name: "场站数量（个）", key: "stationWNum" },
      { name: "装机(万kW)", key: "wtInstalledCapacity" },
      { name: "日发电量(万kWh)", key: "wtDailyProduction" },
      { name: "风机台数（台）", key: "wtNum" },
      { name: "容量占比(%)", key: "wtInstalledCapacityTRate" },
    ],
  },
  {
    name: "光伏",
    key: "PVINV",
    children: [
      { name: "场站数量（个）", key: "stationSNum" },
      { name: "容量占比(%)", key: "pvinvInstalledCapacityTRate" },
      { name: "装机(万kW)", key: "pvinvInstalledCapacity" },
      { name: "日发电量(万kWh)", key: "pvinvDailyProduction" },
    ],
  },
  {
    name: "储能",
    key: "ESPCS",
    children: [
      { name: "场站数量（个）", key: "stationENum" },
      { name: "容量占比(%)", key: "espcsInstalledCapacityTRate" },
      { name: "装机(万kW)", key: "espcsInstalledCapacity" },
    ],
  },
]

export const SCREEN_LIST = [
  { label: "大屏1", key: "gdscreen" },
  { label: "主页", key: "" },
]

export const GD_MAINCOMPANY = [
  { name: "潮南", value: [116.68, 23.35, 15] },
  { name: "恵来", value: [116.37, 23.55, 15] },
  { name: "粤中", value: [114.42, 23.11, 15] },
  { name: "粤北", value: [112.38, 24.78, 15] },
  { name: "清远", value: [113.06, 23.68, 15] },
  { name: "粤西", value: [111.98, 21.86, 15] },
  { name: "湛江", value: [110.36, 21.27, 12] },
]
