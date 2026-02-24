import * as echarts from "echarts"
export const SCREEN_LISTS = [
  { label: "大屏1", key: "ahscreen" },
  { label: "主页", key: "" },
]
export const echartsLineColor = {
  yearElec: {
    type: "line",
    lineStyle: {
      color: {
        type: "linear",
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: "RGBA(248, 227, 13, 1)", // 0% 处的颜色
          },
          {
            offset: 1,
            color: "RGBA(249, 14, 253, 1)", // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
    itemStyle: {
      opacity: 0,
    },
  },
  dayElec: {
    name: "日实时发电量",
    type: "line",
    lineStyle: {
      color: "RGBA(0, 242, 255, 1)",
    },
    itemStyle: {
      opacity: 0,
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: "RGBA(0, 242, 255, 0.5)" },
        { offset: 0.5, color: "RGBA(0, 242, 255, 0.2)" },
        { offset: 1, color: "RGBA(0, 242, 255, 0.1)" },
      ]),
    },
  },
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

export const TEMPORARY_LAT_LONG = [
  { name: "集控中心", value: [117.33, 31.73], stnDeviceType: "Control" },
  // { name: "风机1", value: [116.5, 32.29], stnDeviceType: "WT", stationCode: "441821W01", maintenanceComId: 1 },
  // { name: "风机1", value: [116.39, 30.71], stnDeviceType: "WT" },
]
