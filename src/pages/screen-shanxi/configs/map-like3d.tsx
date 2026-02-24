import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

// import AllImg from "@/assets/hubei-screen/all.png"
import Control from "@/assets/shanxi-screen/st-control.png"
import PVINV from "@/assets/shanxi-screen/st-PVINV.png"
import WT from "@/assets/shanxi-screen/st-WT.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"
import { TEMPORARY_LAT_LONG, tooltipKey } from "."

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

const sizeTrans = (data, screenWidth) => {
  if (data.type === "PVINV") {
    return [54 * (screenWidth / 1920), 23 * (screenWidth / 1920)]
  } else if (data.type === "WT") {
    return [25 * (screenWidth / 1920), 30 * (screenWidth / 1920)]
  }
  return [60 * (screenWidth / 1920), 40 * (screenWidth / 1920)]
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
        layoutSize: "110%", //大小
        map: "山西框",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 1,
        label: {
          show: false,
          color: "rgba(255, 255, 255, 0.5)",
        },
        itemStyle: {
          areaColor: "RGBA(6, 83, 192, 0.2)",
          borderColor: "RGBA(25, 191, 255, 1)",
          borderWidth: 3,
          shadowColor: "RGBA(9, 22, 103, 1)",
          shadowOffsetY: 0,
          shadowBlur: 10,
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
      {
        layoutCenter: ["50%", "50%"], //位置
        layoutSize: "110%", //大小
        show: true,
        map: "山西",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 0,
        label: {
          show: false,
        },
        itemStyle: {
          areaColor: "RGBA(30, 62, 167, 1)",
          borderColor: "RGBA(150, 252, 179, 1)",
          borderWidth: 1,
          // borderType: "dashed",
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
        map: "山西框",
        zlevel: -1,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "51.4%"],
        layoutSize: "110%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          borderColor: "RGBA(43, 86, 158, 1)",
          shadowColor: "RGBA(25, 191, 255, 0.8)",
          // shadowOffsetY: 5,
          shadowBlur: 30,
          areaColor: "RGBA(9, 22, 103, 1)",
        },
      },
    ],
    series: [
      // 地图配置
      {
        type: "map",
        map: "山西框",
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
        layoutSize: "110%", //大小
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
        data: series || [],
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
          // distance: -80 * (screenWidth / 6400),
          color: "rgba(255, 255, 255, 1)",
          fontSize: 14 * (screenWidth / 1920),
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
function ToolTipBox({ params }) {
  return (
    <div className="sx-map-tbox">
      <div className="map-tbox-title">{params?.data?.name || "-"}</div>
      <div className="map-tbox-cnt">
        {tooltipKey.map((i) => {
          return (
            <div className="map-cnt-item" key={i.key}>
              <span className="cnt-item-name">{i.name}:</span>
              <span className="cnt-item-value">{parseNum(params?.data?.[i.key]) || "-"}</span>
              <span className="cnt-item-unit">({i.unit})</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
