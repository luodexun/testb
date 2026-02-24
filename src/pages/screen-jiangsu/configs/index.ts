import * as echarts from "echarts"

export const optionsType = [
  { name: "风电", value: "wtYearlyUtilizationHour" },
  { name: "光伏", value: "pvinvYearlyUtilizationHour" },
]
export const powerType = [
  { name: "全部风电场实时发电量", value: "wtDailyProduction", unit: "万kWh", color: "y" },
  { name: "全部光伏场实时发电量", value: "pvinvDailyProduction", unit: "万kWh", color: "b" },
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

export const mapLeftQuota = [
  { name: "总装机容量", key: "totalInstalledCapacity", unit: "万kW" },
  { name: "风电场数量", key: "stationWNum", unit: "座" },
  { name: "风电装机", key: "wtInstalledCapacity", unit: "万kW" },
  { name: "光伏站数量", key: "stationSNum", unit: "座" },
  { name: "光伏装机", key: "pvinvInstalledCapacity", unit: "万kW" },
]

export const mapRightQuota = [
  { name: "风速", key: "windSpeed", unit: "m/s", icon: "speed" },
  { name: "有功功率", key: "activePower", unit: "万kW", icon: "actPower" },
  { name: "日发电量", key: "dailyProduction", unit: "万kWh", icon: "day" },
  { name: "年利用小时", key: "yearlyUtilizationHour", unit: "h", icon: "time" },
  { name: "年发电量", key: "yearlyProduction", unit: "万kWh" },
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
  realtimeElec: {
    name: "实时发电量",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "RGBA(13, 252, 11, 1)",
        },
        {
          offset: 1,
          color: "RGBA(24, 124, 115, 1)",
        },
      ]),
      // 鼠标悬浮状态下的样式
      emphasis: {
        borderColor: "#ffffff", // 高亮边框颜色
        borderWidth: 2, // 高亮边框宽度
      },
    },
  },
}
export const SELECTOPTION = [
  { label: "大区", value: "REGION_COM_ID" },
  { label: "检修公司", value: "MAINTENANCE_COM_ID" },
  { label: "场站", value: "STATION_CODE" },
]
export const SCREEN_LISTS = [
  { label: "大屏1", key: "jsscreen" },
  { label: "主页", key: "" },
]
export const MAP_ICON = [
  { name: "集控中心", icon: "control" },
  { name: "风电场", icon: "WT" },
  { name: "光伏场", icon: "PVINV" },
]
export const TEMPORARY_LAT_LONG = [{ name: "集控中心", value: [118.8, 32.06], stnDeviceType: "Control" }]
