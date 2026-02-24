/*
 * @Author: chenmeifeng
 * @Date: 2024-07-15 10:24:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-14 17:14:27
 * @Description:
 */
import * as echarts from "echarts"
export const SCREEN_LISTS = [
  { label: "大屏1", key: "sxScreen" },
  { label: "主页", key: "" },
]
export const echartsLineColor = {
  pridict: {
    lineStyle: {
      color: "RGBA(185, 49, 255, 1)",
    },
    itemStyle: {
      opacity: 0,
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "RGBA(185, 49, 255, 0.4)" },
        { offset: 0.5, color: "RGBA(185, 49, 255, 0.2)" },
        { offset: 1, color: "RGBA(185, 49, 255, 0.1)" },
      ]),
    },
  },
  wtAtPower: {
    name: "实时功率",
    type: "line",
    lineStyle: {
      color: "rgba(255, 136, 0, 1)",
    },
    itemStyle: {
      color: "rgba(255, 136, 0, 1)",
    },
  },
  pvAtPower: {
    name: "短期预测功率",
    type: "line",
    lineStyle: {
      color: "rgba(185, 50, 251, 1)",
    },
    itemStyle: {
      color: "rgba(185, 50, 251, 1)",
    },
  },
  atPower: {
    name: "超短期预测功率",
    type: "line",
    lineStyle: {
      color: "rgba(0, 227, 255, 1)",
    },
    itemStyle: {
      color: "rgba(0, 227, 255, 1)",
    },
  },
}

export const TEMPORARY_LAT_LONG = [
  {
    name: "山西集控中心",
    value: [112.55, 37.87],
    stnDeviceType: "Control",
    type: "Control",
    totalInstalledCapacity: null,
  },
  // { name: "风机1", value: [112.74, 38.53], stnDeviceType: "WT" },
  // { name: "光伏", value: [112.53, 39.33], stnDeviceType: "PVINV" },
]
export const tooltipKey = [
  { name: "实时风速", key: "windSpeed", unit: "m/s" },
  { name: "实时功率", key: "activePower", unit: "万kW" },
  { name: "装机台数", key: "totalDeviceCount", unit: "台" },
  { name: "装机容量", key: "totalInstalledCapacity", unit: "万kW" },
]
