/*
 * @Author: chenmeifeng
 * @Date: 2024-03-14 10:39:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-04 15:36:01
 * @Description: 湖北大屏echarts图表公用的一些设置
 */
export const commonBaseYAxis = (screenWidth: number) => {
  return {
    axisLine: {
      // show: true,
      // lineStyle: {
      //   color: "#12447D",
      // },
    },
    axisLabel: {
      fontSize: "1.6em",
      color: "#FFFFFF",
      opacity: 0.8,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#FFFFFF",
        opacity: 0.3,
      },
    },
    nameTextStyle: {
      color: "#FFFFFF",
      fontSize: "1.6em",
      opacity: 0.8,
    },
    nameGap: 20 * (screenWidth / 4513),
  }
}
export const commonBaseXAis = ({ screenWidth = 4480, axisLabel = {} }) => {
  return {
    axisTick: { show: false },
    axisLine: {
      show: true,
      lineStyle: {
        // color: "#ffffff",
      },
    },
    nameTextStyle: { color: "#ffffff" },
    axisLabel: {
      color: "#ffffff",
      fontSize: "1.6em",
      opacity: 0.8,
      margin: 10 * (screenWidth / 4513),
      ...axisLabel,
    },
  }
}
export const commonBaseLegend = (screenWidth: number) => {
  return {
    type: "scroll",
    top: 0,
    padding: 5 * (screenWidth / 4513),
    itemHeight: 4 * (screenWidth / 4513),
    itemWidth: 16 * (screenWidth / 4513),
    textStyle: {
      color: "#FFFFFF",
      fontSize: "1.6em",
      opacity: 0.8,
    },
    itemGap: 30 * (screenWidth / 4513),
    icon: "rect",
  }
}
