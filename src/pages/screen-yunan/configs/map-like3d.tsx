import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

// import AllImg from "@/assets/hubei-screen/all.png"
import Control from "@/assets/yunnan-screen/control.png"
import PVINV from "@/assets/yunnan-screen/PVINV.png"
import WT from "@/assets/yunnan-screen/WT.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"
import { TEMPORARY_LAT_LONG } from "."

export interface geoChartData extends IBaseChartOption {
  series: any
  screenWidth?: number
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
    return [30 * (screenWidth / 3456), 26 * (screenWidth / 3456)]
  } else if (data.stnDeviceType === "WT") {
    return [32 * (screenWidth / 3456), 46 * (screenWidth / 3456)]
  }
  return [40 * (screenWidth / 3456), 36 * (screenWidth / 3456)]
}
export function geoOption(params: geoChartData) {
  const { series, screenWidth } = params || { series: [], large: false, mapName: "华中" }
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
        map: "云南框",
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
        map: "云南",
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
        map: "云南框",
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
        map: "云南框",
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
      //   map: "云南框",
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
        map: "云南框",
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
        map: "云南框",
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
        map: "云南框",
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
      {
        type: "effectScatter" as any,
        coordinateSystem: "geo",
        data: series.filter((i) => i.stnDeviceType !== "Control"),
        symbolSize: function () {
          return 12
        },
        showEffectOn: "render" as any,
        rippleEffect: {
          brushType: "stroke" as any,
          scale: 3, //设置缩放
          period: 3, //设置时间
        },
        // hoverAnimation: true,
        itemStyle: {
          color: "RGBA(152, 255, 0, 1)",
          shadowBlur: 10,
          shadowColor: "RGBA(152, 255, 0, .7))",
        },
        label: {
          show: true,
          formatter: function (params) {
            return params.name
          },
          align: "center",
          position: "bottom",
          distance: 10 * (screenWidth / 3456),
          color: "rgba(0, 242, 255, 1)",
          fontSize: 14 * (screenWidth / 3456),
        },
        emphasis: {
          focus: "none",
          scale: 1.5,
        },
        // select: {},
        zlevel: 5,
        // geo3DIndex: 0,
        tooltip: {
          show: true,
          triggerOn: "click",
          backgroundColor: "rgba(0,0,0,0)",
          borderWidth: 0,
          shadowBlur: 0,
          padding: 0,
          shadowColor: "rgba(0, 0, 0, 0)",
          formatter: (params) => {
            const render = <ToolTipBox params={params} />
            const renderToString = ReactDOMServer.renderToString(render)
            return renderToString
          },
        },
        // emphasis: {},
        z: 3,
      },
      // 点
      {
        // name: "物资",d
        type: "scatter",
        coordinateSystem: "geo",
        data: TEMPORARY_LAT_LONG?.filter((i) => i.stnDeviceType === "Control"),
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
            const render = <ToolTipBox params={params} />
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
const mapQuota = [
  { name: "风速(m/s)：", key: "windSpeed" },
  { name: "功率(万kW)：", key: "activePower" },
  { name: "日发电量(万kWh)：", key: "dailyProduction" },
]
function ToolTipBox({ params }) {
  return (
    <div className="map-tbox">
      <div className="map-tbox-title">{params?.data?.name || "-"}</div>
      {/* <div className="map-tbox-cnt">
        {mapQuota.map((i) => {
          return (
            <div className="map-cnt-item" key={i.key}>
              <span className="cnt-item-value">
                {i.name} {parseNum(params?.data?.[i.key]) || "-"}
              </span>
            </div>
          )
        })}
      </div> */}
    </div>
  )
}
