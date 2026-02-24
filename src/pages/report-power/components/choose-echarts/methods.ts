/*
 * @Author: chenmeifeng
 * @Date: 2023-11-27 17:22:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-26 14:17:11
 * @Description:
 */

import { StorageChartChoose } from "@/configs/storage-cfg"
import { getStorage, parseNum } from "@/utils/util-funs"

import { TRpXDataItem, XDATA_MODEL, XDATA_DEVICE, XDATA_LINE, XDATA_LIST, XDATA_PERIOD, XDATA_STATION, XDATA_REGION, XDATA_PROJECT, XDATA_MAINTENANCE} from "./configs"
let xDataOption = []

// import { SERIES_LIST } from "./choose-key-config"
export const getValuesBaseKey = (data, key) => {
  return (data.length && data.map((i) => i[key])) || []
}

// echart图series数据处理
export const getSeriesListBaseKey = (data) => {
  let series
  const { chartsType } = data
  if (chartsType === "line" || chartsType === "bar" || chartsType === "lineArea" || chartsType === "horizontalBar") {
    series = getLineAndBarSeries(data)
  } else if (chartsType === "pie") {
    series = getPieSeries(data)
  } else if (chartsType === "radar") {
    series = getRadarSeries(data)
  } else if (chartsType === "funnel") {
    series = getFunnelSeries(data)
  } else if (chartsType === "conbination") {
    series = getConbntSeries(data)
  } else if (chartsType === "stacking") {
    series = getStackingSeries(data)
  }
  return series
}

/*
 * 功能：折线图和柱状图series集合
 * @params: dataSource 数据源
 * @params: keyLists 指标数组
 * @params: chartsType 图表类型
 * @params: xData x轴指标
 */
export const getLineAndBarSeries = ({ dataSource: data, keyLists, chartsType, keyValueList }) => {
  const series = []
  // 折线图和柱状图series
  keyLists.forEach((item) => {
    series.push({
      name: keyValueList?.find((i) => i.dataIndex === item)?.title || item,
      type: getChartType(chartsType),
      areaStyle: chartsType === "lineArea" ? {} : null,
      data: getValuesBaseKey(data, item),
    })
  })
  return series
}

// 堆叠图
export const getStackingSeries = ({ dataSource: data, keyLists, chartsType, keyValueList }) => {
  const series = []
  // 折线图和柱状图series
  keyLists.forEach((item) => {
    series.push({
      name: keyValueList?.find((i) => i.dataIndex === item)?.title || item,
      type: getChartType(chartsType),
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: getValuesBaseKey(data, item),
    })
  })
  return series
}

// 组合图
export const getConbntSeries = ({ dataSource: data }) => {
  const series = []
  const chooseChartList = getStorage(StorageChartChoose)
  // 折线图和柱状图series
  chooseChartList.forEach((item) => {
    series.push({
      name: item.name,
      type: getChartType(item.chartType),
      areaStyle: item.chartType === "lineArea" ? {} : null,
      data: getValuesBaseKey(data, item.key),
    })
  })
  return series
}

// 饼图series集合
export const getPieSeries = ({ dataSource: data, keyLists, chartsType, keyValueList, xData }) => {
  const series = []
  keyLists = [keyLists]
  keyLists.forEach((item) => {
    series.push({
      name: keyValueList?.find((i) => i.dataIndex === item)?.title || item,
      type: chartsType,
      radius: "50%",
      data: data.map((i) => {
        return {
          value: parseNum(i[item]),
          name: i[xData] + getSeriesDataName(xData, i),
        }
      }),
    })
  })
  return series
}

// 雷达图series集合
export const getRadarSeries = ({ dataSource: data, keyLists, xData }) => {
  const series = []
  // 雷达图
  const seriesData = data.map((i) => {
    return {
      name: i[xData] + getSeriesDataName(xData, i),
      value: keyLists?.map((item) => i[item]),
    }
  })
  series.push({
    type: "radar",
    data: seriesData,
  })
  return series
}

//  漏斗图series集合
export const getFunnelSeries = ({ dataSource: data, keyLists, keyValueList, xData }) => {
  let series = {}
  series = {
    name: keyValueList?.find((i) => i.dataIndex === keyLists)?.title || keyLists,
    data: data.map((i) => {
      return {
        value: parseNum(i[keyLists]),
        name: i[xData] + getSeriesDataName(xData, i),
      }
    }),
  }
  return series
}

export const getXDataList = (data, xData) => {
  const result = data?.map((i) => i[xData] + getSeriesDataName(xData, i))
  return result
}

/*
 * 功能：echarts-雷达图radar数据处理
 * @params: dataSource 数据源
 * @params: keyLists 指标数组
 * @params: keyValueList
 */
export const getRadarInfo = ({ keyLists, dataSource, keyValueList }) => {
  let indicator = []
  const seriesData =
    dataSource?.map((i) => {
      return {
        name: i.stationName,
        value: keyLists.map((item) => i[item] || 0),
      }
    }) || []
  // 获取数据集中的最大值
  const maxValue = Math.max(...seriesData.map((item) => Math.max(...item.value)))
  const max = maxValue + maxValue / 15

  indicator = keyLists.map((i) => {
    return {
      name: keyValueList.find((j) => j.dataIndex === i)?.title || i,
      max: max,
    }
  })
  return {
    indicator,
  }
}

// 获取x轴下拉框数据
export const getXDataIndex = (type: TRpXDataItem) => {
  xDataOption = []
  switch (type) {
    case "REGION_COM_ID":
      xDataOption = XDATA_LIST.concat(XDATA_REGION)
      break
    case "PROJECT_COM_ID":
      xDataOption = XDATA_LIST.concat(XDATA_PROJECT)
      break
    case "MAINTENANCE_COM_ID":
      xDataOption = XDATA_LIST.concat(XDATA_MAINTENANCE)
      break
    case "STATION_CODE":
      xDataOption = XDATA_LIST.concat(XDATA_STATION)
      break
    case "PERIOD":
      xDataOption = XDATA_LIST.concat(XDATA_STATION,XDATA_PERIOD)
      break
    case "LINE":
      xDataOption = XDATA_LIST.concat(XDATA_STATION,XDATA_LINE)
      break
    case "DEVICE_CODE":
      xDataOption = XDATA_LIST.concat(XDATA_STATION,XDATA_DEVICE)
      break
    case "MODEL":
      xDataOption = XDATA_LIST.concat(XDATA_STATION,XDATA_MODEL)
      break
    default:
      xDataOption = XDATA_LIST
  }
  return xDataOption
}

// 获取数据系列名称
export const getSeriesDataName = (xData, data) => {
  const allXDtOption = xDataOption.map((i) => i.value)
  const noExistList = allXDtOption.filter((i) => i !== xData)
  let result = ""
  noExistList?.forEach((i) => {
    result = result + "-" + data[i]
  })
  return result
}

// 根据type分类出图表类型
export const getChartType = (type) => {
  let chartType
  switch (type) {
    case "bar":
    case "horizontalBar":
    case "stacking":
      chartType = "bar"
      break
    case "line":
    case "lineArea":
      chartType = "line"
      break
    case "pie":
      chartType = "pie"
      break
    case "radar":
      chartType = "radar"
      break
  }
  return chartType
}
