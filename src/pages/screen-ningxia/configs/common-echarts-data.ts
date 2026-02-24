/*
 * @Author: chenmeifeng
 * @Date: 2024-06-26 10:39:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-23 11:09:39
 * @Description: 江苏大屏echarts图表公用的一些设置
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
      fontSize: "1.4em",
      color: "#FFFFFF",
      opacity: 0.8,
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 0.6,
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
    nameGap: 20 * (screenWidth / 3456),
  }
}
export const commonBaseXAis = ({ screenWidth = 3456, axisLabel = {} }) => {
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
      fontSize: "1.4em",
      opacity: 0.8,
      margin: 10 * (screenWidth / 3456),
      ...axisLabel,
    },
  }
}
export const commonBaseLegend = (screenWidth: number, show = true) => {
  return {
    show: show,
    type: "scroll",
    top: 10,
    padding: 5 * (screenWidth / 3456),
    itemHeight: 10 * (screenWidth / 3456),
    itemWidth: 10 * (screenWidth / 3456),
    textStyle: {
      color: "#FFFFFF",
      fontSize: "1.2em",
      opacity: 0.8,
    },
    itemGap: 30 * (screenWidth / 3456),
    // icon: "rect",
  }
}
