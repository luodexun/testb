/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 14:32:26
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-16 14:58:19
 * @Description:
 */
import * as echarts from "echarts"

export const optionsType = [
  { name: "风", value: "wtYearlyUtilizationHour" },
  { name: "光", value: "pvinvYearlyUtilizationHour" },
]

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

export const areaList = [
  { name: "四川", value: [104.08, 30.63] },
  { name: "鄂西北", value: [111.29, 30.7] },
  { name: "随州", value: [113.38, 31.69] },
  { name: "仙桃", value: [113.44, 30.33] },
  { name: "咸宁", value: [114.32, 29.84] },
  { name: "江西", value: [115.89, 28.69] },
  { name: "涟源", value: [112.94, 28.24] },
]

export const selectOptions = [
  { label: "大区", value: "REGION_COM_ID" },
  { label: "检修公司", value: "MAINTENANCE_COM_ID" },
  { label: "场站", value: "STATION_CODE" },
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
