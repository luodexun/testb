import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

// import AllImg from "@/assets/hubei-screen/all.png"
import Control from "@/assets/jiangsu-screen/control.png"
import PVINV from "@/assets/jiangsu-screen/PVINV.png"
import WT from "@/assets/jiangsu-screen/WT.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
import { judgeNull, parseNum } from "@/utils/util-funs"
import { useMemo } from "react"

export interface geoChartData extends IBaseChartOption {
  series: any
  screenWidth?: number
  controlData?: any
}
const imageList = {
  WT,
  PVINV,
  Control,
}
const imageTrans = (data) => {
  if (data.stnDeviceType === "ALL") {
    return "circle"
  }
  return "image://" + imageList[data.stnDeviceType]
}
const layoutSizeTrans = (name) => {
  let size = ""
  size = name === "华中" || name === "四川" ? "270%" : "90%"
  return size
}
const sizeTrans = (data, screenWidth) => {
  if (data.stnDeviceType === "PVINV") {
    return [30 * (screenWidth / 6400), 26 * (screenWidth / 6400)]
  } else if (data.stnDeviceType === "WT") {
    return [32 * (screenWidth / 6400), 46 * (screenWidth / 6400)]
  }
  return [40 * (screenWidth / 6400), 60 * (screenWidth / 6400)]
}
export function geoOption(params: geoChartData) {
  const { series, screenWidth, controlData } = params || { series: [], large: false }
  const option: echarts.EChartsOption = {
    grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: true },
    dataZoom: baseDataZoom,
    legend: {
      ...baseLegend,
    },
    tooltip: {
      show: false,
    },
    // toolbox: getToolbox("发电量报表"),
    // 地图阴影配置
    geo: [
      {
        layoutCenter: ["50%", "50%"], //位置
        layoutSize: "90%", //大小
        map: "江苏框",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 1,
        label: {
          show: true,
          color: "rgba(255, 255, 255, 0.5)",
        },
        itemStyle: {
          areaColor: "RGBA(7, 78, 137, 0.2)",
          borderColor: "#c0f3fb",
          borderWidth: 1,
        },
      },
      {
        layoutCenter: ["50%", "50%"], //位置
        layoutSize: "90%", //大小
        show: true,
        map: "江苏",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 0,
        label: {
          show: false,
        },
        itemStyle: {
          areaColor: "RGBA(7, 78, 137, 1)",
          borderColor: "RGBA(22, 111, 170, 1)",
          borderWidth: 1,
          borderType: "dashed",
          shadowColor: "#8cd3ef",
          // shadowOffsetY: 10,
          // shadowBlur: large ? 120 : 10,
          // emphasis: {
          //     areaColor: "rgba(0,254,233,0.6)",
          //     // borderWidth: 0
          // }
        },
      },
      {
        type: "map",
        map: "江苏框",
        zlevel: -1,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "51%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 1,
          // borderColor:"rgba(17, 149, 216,0.6)",
          borderColor: "RGBA(22, 111, 170, 1)",
          shadowColor: "RGBA(22, 111, 170, 1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "RGBA(22, 111, 170, 0.6)",
        },
      },
      {
        type: "map",
        map: "江苏框",
        zlevel: -2,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "52%"],
        layoutSize: "90", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 1,
          // borderColor: "rgba(57, 132, 188,0.4)",
          borderColor: "RGBA(22, 111, 170, 1)",
          shadowColor: "RGBA(22, 111, 170, 1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "RGBA(22, 111, 170, 0.8)",
        },
      },
      {
        type: "map",
        map: "江苏框",
        zlevel: -3,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "53%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 1,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "RGBA(22, 111, 170, 1)",
          shadowColor: "RGBA(22, 111, 170, 1)",
          shadowOffsetY: 15,
          shadowBlur: 10,
          areaColor: "RGBA(22, 111, 170, 0.3)",
        },
      },
      {
        type: "map",
        map: "江苏框",
        zlevel: -4,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "54%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 5,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "RGBA(22, 111, 170, 1)",
          shadowColor: "rgba(29, 111, 165,0.8)",
          // shadowOffsetY: 15,
          // shadowBlur: 10,
          areaColor: "RGBA(22, 111, 170, 0.5)",
        },
      },
    ],
    series: [
      // 地图配置
      {
        type: "map",
        map: "江苏框",
        geoIndex: 0,
        aspectScale: 1, //长宽比
        zoom: 1,
        showLegendSymbol: true,
        roam: true,
        label: {
          show: true,
          // textStyle: {
          //     color: "#fff",
          //     fontSize: "120%"
          // },
        },
        itemStyle: {
          areaColor: {
            type: "linear",
            x: 1200,
            y: 0,
            x2: 0,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: "rgba(3,27,78,0.75)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(58,149,253,0.75)", // 50% 处的颜色
              },
            ],
            global: true, // 缺省为 false
          },
          borderColor: "#fff",
          borderWidth: 0.2,
        },
        layoutCenter: ["50%", "50%"],
        layoutSize: "90%", //大小
        animation: false,
        markPoint: {
          symbol: "none",
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
        // data: data,
      },
      // 点
      {
        // name: "物资",d
        type: "scatter",
        coordinateSystem: "geo",
        data: series,
        symbol: (value, params) => {
          return imageTrans(params.data)
        },
        symbolSize: (value, params) => {
          return sizeTrans(params.data, screenWidth)
        },
        // symbolKeepAspect: true,
        symbolOffset: [0, "-50%"],
        label: {
          show: false,
          formatter: function (params) {
            return params.name
          },
          align: "center",
          position: "bottom",
          // distance: -80 * (screenWidth / 6400),
          color: "rgba(0, 242, 255, 1)",
          fontSize: 12 * (screenWidth / 6400),
        },
        zlevel: 5,
        geoIndex: 1,
        // geo3DIndex: 0,
        tooltip: {
          show: true,
          backgroundColor: "rgba(0,0,0,0)",
          borderWidth: 0,
          shadowBlur: 0,
          padding: 0,
          shadowColor: "rgba(0, 0, 0, 0)",
          formatter: (params) => {
            const render = <ToolTipBox params={params} controlData={controlData} />
            const renderToString = ReactDOMServer.renderToString(render)
            return renderToString
          },
        },
        // emphasis: {},
        z: 3,
      },
    ],
  }
  return option
}
const mapQuota = {
  WT: [
    { name: "风速：", key: "windSpeed", unit: "m/s" },
    { name: "功率：", key: "activePower", unit: "万kW" },
    { name: "日发电量：", key: "dailyProduction", unit: "万kWh" },
  ],
  PVINV: [
    { name: "辐照度：", key: "totalIrradiance", unit: "W/㎡" },
    { name: "功率：", key: "activePower", unit: "万kW" },
    { name: "日发电量：", key: "dailyProduction", unit: "万kWh" },
  ],
  ESPCS: [{ name: "功率：", key: "activePower", unit: "万kW" }],
  SYZZZ: [{ name: "功率：", key: "activePower", unit: "万kW" }],
  Control: [
    { name: "总功率：", key: "activePower", unit: "万kW" },
    { name: "日发电量：", key: "dailyProduction", unit: "万kWh" },
  ],
}
function ToolTipBox({ params, controlData }) {
  const actualData = useMemo(() => {
    if (params.data?.stnDeviceType === "Control") {
      return {
        data: {
          name: "集控中心",
          stnDeviceType: "Control",
          ...controlData,
        },
      }
    }
    return params
  }, [params, controlData])
  return (
    <div className="js-map-tbox">
      <div className="map-tbox-title">{actualData?.data?.name || "-"}</div>
      <div className="map-tbox-cnt">
        {mapQuota[actualData?.data?.stnDeviceType]?.map((i) => {
          return (
            <div className="map-cnt-item" key={i.key}>
              <span className="cnt-item-name">{i.name}</span>
              <span className="cnt-item-value">{judgeNull(actualData?.data?.[i.key])}</span>
              <span className="cnt-item-unit">{i.unit}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
