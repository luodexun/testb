/*
 * @Author: chenmeifeng
 * @Date: 2024-03-14 10:39:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-13 15:54:23
 * @Description: 广东大屏echarts图表公用的一些设置
 */
export const commonBaseYAxis = () => {
  return {
    axisLine: {
      show: true,
      lineStyle: {
        color: "#12447D",
      },
    },
    axisLabel: {
      fontSize: "1.4em",
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
      fontSize: "1.4em",
    },
    nameGap: 8,
  }
}
export const commonBaseXAis = ({ axisLabel = {} }) => {
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
      fontSize: "1.4em",
      margin: 5,
      ...axisLabel,
    },
  }
}
export const commonBaseLegend = (show = true) => {
  return {
    show: show,
    type: "scroll",
    top: 0,
    padding: 3,
    itemHeight: 8,
    itemWidth: 20,
    textStyle: {
      color: "#FFFFFF",
      fontSize: "1.2em",
    },
    itemGap: 3,
  }
}
