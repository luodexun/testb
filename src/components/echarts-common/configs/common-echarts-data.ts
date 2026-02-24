/*
 * @Author: chenmeifeng
 * @Date: 2024-11-01 13:58:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-08 17:42:28
 * @Description:
 */
export const commonBaseYAxis = (screenWidth = 1920) => {
  return {
    axisLine: {
      // show: true,
      // lineStyle: {
      //   color: "#12447D",
      // },
    },
    axisLabel: {
      fontSize: "1.2em",
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
      fontSize: "1.2em",
      opacity: 0.8,
    },
    nameGap: 2 * (screenWidth / 1920),
  }
}
export const commonBaseXAis = ({ screenWidth = 1920, axisLabel = {} }) => {
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
      fontSize: "1.2em",
      opacity: 0.8,
      margin: 3 * (screenWidth / 1920),
      ...axisLabel,
    },
  }
}
export const commonBaseLegend = (screenWidth: number, show = true) => {
  return {
    show: show,
    type: "scroll",
    top: 10,
    textStyle: {
      color: "#FFFFFF",
      fontSize: "1em",
      opacity: 0.8,
    },
    itemGap: 30 * (screenWidth / 1920),
    // icon: "rect",
  }
}
