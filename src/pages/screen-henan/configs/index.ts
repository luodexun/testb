/*
 * @Author: chenmeifeng
 * @Date: 2024-09-18 10:41:32
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-29 15:23:10
 * @Description:
 */
import * as echarts from "echarts"
export const SCREEN_LISTS = [
  { label: "大屏1", key: "hnscreen" },
  { label: "大屏2", key: "hn2screen" },
  { label: "主页", key: "" },
]
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

const commonBarStyle = ([color1, color2]) => {
  return {
    type: "bar",
    barWidth: 20,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 1,
          color: color1,
        },
        {
          offset: 0,
          color: color2,
        },
      ]),
      // 鼠标悬浮状态下的样式
      emphasis: {
        borderColor: "#ffffff", // 高亮边框颜色
        borderWidth: 2, // 高亮边框宽度
      },
    },
  }
}
export const echartsLineColor = {
  yearUseRate: {
    name: "利用小时数",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 1,
          color: "rgba(92, 108, 252, 1)",
        },
        {
          offset: 0,
          color: "rgba(255, 173, 49, 1)",
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
      ...commonBarStyle(["rgba(12, 255, 8, 1)", "rgba(26, 130, 120, 0.95)"]),
    },
  },
  planElec: {
    name: "计划发电量",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      ...commonBarStyle(["rgba(60, 170, 255, 1)", "rgba(37, 81, 204, 1)"]),
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

export const THREE_OPTION = [
  { label: "大区", value: "REGION_COM_ID" },
  { label: "检修公司", value: "MAINTENANCE_COM_ID" },
  { label: "场站", value: "STATION_CODE" },
]
export const CENTER_QUOTA_LEFT = [
  { name: "实时风速", key: "windSpeed", unit: "m/s" },
  { name: "辐射强度", key: "totalIrradiance", unit: "W/m²" },
  { name: "实时功率", key: "activePower", unit: "万kW", caculate: 1 },
  { name: "并网容量", key: "wtInstalledCapacity", unit: "万kW" },
]
export const CENTER_QUOTA_RIGHT = [
  { name: "日发电量", key: "dailyProduction", unit: "万kWh" },
  { name: "月发电量", key: "monthlyProduction", unit: "万kWh" },
  { name: "年发电量", key: "yearlyProduction", unit: "万kWh" },
  { name: "年度减排量", key: "CO2", unit: "吨" },
]

// export const CENTER_QUOTA_BOTTOM = [
//   { name: "并网台数", key: "GridOnDeviceCount", unit: "台" },
//   { name: "并网容量", key: "GridOnCapacity", unit: "万kW" },
//   { name: "实时功率", key: "ActivePower", unit: "万kW" },
// ]

export const CENTER_QUOTA_BOTTOM = [
  {
    name: "风机",
    key: "stationWNum",
    type: 1,
    children: [
      { name: "并网台数", key: "wtOperationDeviceCount", unit: "台" },
      { name: "并网容量", key: "wtInstalledCapacity", unit: "万kW" },
      { name: "实时功率", key: "wtActivePower", unit: "万kW" },
    ],
  },
  {
    name: "光伏逆变器",
    key: "pvinvNum",
    type: 1,
    showName: "光伏",
    children: [
      { name: "并网台数", key: "pvinvOperationDeviceCount", unit: "台" },
      { name: "并网容量", key: "pvinvInstalledCapacity", unit: "万kW" },
      { name: "实时功率", key: "pvinvActivePower", unit: "万kW" },
    ],
  },
  {
    name: "储能变流器",
    key: "stationENum",
    children: [
      { name: "并网台数", key: "espcsOperationDeviceCount", unit: "台" },
      { name: "并网容量", key: "espcsInstalledCapacity", unit: "万kW" },
      { name: "实时功率", key: "espcsActivePower", unit: "万kW" },
    ],
  },
]

export const mapList = [
  { name: "独立场站", value: [112.7225, 34.76, 15] },
  { name: "漯河基地", value: [113.83, 33.82, 15] },
  { name: "内黄基地", value: [114.77, 35.86, 15] },
  // { name: "安阳昼锦", value: [114.603, 36.078, 15] },
  // { name: "滑县守风", value: [114.53076, 35.502616, 15] },
  { name: "新乡基地", value: [114.626667, 34.990278, 15] },
  { name: "驻马店基地", value: [113.285556, 33.046667, 15] },
  { name: "平顶山基地", value: [113.420556, 33.305833, 15] },
  { name: "南阳基地", value: [112.889056, 32.490784, 15] },
  { name: "豫东基地", value: [115.860684, 34.208503, 15] },
  { name: "信阳基地", value: [115.002789, 31.704794, 15] },
]
