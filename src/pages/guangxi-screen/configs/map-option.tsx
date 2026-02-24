import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import ESPCS from "@/assets/large-screen/ESPCS.png"
import FIRE from "@/assets/large-screen/FIRE.png"
import PVINV from "@/assets/large-screen/PVINV.png"
import WT from "@/assets/large-screen/WT.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
interface IToolCom {
  name: string
  unit: number
  id: number
  key: string
}
export interface geoChartData extends IBaseChartOption {
  series: any
  screenWidth?: number
  tooltipContent?: Array<IToolCom>
}
const imageList = {
  WT,
  PVINV,
  ESPCS,
  FIRE,
}
const imageTrans = (data) => {
  return "image://" + imageList[data.type]
}
const sizeTrans = (data, screenWidth) => {
  if (data.type === "PVINV") {
    return [136 * (screenWidth / 6720), 100 * (screenWidth / 6720)]
  } else if (data.type === "ESPCS") {
    return [136 * (screenWidth / 6720), 100 * (screenWidth / 6720)]
  } else if (data.type === "FIRE") {
    return [166 * (screenWidth / 6720), 150 * (screenWidth / 6720)]
  }
  return [136 * (screenWidth / 6720), 164 * (screenWidth / 6720)]
}

export function geoOption(params: geoChartData) {
  const { series, screenWidth, tooltipContent } = params || { series: [] }
  // console.log(window);

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
    geo: {
      map: "广西",
      // 这里必须定义，不然后面series里面不生效
      tooltip: {
        show: false,
      },
      label: {
        show: false,
      },
      zoom: 1.03,
      silent: true, // 不响应鼠标时间
      show: true,
      roam: false, // 地图缩放和平移
      aspectScale: 0.95, // scale 地图的长宽比
      itemStyle: {
        borderColor: "#019AE6",
        borderWidth: 1,
        areaColor: "#184AAD",
        // shadowBlur: 10 * (screenWidth / 6720),
        // shadowColor: "0FA3F0",
        shadowColor: "#4076FF",
        shadowBlur: 800 * (screenWidth / 6720),
        // shadowOffsetX: -50 * (screenWidth / 6720), //
        // shadowOffsetY: 50 * (screenWidth / 6720),
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
    series: [
      // 地图配置
      {
        type: "map",
        map: "广西",
        zoom: 1,
        tooltip: {
          show: false,
        },
        label: {
          show: true, // 显示省份名称
          color: "#04CFF5",
          align: "center",
          fontSize: "5em",
        },
        layoutCenter: ["50%", "50%"], //地图位置
        aspectScale: 0.95,
        roam: false, // 地图缩放和平移
        itemStyle: {
          borderColor: "#0FA3F0", // 省分界线颜色  阴影效果的
          borderWidth: 5 * (screenWidth / 6720),
          areaColor: "#02308B",
          opacity: 1,
          // shadowColor: "#4076FF",
          // shadowBlur: 30 * (screenWidth / 6720),
          // shadowOffsetX: -30 * (screenWidth / 6720), //
          // shadowOffsetY: 30 * (screenWidth / 6720),
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
          // distance: -80 * (screenWidth / 6720),
          color: "#ffffff",
          fontSize: 45 * (screenWidth / 6720),
        },
        tooltip: {
          show: true,
          backgroundColor: "rgba(0,0,0,0)",
          borderWidth: 0,
          shadowBlur: 0,
          padding: 0,
          shadowColor: "rgba(0, 0, 0, 0)",
          formatter: (params) => {
            // const {value, unit, name} =
            const render = <TooltipContent screenWidth={screenWidth} params={params} list={tooltipContent} />
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

const TooltipContent = ({ screenWidth, params, list }) => {
  return (
    <div className="map-tooltip" style={{ fontSize: 10 * (screenWidth / 6720) + "px" }}>
      <div className="map-tooltip-title">{params.name}</div>
      <div className="map-tooltip-list">
        {list?.map((i) => {
          const flag = params.data.tooltipContent[i.key]
          if (!flag) return ""
          return (
            <div className="map-tooltip-item" key={i.name}>
              <span className="map-tooltip-name">{i.name}：</span>
              <span className="map-tooltip-value">{params.data.tooltipContent[i.key]}</span>
              <span className="map-tooltip-unit"> {i.unit}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
