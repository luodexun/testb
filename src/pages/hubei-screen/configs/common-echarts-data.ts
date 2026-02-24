/*
 * @Author: chenmeifeng
 * @Date: 2024-03-14 10:39:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-14 11:05:09
 * @Description: 湖北大屏echarts图表公用的一些设置
 */
export const commonBaseYAxis = (screenWidth: number) => {
  return {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#12447D",
      },
    },
    axisLabel: {
      fontSize: "1.3em",
      color: "#FFFFFF",
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: "#12447D",
      },
    },
    nameTextStyle: {
      color: "#FFFFFF",
      fontSize: "1.3em",
    },
    nameGap: 18 * (screenWidth / 4513),
  }
}
export const commonBaseXAis = ({ screenWidth = 4480, axisLabel = {} }) => {
  return {
    axisTick: { show: false },
    axisLine: {
      show: false,
      lineStyle: {
        // color: "#ffffff",
      },
    },
    nameTextStyle: { color: "#ffffff" },
    axisLabel: {
      color: "#ffffff",
      fontSize: "1.3em",
      margin: 10 * (screenWidth / 4513),
      // interval: 10,
      ...axisLabel,
    },
  }
}
export const commonBaseLegend = (screenWidth: number) => {
  return {
    type: "scroll",
    top: 0,
    left: "center",
    padding: 5 * (screenWidth / 4513),
    itemHeight: 10 * (screenWidth / 4513),
    itemWidth: 20 * (screenWidth / 4513),
    textStyle: {
      color: "#FFFFFF",
      fontSize: "1.3em",
    },
    itemGap: 80 * (screenWidth / 4513),
  }
}
