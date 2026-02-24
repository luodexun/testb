import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

// import AllImg from "@/assets/hubei-screen/all.png"
import Control from "@/assets/ningxia-screen/control.png"
import PVINV from "@/assets/ningxia-screen/PVINV.png"
import ESPCS from "@/assets/ningxia-screen/ESPCS.png"
import WT from "@/assets/ningxia-screen/WT.png"
import SYZZZ from "@/assets/ningxia-screen/SYZZZ.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
import { judgeNull, parseNum } from "@/utils/util-funs"
import { TEMPORARY_LAT_LONG } from "."
import { useMemo } from "react"

export interface geoChartData extends IBaseChartOption {
  series: any
  controlData?: any
  screenWidth?: number
}
const imageList = {
  WT,
  PVINV,
  Control,
  ESPCS,
  SYZZZ,
}
const imageTrans = (data) => {
  if (data.stnDeviceType === "ALL") {
    return "circle"
  }
  return "image://" + imageList[data.stnDeviceType]
}

const sizeTrans = (data, screenWidth) => {
  if (data.stnDeviceType === "PVINV") {
    return [30 * (screenWidth / 4230), 26 * (screenWidth / 4230)]
  } else if (data.stnDeviceType === "WT") {
    return [32 * (screenWidth / 4230), 46 * (screenWidth / 4230)]
  }
  return [40 * (screenWidth / 4230), 36 * (screenWidth / 4230)]
}
export function geoOption(params: geoChartData) {
  const { series, controlData, screenWidth } = params || { series: [] }
  const option: echarts.EChartsOption = {
    grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: true },
    dataZoom: baseDataZoom,
    legend: {
      ...baseLegend,
    },
    tooltip: {
      show: false,
      triggerOn: "mousemove|click",
    },
    // toolbox: getToolbox("发电量报表"),
    // 地图阴影配置
    geo: [
      {
        layoutCenter: ["50%", "50%"], //位置
        layoutSize: "90%", //大小
        map: "宁夏框",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 1,
        label: {
          show: true,
          color: "rgba(255, 255, 255, 0.5)",
        },
        itemStyle: {
          areaColor: "RGBA(6, 83, 192, 0.2)",
          borderColor: "RGBA(255, 255, 255, 1)",
          borderWidth: 3,
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
      {
        layoutCenter: ["50%", "50%"], //位置
        layoutSize: "90%", //大小
        show: true,
        map: "宁夏",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 0,
        label: {
          show: false,
        },
        itemStyle: {
          areaColor: "RGBA(10, 122, 197, 0.8)",
          borderColor: "RGBA(150, 252, 179, 1)",
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
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
      {
        type: "map",
        map: "宁夏框",
        zlevel: -1,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "51%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          // borderColor:"rgba(17, 149, 216,0.6)",
          borderColor: "RGBA(0, 221, 253, 1)",
          shadowColor: "RGBA(0, 173, 157, 1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "RGBA(22, 111, 170, 0.2)",
        },
      },
      {
        type: "map",
        map: "宁夏框",
        zlevel: -2,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "52%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          // borderColor:"rgba(17, 149, 216,0.6)",
          borderColor: "RGBA(0, 221, 253, 1)",
          shadowColor: "RGBA(0, 173, 157, 1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "RGBA(22, 111, 170, 0.2)",
        },
      },
      // {
      //   type: "map",
      //   map: "宁夏框",
      //   zlevel: -2,
      //   aspectScale: 1,
      //   zoom: 1,
      //   layoutCenter: ["50%", "52%"],
      //   layoutSize: "90", //大小
      //   roam: false,
      //   silent: true,
      //   itemStyle: {
      //     borderWidth: 0.8,
      //     // borderColor: "rgba(57, 132, 188,0.4)",
      //     borderColor: "RGBA(0, 221, 253, 1)",
      //     shadowColor: "RGBA(22, 111, 170, 1)",
      //     shadowOffsetY: 5,
      //     shadowBlur: 15,
      //     areaColor: "transpercent",
      //   },
      // },
      {
        type: "map",
        map: "宁夏框",
        zlevel: -3,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "53%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 3,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "RGBA(6, 83, 192, 0.4)",
          shadowColor: "RGBA(0, 173, 157, 1)",
          shadowOffsetY: 2,
          shadowBlur: 10,
          areaColor: "RGBA(22, 111, 170, 0.2)",
        },
      },
      {
        type: "map",
        map: "宁夏框",
        zlevel: -4,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "54%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderColor: "RGBA(6, 83, 192, 0.4)",
          shadowColor: "RGBA(0, 173, 157, 1)",
          shadowOffsetY: 2,
          // shadowOffsetY: 15,
          // shadowBlur: 10,
          areaColor: "RGBA(22, 111, 170, 1)",
        },
      },
    ],
    series: [
      // 地图配置
      {
        type: "map",
        map: "宁夏框",
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
        selectedMode: false,
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
      {
        type: "lines",
        coordinateSystem: "geo",
        geoIndex: 1,
        effect: {
          show: series?.length > 1,
        },
        lineStyle: {
          color: "RGBA(0, 241, 229, 1)",
          width: 2,
          curveness: 0.3,
        },
        data:
          series
            ?.filter((i) => i.stnDeviceType !== "Control")
            ?.map((i) => {
              return {
                coords: [i.value, [106.0628, 36.3686]],
              }
            }) || [],
      },
    ],
  }
  return option
}
const mapQuota = {
  WT: [
    { name: "风速：", key: "windSpeed", unit: "m/s" },
    { name: "功率：", key: "activePower", unit: "万kW" },
  ],
  PVINV: [
    { name: "辐照度：", key: "totalIrradiance", unit: "W/㎡" },
    { name: "功率：", key: "activePower", unit: "万kW" },
  ],
  ESPCS: [{ name: "功率：", key: "activePower", unit: "万kW" }],
  SYZZZ: [{ name: "功率：", key: "activePower", unit: "万kW" }],
  Control: [{ name: "总功率：", key: "activePower", unit: "万kW" }],
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
    <div className="nx-map-tbox">
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
