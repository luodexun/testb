/*
 * @Author: chenmeifeng
 * @Date: 2024-04-01 18:00:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-13 14:47:03
 * @Description: 告警中心-告警分析-图标配置
 */

import * as echarts from "echarts"

import { dealTime } from "../methods"

function formatXAxis(value) {
  let dealValue = ""
  if (value.length > 30) {
    dealValue = value.substring(0, 10) + "\n" + value.substring(10, 20) + "\n" + value.substring(20, 27) + "..."
  } else if (value.length > 20) {
    dealValue = value.substring(0, 10) + "\n" + value.substring(10, 20) + "\n" + value.substring(20, 21)
  } else if (value.length > 10) {
    dealValue = value.substring(0, 10) + "\n" + value.substring(10)
  } else {
    dealValue = value
  }
  return dealValue
}
const baseScrollDataZoom = ({ start, end }) => {
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
      endValue: 10,
      height: 10,
      bottom: 4,
      borderRadius: 10,
      start,
      end,
      fillerColor: "rgba(62, 112, 238, 0.5)",
    },
    {
      type: "inside",
      zoomOnMouseWheel: false,
      moveOnMouseMove: false,
      moveOnMouseWheel: true,
    },
  ]
}

export default function runTrendOption(chartData) {
  const {
    xAixsData,
    dataZoomStart = null,
    dataZoomEnd = null,
    seriesData,
    dataIndex = 0,
    title,
    showMrkLine = false,
    echartsSourceData,
  } = chartData
  return {
    animation: false, // 禁用动画效果
    legend: {
      top: -2,
      selectedMode: false, // 设置图例不可点击
      show: title,
      textStyle: { color: "#FFFFFF", fontSize: 14 },
    },
    dataZoom: showMrkLine ? baseScrollDataZoom({ start: dataZoomStart, end: dataZoomEnd }) : [],
    tooltip: {
      show: true,
      showDelay: 0,
      padding: 0,
      textStyle: { fontSize: 12, color: "#FFFFFF" },
      backgroundColor: "rgba(10,10,10,0.7)",
      borderColor: "rgba(62,144,238,0.61)",
      extraCssText: " box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); max-height: 100%; overflow: auto;",
      formatter: function (params) {
        if (showMrkLine) return params.name + ": " + params.data
        let tooltipStr = ""
        echartsSourceData.forEach((item) => {
          if (item.childClass == params.name || !item.childClass) {
            tooltipStr =
              `<span style="font-size: 16px;">${params.name}</span>` +
              "<br>" +
              "累计告警次数: " +
              item.alarmCount +
              "<br>" +
              "首次触发时间: " +
              dealTime(item.firstTriggerTime) +
              "<br>" +
              "末次触发时间: " +
              dealTime(item.lastTriggerTime) +
              "<br>" +
              "累计确认次数: " +
              item.confirmCount +
              "<br>" +
              "首次确认时间: " +
              dealTime(item.firstConfirmTime) +
              "<br>" +
              "末次确认时间: " +
              dealTime(item.lastConfirmTime)
          }
        })
        const tooltipContent =
          '<div style="font-size: 14px; background: linear-gradient(to bottom, rgba(37, 84, 198, 0.52), rgba(4, 13, 43, 0.85)); border: 1px solid #2758D0; border-radius: 0px; padding: 12px 20px;">' +
          tooltipStr +
          "</div>"
        return tooltipContent
      },
    },
    grid: {
      top: showMrkLine ? "15%" : "21%",
      right: "3%",
      left: title ? "5%" : "10%",
      bottom: showMrkLine ? "18%" : "24%",
    },
    xAxis: [
      {
        type: "category",
        data: xAixsData,
        with: 5,
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.12)",
            width: 2,
          },
        },
        axisLabel: {
          color: "#e2e9ff",
          fontSize: 12,
          formatter: function (value) {
            return showMrkLine ? value : formatXAxis(value)
          },
        },
      },
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}",
          color: "#e2e9ff",
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "rgba(255,255,255,1)",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(62, 112, 238, 0.2)",
          },
        },
      },
    ],
    series: [
      {
        name: "告警条数", // 自定义该系列的图例名称
        type: "bar",
        data: seriesData,
        barWidth: "50px",
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: "rgba(62, 112, 238, 1)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(62, 112, 238, 0.28)", // 100% 处的颜色
              },
            ],
            false,
          ),
        },
        label: {
          show: true,
          lineHeight: 20,
          formatter: "{c}",
          position: "top",
          color: "rgba(255, 255, 255, 1)",
          fontSize: 14,
        },
        markLine: showMrkLine
          ? {
              symbol: "none",
              silent: true,
              data: [
                {
                  xAxis: dataIndex,
                  valueIndex: 1,
                  lineStyle: {
                    color: "rgba(255, 255, 255, 0.15)",
                    type: "dashed",
                    width: 90,
                  },
                  label: {
                    show: false,
                  },
                },
              ],
            }
          : {},
      },
    ],
  }
}
