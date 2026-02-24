import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import ALL from "@/assets/common-screen/all.png"
// import AllImg from "@/assets/hubei-screen/all.png"
import ESPCS from "@/assets/common-screen/ESPCS.png"
import PVINV from "@/assets/common-screen/PVINV.png"
import WT from "@/assets/common-screen/WT.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"

interface IToolCom {
  name: string
  unit: number
  id: number
  key: string
}
export interface geoChartData extends IBaseChartOption {
  series: any
  screenWidth?: number
  mapName?: string
  geoInfo?: {
    zoom?: number
    center?: any
  }
  sGeoInfo?: {
    zoom?: number
    center?: any
  }
}
const imageList = {
  WT,
  PVINV,
  ESPCS,
  ALL,
}
const imageTrans = (data) => {
  return "image://" + imageList[data.stnDeviceType]
}
const sizeTrans = (data, screenWidth) => {
  if (data.type === "PVINV") {
    return [62 * (screenWidth / 4513), 80 * (screenWidth / 4513)]
  } else if (data.type === "ESPCS") {
    return [62 * (screenWidth / 4513), 80 * (screenWidth / 4513)]
  } else if (data.type === "ALL") {
    return [62 * (screenWidth / 4513), 80 * (screenWidth / 4513)]
  }
  return [69 * (screenWidth / 4513), 85 * (screenWidth / 4513)]
}
export function geoOption(params: geoChartData) {
  const { series, screenWidth, mapName, geoInfo, sGeoInfo } = params || {
    series: [],
    mapName: "广东",
    geoInfo: { zoom: 1.012 },
    sGeoInfo: { zoom: 1 },
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
        map: mapName || "广东",
        // 这里必须定义，不然后面series里面不生效
        tooltip: {
          show: false,
        },
        label: {
          show: false,
        },
        // zoom: 1.012,
        ...geoInfo,
        silent: true, // 不响应鼠标时间
        show: true,
        roam: true, // 地图缩放和平移
        scaleLimit: {
          min: 0.9,
        },
        animationDurationUpdate: 0,
        aspectScale: 0.95, // scale 地图的长宽比
        itemStyle: {
          borderColor: "#019AE6",
          borderWidth: 1,
          areaColor: "#184AAD",
          shadowColor: "#4076FF",
          shadowBlur: 30,
        },
        select: {
          disabled: true,
        },
        emphasis: {
          disabled: true,
          // areaColor: "#00F1FF",
        },
        // 地图区域的多边形 图形样式 阴影效果
        // z值小的图形会被z值大的图形覆盖
        layoutCenter: ["50%", "50%"], //地图位置
        // 去除南海诸岛阴影 series map里面没有此属性
        z: 1,
      },
    ],
    series: [
      // 地图配置
      {
        type: "map",
        map: mapName || "广东",
        // zoom: 1,
        ...sGeoInfo,
        tooltip: {
          show: false,
        },
        label: {
          show: false, // 显示省份名称
          color: "#04CFF5",
          align: "center",
          fontSize: "3em",
        },
        layoutCenter: ["50%", "50%"], //地图位置
        aspectScale: 0.95,
        roam: true, // 地图缩放和平移
        scaleLimit: {
          min: 0.9,
        },
        animationDurationUpdate: 0,
        itemStyle: {
          borderColor: "#0FA3F0", // 省分界线颜色  阴影效果的
          borderWidth: 1,
          areaColor: "#02308B",
          opacity: 1,
          // shadowColor: "#4076FF",
          // shadowBlur: 30 * (screenWidth / 4513),
          // shadowOffsetX: -30 * (screenWidth / 4513), //
          // shadowOffsetY: 30 * (screenWidth / 4513),
        },
        // 去除选中状态
        select: {
          disabled: true,
        },
        emphasis: {
          // 聚焦后颜色
          disabled: true, // 开启高亮
          label: {
            align: "center",
            color: "#04CFF5",
          },
          itemStyle: {
            color: "#ffffff",
            areaColor: "#0a8bd8", // 阴影效果 鼠标移动上去的颜色
          },
        },
        z: 2,
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
          show: true,
          formatter: function (params) {
            return params.name
          },
          align: "center",
          position: "bottom",
          // distance: -80 * (screenWidth / 4513),
          color: "#ffffff",
          fontSize: 25 * (screenWidth / 4513),
        },
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
