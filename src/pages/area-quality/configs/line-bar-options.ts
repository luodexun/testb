/*
 * @Author: chenmeifeng
 * @Date: 2024-08-21 10:20:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-27 11:19:56
 * @Description:
 */
/*
 * @Author: chenmeifeng
 * @Date: 2024-08-21 10:20:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-26 17:07:44
 * @Description:
 */
import { baseDataZoom, baseLegend, baseTooltip } from "@configs/chart-fragments.ts"

import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"
import * as echarts from "echarts"
const LINE_COLOR = ["#FF8800", "#6DF64C", "#F30CFB", "#4BD4FF", "#FF0000"]
export interface lineChartData extends IBaseChartOption {
  series: any
  downloadFileName?: string
}
export function lineOrBarOption(params: lineChartData) {
  const { xAxis, series, downloadFileName } = params || { xAxis: [], series: [], downloadFileName: "" }
  const actTooltip = {
    ...baseTooltip,
    formatter: function (params) {
      let res = params[0].name
      for (let i = 0; i < params.length; i++) {
        res += "<br>" + params[i].marker + params[i].seriesName + "：" + parseNum(params[i].data)
      }
      return res
    },
  }
  const option = {
    grid: { left: 50, right: 30, top: 50, bottom: 60, containLabel: true },
    tooltip: actTooltip,
    dataZoom: baseDataZoom,
    legend: {
      // data: legend,
      ...baseLegend,
    },
    toolbox: getToolbox(downloadFileName ?? "发电量报表"),
    xAxis: {
      type: "category",
      data: xAxis,
      axisTick: { show: false },
      axisLine: { show: true, color: "#30688a" },
      nameTextStyle: { color: "#95b5ec" },
      axisLabel: {
        color: "#95b5ec",
        fontSize: 12,
        // formatter: function (xLabel: string) {
        //   return xLabel.substring(5)
        // },
      },
    },
    yAxis: {
      type: "value",
    },
    series,
  }
  return option
}

const getToolbox = (chartName = "未知", otherProps?: any) => {
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

export const commonBarOrLineStyle = {
  dataQualityRate: {
    name: "数据合规率",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 1,
          color: "rgba(102, 0, 255, 0.63)",
        },
        {
          offset: 0,
          color: "rgba(255, 91, 170, 1)",
        },
      ]),
      // 鼠标悬浮状态下的样式
      emphasis: {
        borderColor: "#ffffff", // 高亮边框颜色
        borderWidth: 2, // 高亮边框宽度
      },
    },
  },
  dataIntegrityRate: {
    name: "数据完整率",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 1,
          color: "rgba(251, 50, 171, 0.38)",
        },
        {
          offset: 0,
          color: "rgba(249, 228, 93, 1)",
        },
      ]),
      // 鼠标悬浮状态下的样式
      emphasis: {
        borderColor: "#ffffff", // 高亮边框颜色
        borderWidth: 2, // 高亮边框宽度
      },
    },
  },
  collectionCoverageRate: {
    name: "采集覆盖率",
    type: "bar",
    barWidth: 20,
    itemStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 1,
          color: "rgba(185, 50, 251, 0.38)",
        },
        {
          offset: 0,
          color: "rgba(93, 163, 249, 1)",
        },
      ]),
      // 鼠标悬浮状态下的样式
      emphasis: {
        borderColor: "#ffffff", // 高亮边框颜色
        borderWidth: 2, // 高亮边框宽度
      },
    },
  },
  coverLine: {
    name: "采集覆盖率",
    type: "line",
    lineStyle: {
      color: LINE_COLOR[0],
    },
    // itemStyle: { color: LINE_COLOR[0] },
    showSymbol: false,
  },
  completeLine: {
    name: "数据完整率",
    type: "line",
    lineStyle: {
      color: LINE_COLOR[1],
    },
    showSymbol: false,
  },
  legalLine: {
    name: "数据合规率",
    type: "line",
    lineStyle: {
      color: LINE_COLOR[2],
    },
    showSymbol: false,
  },
  communicateLine: {
    name: "通讯正常率",
    type: "line",
    lineStyle: {
      color: LINE_COLOR[3],
    },
    showSymbol: false,
  },
  fileUploadLine: {
    name: "文件上传率",
    type: "line",
    lineStyle: {
      color: LINE_COLOR[4],
    },
    showSymbol: false,
  },
}
