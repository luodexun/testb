import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import ALL from "@/assets/hubei-screen/all.png"
// import AllImg from "@/assets/hubei-screen/all.png"
import ESPCS from "@/assets/hubei-screen/new/ESPCS.png"
import PVINV from "@/assets/hubei-screen/new/PVINV.png"
import WT from "@/assets/hubei-screen/new/WT.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

export interface geoChartData extends IBaseChartOption {
  series: any
  screenWidth?: number
  mapName: string
  large?: boolean
}
const imageList = {
  WT,
  PVINV,
  ESPCS,
  ALL,
}
const imageTrans = (data) => {
  if (data.stnDeviceType === "ALL") {
    return "circle"
  }
  return "image://" + imageList[data.stnDeviceType]
}
const layoutSizeTrans = (name) => {
  let size = ""
  size = name === "广东" ? "140%" : name === "广西" ? "130%" : "95%"
  return size
}
const sizeTrans = (data, screenWidth) => {
  if (data.type === "PVINV") {
    return [33 * (screenWidth / 3840), 23 * (screenWidth / 3840)]
  } else if (data.type === "ESPCS") {
    return [33 * (screenWidth / 3840), 20 * (screenWidth / 3840)]
  } else if (data.type === "ALL") {
    // return [62 * (screenWidth / 3840), 80 * (screenWidth / 3840)]
    return 20
  }
  return [33 * (screenWidth / 3840), 23 * (screenWidth / 3840)]
}
const getMapName = (name) => {
  return name === "山西" || name === "广东" || name === "广西" ? `${name}框` : name
}
const isOutLayerMap = (name) => {
  return name === "山西" || name === "广东" || name === "广西"
}
export function geoOption(params: geoChartData) {
  const { series, screenWidth, mapName, large } = params || { series: [], large: false, mapName: "山西" }
  // console.log(params, series, "sesdf")
  const scatter = isOutLayerMap(mapName)
    ? ({
        type: "effectScatter" as any,
        coordinateSystem: "geo",
        data: series,
        symbolSize: function () {
          return 12
        },
        showEffectOn: "render" as any,
        rippleEffect: {
          brushType: "stroke" as any,
          scale: 3, //设置缩放
          period: 3, //设置时间
        },
        hoverAnimation: true,
        itemStyle: {
          normal: {
            color: "RGBA(152, 255, 0, 1)",
            shadowBlur: 10,
            shadowColor: "RGBA(152, 255, 0, .7))",
          },
        },
        label: {
          show: true,
          formatter: function (params) {
            return params.name
          },
          align: "center",
          position: "bottom",
          // distance: -80 * (screenWidth / 3840),
          color: "rgba(0, 242, 255, 1)",
          fontSize: 16 * (screenWidth / 3840),
        },
        zlevel: 5,
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
      } as any)
    : {
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
          show: true,
          formatter: function (params) {
            return params.name
          },
          align: "center",
          position: "bottom",
          // distance: -80 * (screenWidth / 3840),
          color: "rgba(0, 242, 255, 1)",
          fontSize: 12 * (screenWidth / 3840),
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
      }
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
        layoutSize: layoutSizeTrans(mapName), //大小
        show: isOutLayerMap(mapName),
        map: getMapName(mapName),
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 1,
        label: {
          show: false,
          color: "rgba(255, 242, 255, 1)",
          fontSize: 16 * (screenWidth / 3840),
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
                color: "rgba(3,27,78,0.05)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(30, 146, 241, 0.29)", // 50% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          borderColor: "#c0f3fb",
          borderWidth: 1,
        },
      },
      {
        layoutCenter: ["50%", "50%"], //位置
        layoutSize: layoutSizeTrans(mapName), //大小
        show: true,
        map: mapName,
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 0,
        label: {
          show: false,
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
          borderColor: isOutLayerMap(mapName) ? "rgba(207, 228, 245, 0.27)" : "#c0f3fb",
          borderWidth: 1,
          borderType: isOutLayerMap(mapName) ? "dashed" : "solid",
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
        map: getMapName(mapName),
        zlevel: -1,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "51%"],
        layoutSize: layoutSizeTrans(mapName), //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 1,
          // borderColor:"rgba(17, 149, 216,0.6)",
          borderColor: "rgba(58,149,253,0.8)",
          shadowColor: "rgba(172, 122, 255,0.5)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "rgba(5,21,35,0.1)",
        },
      },
      {
        type: "map",
        map: getMapName(mapName),
        zlevel: -2,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "52%"],
        layoutSize: layoutSizeTrans(mapName), //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 1,
          // borderColor: "rgba(57, 132, 188,0.4)",
          borderColor: "rgba(58,149,253,0.6)",
          shadowColor: "rgba(65, 214, 255,1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "transpercent",
        },
      },
      {
        type: "map",
        map: getMapName(mapName),
        zlevel: -3,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "53%"],
        layoutSize: layoutSizeTrans(mapName), //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 1,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "rgba(58,149,253,0.4)",
          shadowColor: "rgba(58,149,253,1)",
          shadowOffsetY: 15,
          shadowBlur: 10,
          areaColor: "transpercent",
        },
      },
      {
        type: "map",
        map: getMapName(mapName),
        zlevel: -4,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "54%"],
        layoutSize: layoutSizeTrans(mapName), //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 5,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "rgba(5,9,57,0.8)",
          shadowColor: "rgba(29, 111, 165,0.8)",
          shadowOffsetY: 15,
          shadowBlur: 10,
          areaColor: "rgba(5,21,35,0.1)",
        },
      },
    ],
    series: [
      // 地图配置
      {
        type: "map",
        map: mapName || "山西",
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
        layoutSize: layoutSizeTrans(mapName), //大小
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
      scatter,
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
      <div className="map-tbox-cnt">
        {mapQuota.map((i) => {
          return (
            <div className="map-cnt-item" key={i.key}>
              <span className="cnt-item-value">
                {i.name} {parseNum(params?.data?.[i.key]) || "-"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
