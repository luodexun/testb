/*
 * @Author: chenmeifeng
 * @Date: 2023-11-28 15:07:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-17 15:57:29
 * @Description:
 */
import { dynamicsTimeLineOption } from "./dynamics-time"
import { funnelOption } from "./funnel"
import { horizontalBarOption } from "./horizontal-bar"
import { lineOrBarOption } from "./line"
import { pieOption } from "./pie"
import { radarOption } from "./radar"
import { timeLineOption } from "./time-line"
export const CHARTS_TYPE_OPTIONS = {
  // 折线图
  line: {
    options: lineOrBarOption,
  },
  // 面积图
  lineArea: {
    options: lineOrBarOption,
  },
  // 柱状图
  bar: {
    options: lineOrBarOption,
  },
  // 堆叠图
  stacking: {
    options: lineOrBarOption,
  },
  // 组合图
  conbination: {
    options: lineOrBarOption,
  },
  // 条形图
  horizontalBar: {
    options: horizontalBarOption,
  },
  // 饼图
  pie: {
    options: pieOption,
  },
  // 雷达图
  radar: {
    options: radarOption,
  },
  // 漏斗图
  funnel: {
    options: funnelOption,
  },
  // 时间戳折线图
  timeLine: {
    options: timeLineOption,
  },
  // 动态y坐标轴时间戳折线图
  dynamicsTimeLine: {
    options: dynamicsTimeLineOption,
  },
}

export const getToolbox = (chartName = "未知", otherProps?: any) => {
  return {
    feature: {
      ...otherProps,
      saveAsImage: {
        name: chartName,
        backgroundColor: "#010219",
        iconStyle: {
          color: "#1477F2",
        },
      },
    },
  }
}
