import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import ALL from "@/assets/hubei-screen/all.png"
// import AllImg from "@/assets/hubei-screen/all.png"
import ESPCS from "@/assets/hubei-screen/ESPCS.png"
import PVINV from "@/assets/hubei-screen/PVINV.png"
import WT from "@/assets/hubei-screen/WT.png"
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
}
const imageList = {
  WT,
  PVINV,
  ESPCS,
  ALL,
}
const imageTrans = (data) => {
  console.log("image://" + data.stnDeviceType, "dfsf")

  // return "image://" + imageList[data.stnDeviceType]
  return "path://M133 409 c-37 -11 -73 -52 -73 -84 0 -28 71 -172 101 -203 26 -29 32 -24 84 67 52 93 63 142 41 176 -18 27 -72 56 -103 54 -10 0 -32 -5 -50 -10z m72 -63 c16 -12 17 -16 6 -30 -7 -9 -21 -16 -31 -16 -10 0 -24 7 -31 16 -11 14 -10 18 6 30 10 8 22 14 25 14 3 0 15 -6 25 -14z"
}
const sizeTrans = (data, screenWidth) => {
  console.log(data, "dskjf")

  if (data.type === "PVINV") {
    return [62 * (screenWidth / 6500), 80 * (screenWidth / 6400)]
  } else if (data.type === "ESPCS") {
    return [62 * (screenWidth / 6400), 80 * (screenWidth / 6400)]
  } else if (data.type === "ALL") {
    return [62 * (screenWidth / 6400), 80 * (screenWidth / 6400)]
  }
  return [32 * (screenWidth / 6400), 40 * (screenWidth / 6400)]
}
export function geoOption(params: geoChartData) {
  const { series, screenWidth } = params || { series: [] }
  // console.log(params, series, "sesdf")

  const option: echarts.EChartsOption = {
    grid: { left: 0, right: 0, top: 0, bottom: 0, containLabel: true },
    dataZoom: baseDataZoom,
    legend: {
      ...baseLegend,
    },
    tooltip: {
      show: true,
      backgroundColor: "rgba(0,0,0,0)",
      borderWidth: 0,
      shadowBlur: 0,
      padding: 0,
      shadowColor: "rgba(0, 0, 0, 0)",
      formatter: (params) => {
        console.log(222)

        const render = <ToolTipBox params={params} />
        const renderToString = ReactDOMServer.renderToString(render)
        return renderToString
      },
    },
    // toolbox: getToolbox("发电量报表"),
    geo3D: [
      {
        map: "江苏框",
        type: "map",
        show: true,
        // zlevel: -1, // 必须设置，
        silent: true,
        top: -100,
        viewControl: {
          distance: 220,
          alpha: 50,
          // 限制视角，使不能旋转缩放平移
          // rotateSensitivity: 0,
          // zoomSensitivity: 0,
          // panSensitivity: 0,
        },
        // boxHeight: 10,
        regionHeight: 4,
        itemStyle: {
          // 三维地理坐标系组件 中三维图形的视觉属性，包括颜色，透明度，描边等。
          color: "RGBA(7, 78, 138, 0.4)", // 地图板块的颜色
          opacity: 0, // 图形的不透明度 [ default: 1 ]
          borderWidth: 1, // (地图板块间的分隔线)图形描边的宽度。加上描边后可以更清晰的区分每个区域   [ default: 0 ]
          borderColor: "#48EAFF", // 图形描边的颜色。[ default: #333 ]
          emphasis: {
            disabled: true,
          },
        },
        label: {
          show: true,
          color: "rgba(255, 255, 255, 0.5)",
        },
        // emphasis: {
        //   //高亮状态的效果
        //   disabled: true, // 关闭高亮
        //   label: {
        //     show: false,
        //     color: "#ff0000",
        //   },
        //   itemStyle: {
        //     // show: false,
        //     color: "#539efe",
        //   },
        // },
        zlevel: -1,
      },
    ],
    series: [
      // 地图配置
      {
        type: "map3D" as any,
        map: "江苏",
        top: -100,
        viewControl: {
          // 须与geo3D中相同，
          distance: 220,
          alpha: 50,
          //   beta: 0,
          //   minBeta: -360,
          //   maxBeta: 720,
          // 限制视角，使不能旋转缩放平移
          // rotateSensitivity: 0,
          // zoomSensitivity: 0,
          // panSensitivity: 0,
        },
        // boxHeight: 10,
        regionHeight: 4,
        tooltip: {
          show: false,
        },
        itemStyle: {
          color: "RGBA(7, 76, 136, 1)",
          borderWidth: 0.2,
          borderColor: "RGBA(72, 234, 255, 0.1)",
          borderType: "dashed",
          // shadowColor: "#8cd3ef",
          // shadowOffsetY: 10,
          // shadowBlur: 120,
        },
        select: {
          disabled: true,
        },
        emphasis: {
          // 聚焦后颜色
          disabled: true, // 开启高亮
          label: {
            show: false,
            align: "center",
            color: "#ffffff",
          },
          itemStyle: {
            color: "#539efe",
            borderWidth: 1,
            borderColor: "#4fdcf7",
          },
        },
        zlevel: -2,
      } as any,
      // 点
      {
        // name: "物资",d
        type: "scatter3D" as any,
        coordinateSystem: "geo3D",

        data: series,
        symbol: (value, params) => {
          return imageTrans(params.data)
        },
        symbolSize: (value, params) => {
          return sizeTrans(params.data, screenWidth)
        },
        // symbolKeepAspect: true,
        // symbolOffset: [0, "-50%"],
        label: {
          show: false,
          formatter: function (params) {
            return params.name
          },
          align: "center",
          position: "bottom",
          distance: 10,
          color: "#ffffff",
          fontSize: 25 * (screenWidth / 6400),
        },
        zlevel: 99,
        // geo3DIndex: 0,
        // tooltip: {
        //   show: true,
        //   backgroundColor: "rgba(0,0,0,0)",
        //   borderWidth: 0,
        //   shadowBlur: 0,
        //   padding: 0,
        //   shadowColor: "rgba(0, 0, 0, 0)",
        //   formatter: (params) => {
        //     const render = <ToolTipBox params={params} />
        //     const renderToString = ReactDOMServer.renderToString(render)
        //     return renderToString
        //   },
        // },
        emphasis: {
          itemStyle: {
            opacity: 0.8,
          },
        },
        // z: 3,
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
