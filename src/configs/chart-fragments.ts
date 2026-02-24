/*
 * @Author: xiongman
 * @Date: 2023-05-19 16:21:06
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-12 14:39:44
 * @Description: 一些公共的echarts options 参数
 */

import { calcRootFontSize } from "@utils/util-funs"

// echarts 渐变色对象创建方法
function chartLinearColor(colors: string[], isVertical?: boolean) {
  const direct = isVertical ? { x: 0, y: 0, x2: 1, y2: 1 } : { x: 0, y: 0, x2: 0, y2: 1 }
  return {
    type: "linear",
    ...direct,
    colorStops: colors.map((r, i) => ({ offset: i, color: r })),
    global: false, // 缺省为 false
  }
}

const baseGrid = { left: 30, right: 30, top: 40, bottom: 16, containLabel: true }

const legendText = { color: "#A2C1DE", fontSize: calcRootFontSize(14) }

const baseLegend = {
  width: "80%",
  type: "scroll",
  itemWidth: 20,
  itemHeight: 10,
  top: 10,
  pageIconSize: 12,
  textStyle: legendText,
}

const baseTooltip = {
  show: true,
  triggerOn: "mousemove",
  trigger: "axis",
  axisPointer: { type: "cross", crossStyle: { color: "#999" } },
  enterable: true,
  confine: true,
  showDelay: 0,
  hideDelay: 3000,
  position: (pos: number[], _params: any, _dom: any, _rect: any, size: { viewSize: number[] }) => {
    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
    const obj = { top: 2 }
    obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 10
    return obj
  },
  textStyle: { fontSize: calcRootFontSize(14), color: "#bbbbbb" },
  backgroundColor: "rgba(10,10,10,0.7)",
  borderColor: "rgba(24,29,37,1)",
  extraCssText: "padding: 4px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); max-height: 100%; overflow: auto;",
}

const baseAxisLabel = { show: true, color: "#ededed", fontSize: calcRootFontSize(14) }

const baseXAxis = {
  type: "category",
  axisLine: { show: true },
  axisTick: { alignWithLabel: true },
  axisLabel: baseAxisLabel,
}

const baseYAxis = {
  type: "value",
  scale: true,
  nameGap: 12,
  nameTextStyle: {
    color: "#ededed",
  },
  axisLine: { show: true },
  axisTick: { show: true, alignWithLabel: true },
  splitLine: { show: true, lineStyle: { color: "rgba(48,110,185,0.6)", opacity: 0.5 } },
  axisLabel: baseAxisLabel,
}

const baseDataZoom = [
  { type: "inside", minSpan: 10 },
  {
    type: "slider",
    bottom: 6,
    height: 8,
    showDataShadow: false,
    brushSelect: false,
    borderColor: "none",
    moveHandleSize: 0,
    handleSize: 0,
    moveHandleStyle: { opacity: 0.4 },
  },
]

function scrollDataZoom(params?: { endValue?: number; height?: number; bottom?: number; realtime?: boolean }) {
  const { endValue = 20, height = 8, bottom = 4, realtime } = params || {}
  return [
    {
      type: "slider",
      filterMode: "filter",
      handleSize: 0,
      moveHandleSize: 0,
      showDetail: false,
      showDataShadow: false,
      brushSelect: false,
      borderColor: "none",
      left: "center",
      startValue: 0,
      realtime,
      endValue,
      height,
      bottom,
    },
    {
      type: "inside",
      zoomOnMouseWheel: false,
      moveOnMouseMove: false,
      moveOnMouseWheel: true,
    },
  ]
}

export {
  baseAxisLabel,
  baseDataZoom,
  baseGrid,
  baseLegend,
  baseTooltip,
  baseXAxis,
  baseYAxis,
  chartLinearColor,
  legendText,
  scrollDataZoom,
}
