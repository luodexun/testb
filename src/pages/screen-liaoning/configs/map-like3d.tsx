import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"
import Control from "@/assets/common-screen/ccn.png"
import PVINV from "@/assets/common-screen/cpvinv.png"
import WT from "@/assets/common-screen/zwt.png"
import YWT from "@/assets/common-screen/ywt.png"
import ZWT from "@/assets/common-screen/cwt.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
import { judgeNull, parseNum } from "@/utils/util-funs"
import { useMemo } from "react"
// chart.convertToPixel('geo',[116.0815,41.781])
export interface geoChartData extends IBaseChartOption {
  series: any
  controlData?: any
  screenWidth?: number
}
const imageList = {
  WT,
  PVINV,
  Control,
  YWT,
  ZWT,
}
const imageTrans = (data) => {
  if (data.stnDeviceType === "ALL") {
    return "circle"
  }
  return "image://" + imageList[data.stnDeviceType]
}
const sizeTrans = (data, screenWidth) => {
  if (data.stnDeviceType === "PVINV") {
    return [30 * (screenWidth / 5440), 26 * (screenWidth / 5440)]
  } else if (data.stnDeviceType === "Control") {
    return [50 * (screenWidth / 5440), 40 * (screenWidth / 5440)]
  }
  return [28 * (screenWidth / 5440), 39 * (screenWidth / 5440)]
}

export function geoOption(params: geoChartData) {
  const { series, controlData, screenWidth } = params || {
    series: [],
    controlData: null,
    large: false,
    mapName: "东北",
  }
  // console.log(series, "series")

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
        layoutSize: "105%", //大小
        map: "东北框",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 1,
        label: {
          show: true,
          color: "rgba(255, 255, 255, 1)",
        },
        itemStyle: {
          areaColor: "RGBA(5, 29, 74, 0.3)",
          borderColor: "rgba(60, 154, 255, 1)",
          borderWidth: 2,
          shadowColor: "rgba(60, 154, 255, 0.8)",
          shadowOffsetY: 15,
          shadowBlur: 10,
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
      {
        layoutCenter: ["50%", "50%"], //位置
        layoutSize: "105%", //大小
        show: true,
        map: "东北",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 0,
        label: {
          show: true,
          color: "#ffffff",
        },
        itemStyle: {
          areaColor: "RGBA(5, 29, 74, 0.4)",
          borderColor: "RGBA(11, 243, 244, 1)",
          borderWidth: 0.7,
          borderType: "dashed",
          shadowColor: "#8cd3ef",
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
      {
        type: "map",
        map: "东北框",
        zlevel: -1,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "51%"],
        layoutSize: "105%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          // borderColor:"rgba(17, 149, 216,0.6)",
          borderColor: "rgba(60, 154, 255, 1)",
          shadowColor: "RGBA(22, 111, 170, 1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "RGBA(5, 29, 74, 0.2))",
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
      {
        type: "map",
        map: "东北框",
        zlevel: -2,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "52%"],
        layoutSize: "90", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          // borderColor: "rgba(57, 132, 188,0.4)",
          borderColor: "rgba(60, 154, 255, 1)",
          shadowColor: "RGBA(22, 111, 170, 1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "transpercent",
        },
      },
      {
        type: "map",
        map: "东北框",
        zlevel: -3,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "53%"],
        layoutSize: "105%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "rgba(60, 154, 255, 1)",
          shadowColor: "RGBA(22, 111, 170, 1)",
          shadowOffsetY: 15,
          shadowBlur: 10,
          areaColor: "transpercent",
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
      {
        type: "map",
        map: "东北框",
        zlevel: -4,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "54%"],
        layoutSize: "105%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "rgba(60, 154, 255, 1))",
          shadowColor: "rgba(29, 111, 165,0.8)",
          // shadowOffsetY: 15,
          // shadowBlur: 10,
          areaColor: "RGBA(22, 111, 170, 0.1)",
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
    ],
    series: [
      // 地图配置
      {
        type: "map",
        map: "东北框",
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
        layoutSize: "105%", //大小
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
          // distance: -80 * (screenWidth / 5440),
          color: "rgba(0, 242, 255, 1)",
          fontSize: 12 * (screenWidth / 5440),
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
          color: "RGBA(25, 159, 120, 1)",
          width: 2,
          curveness: 0.3,
        },
        data:
          series
            ?.filter((i) => i.stnDeviceType !== "YWT")
            ?.map((i) => {
              return {
                coords: [i.value, [123.46, 41.68]],
              }
            }) || [],
      },
    ],
  }
  return option
}
const mapQuota = [
  { name: "功率(MW)：", key: "activePower", calculate: 0.1 },
  { name: "日发电量(MWh)：", key: "dailyProduction", calculate: 0.1 },
]
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
    <div className="map-tbox">
      <div className="map-tbox-title">{params?.data?.name || "-"}</div>
      <div className="map-tbox-cnt">
        {mapQuota.map((i) => {
          return (
            <div className="map-cnt-item" key={i.key}>
              <span className="cnt-item-value">
                {i.name} {judgeNull(actualData?.data?.[i.key], i.calculate || 1, 2, "-")}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
