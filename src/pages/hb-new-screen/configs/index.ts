import * as echarts from "echarts"

export const optionsType = [
  { name: "风电", value: "wtYearlyUtilizationHour" },
  { name: "光伏", value: "pvinvYearlyUtilizationHour" },
]

export const WEATHER_DEVICETYPE = [
  { name: "风电", value: "WT" },
  { name: "光伏", value: "PVINV" },
]

export const mapTypeQuota = [
  {
    name: "风电",
    key: "WT",
    children: [
      { type: "box", name: "装机容量", unit: "万kW", key: "wtInstalledCapacity" },
      { type: "box", name: "日发电量", unit: "万kWh", key: "wtDailyProduction" },
      { type: "box", name: "风机台数", unit: "台", key: "wtNum" },
      { type: "line", name: "容量占比(%)", key: "wtInstalledCapacityTRate" },
      { type: "num", name: "场站数量（个）", key: "stationWNum" },
    ],
  },
  {
    name: "光伏",
    key: "PVINV",
    children: [
      { type: "num", name: "场站数量（个）", key: "stationSNum" },

      { type: "box", name: "装机容量", unit: "万kW", key: "pvinvInstalledCapacity" },
      { type: "box", name: "日发电量", unit: "万kWh", key: "pvinvDailyProduction" },
      { type: "box", name: "逆变器台数", unit: "台", key: "pvinvNum" },
      { type: "line", name: "容量占比(%)", key: "pvinvInstalledCapacityTRate" },
    ],
  },
  // {
  //   name: "储能",
  //   key: "ESPCS",
  //   children: [
  //     { type: "num", name: "场站数量（个）", key: "stationENum" },
  //     { type: "line", name: "容量占比(%)", key: "espcsInstalledCapacityTRate" },
  //     { type: "box", name: "装机容量", unit: "万kW", key: "espcsInstalledCapacity" },
  //   ],
  // },
]

export const areaList = [
  { name: "四川", value: [104.08, 30.63, 15] },
  { name: "鄂西北", value: [111.29, 30.7, 15] },
  { name: "随州", value: [113.38, 31.69, 15] },
  { name: "仙桃", value: [113.44, 30.33, 15] },
  { name: "咸宁", value: [114.32, 29.84, 15] },
  { name: "江西", value: [115.89, 28.69, 15] },
  { name: "涟源", value: [112.94, 28.24, 12] },
]

export const selectOptions = [
  { label: "大区", value: "REGION_COM_ID" },
  { label: "检修公司", value: "MAINTENANCE_COM_ID" },
  { label: "场站", value: "STATION_CODE" },
]

export const echartsLineColor = {
  huang: {
    name: "短期预测功率",
    type: "line",
    showSymbol: false,
    smooth: true,
    lineStyle: {
      color: "#FF8000",
    },
    itemStyle: {
      color: "#FF8000",
    },
    // areaStyle: {
    //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //     { offset: 0, color: "rgba(255,128,0,0.57)" },
    //     { offset: 0.5, color: "rgba(255,128,0,0.37)" },
    //     { offset: 1, color: "rgba(255,128,0,0.1)" },
    //   ]),
    // },
  },
  red: {
    lineStyle: {
      color: "rgba(255, 99, 99, 0.57)",
    },
    itemStyle: {
      color: "rgba(255, 99, 99, 0.57)",
    },
    // areaStyle: {
    //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //     { offset: 0, color: "rgba(255, 99, 99, 0.57)" },
    //     { offset: 0.5, color: "rgba(255, 99, 99,0.37)" },
    //     { offset: 1, color: "rgba(255, 99, 99,0.1)" },
    //   ]),
    // },
  },
  green: {
    name: "超短期预测功率",
    type: "line",
    showSymbol: false,
    smooth: true,
    lineStyle: {
      color: "rgba(191, 253, 144, 1)",
    },
    itemStyle: {
      color: "rgba(191, 253, 144, 1)",
    },
    // areaStyle: {
    //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //     { offset: 0, color: "rgba(191, 253, 144, 0.57)" },
    //     { offset: 0.5, color: "rgba(191, 253, 144, 0.37)" },
    //     { offset: 1, color: "rgba(191, 253, 144, 0.1)" },
    //   ]),
    // },
  },
  purple: {
    name: "全场实际功率",
    type: "line",
    showSymbol: false,
    smooth: true,
    lineStyle: {
      color: "rgba(214, 129, 255, 1)",
    },
    itemStyle: {
      color: "rgba(214, 129, 255, 1)",
    },
    // areaStyle: {
    //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //     { offset: 0, color: "rgba(214, 129, 255, 0.57)" },
    //     { offset: 0.5, color: "rgba(214, 129, 255, 0.37)" },
    //     { offset: 1, color: "rgba(214, 129, 255, 0.1)" },
    //   ]),
    // },
  },
  pridict: {
    lineStyle: {
      color: "rgba(81, 209, 155, 1)",
    },
    itemStyle: {
      color: "rgba(81, 209, 155, 1)",
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "rgba(60, 201, 167, 0.61)" },
        { offset: 0.5, color: "rgba(60, 201, 167, 0.37)" },
        { offset: 1, color: "rgba(60, 201, 167,  0.1)" },
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
    },
  },
}
export const SELECTOPTION = [
  { label: "大区", value: "REGION_COM_ID" },
  { label: "检修公司", value: "MAINTENANCE_COM_ID" },
  { label: "场站", value: "STATION_CODE" },
]
export const SCREEN_LISTS = [
  // { label: "大屏1", key: "hbscreen" },
  // { label: "大屏2", key: "hbscreen2" },
  { label: "主页", key: "" },
]
export const tooltipKey = [
  { name: "实时风速", key: "windSpeed", unit: "m/s" },
  { name: "实时功率", key: "activePower", unit: "万kW" },
  { name: "装机台数", key: "totalDeviceCount", unit: "台" },
  { name: "装机容量", key: "totalInstalledCapacity", unit: "万kW" },
]
