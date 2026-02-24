import "echarts-gl" // echarts 3D插件

import { baseDataZoom, baseLegend } from "@configs/chart-fragments.ts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"
import wts from "@/assets/device/wtzhu.png"
// import AllImg from "@/assets/hubei-screen/all.png"
import Control from "@/assets/anhui-screen/control.png"
import PVINV from "@/assets/anhui-screen/PVINV.png"
import WT from "@/assets/anhui-screen/WT.png"
// import { getToolbox } from "@/components/echarts-common/configs"
import { IBaseChartOption } from "@/types/i-page.ts"
import { parseNum } from "@/utils/util-funs"
// chart.convertToPixel('geo',[116.0815,41.781])
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
    return [30 * (screenWidth / 1920), 26 * (screenWidth / 1920)]
  } else if (data.stnDeviceType === "WT") {
    return [32 * (screenWidth / 1920), 46 * (screenWidth / 1920)]
  }
  return [50 * (screenWidth / 1920), 40 * (screenWidth / 1920)]
}

export function geoOption(params: geoChartData) {
  const { series, screenWidth } = params || { series: [], large: false, mapName: "华中" }
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
        layoutSize: "90%", //大小
        map: "安徽框",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 1,
        label: {
          show: false,
          color: "rgba(255, 255, 255, 0.5)",
        },
        itemStyle: {
          areaColor: "RGBA(0, 221, 253, 0.2)",
          borderColor: "RGBA(0, 221, 253, 1)",
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
        map: "安徽",
        roam: false,
        zoom: 1,
        aspectScale: 1,
        zlevel: 0,
        label: {
          show: false,
        },
        itemStyle: {
          areaColor: "RGBA(5, 72, 105, 1)",
          borderColor: "RGBA(0, 221, 253, 1)",
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
        map: "安徽框",
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
          shadowColor: "RGBA(22, 111, 170, 1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "rgba(5,21,35,0.1)",
        },
        emphasis: {
          //高亮状态的效果
          disabled: true, // 关闭高亮
        },
      },
      {
        type: "map",
        map: "安徽框",
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
          borderColor: "RGBA(0, 221, 253, 1)",
          shadowColor: "RGBA(22, 111, 170, 1)",
          shadowOffsetY: 5,
          shadowBlur: 15,
          areaColor: "transpercent",
        },
      },
      {
        type: "map",
        map: "安徽框",
        zlevel: -3,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "53%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "RGBA(0, 221, 253, 1)",
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
        map: "安徽框",
        zlevel: -4,
        aspectScale: 1,
        zoom: 1,
        layoutCenter: ["50%", "54%"],
        layoutSize: "90%", //大小
        roam: false,
        silent: true,
        itemStyle: {
          borderWidth: 0.8,
          // borderColor: "rgba(11, 43, 97,0.8)",
          borderColor: "RGBA(0, 221, 253, 1))",
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
        map: "安徽框",
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
        data: series?.filter((i) => i.stnDeviceType !== "WT"),
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
          // distance: -80 * (screenWidth / 1920),
          color: "rgba(0, 242, 255, 1)",
          fontSize: 12 * (screenWidth / 1920),
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
          series?.map((i) => {
            return {
              coords: [i.value, [117.33, 31.73]],
            }
          }) || [],
      },
      {
        type: "custom",
        coordinateSystem: "geo",
        geoIndex: 1,
        renderItem: function (params, api) {
          var point = api.coord([api.value(0), api.value(1)])
          // console.log(point, "point", api.value(2))
          const x = point[0] - 13
          const y = point[1] - 35
          return {
            type: "group",
            children: [
              {
                type: "image",
                style: {
                  image: wts,
                  width: 26,
                  height: 26,
                  x: x,
                  y: y,
                },
                originX: x + 13,
                originY: y + 13,
                rotation: 1,
                transition: ["rotation", "originX", "originY"],
                keyframeAnimation: [
                  {
                    duration: 2000,
                    loop: true,
                    keyframes: [
                      {
                        percent: 0,
                        rotation: 0,
                      },
                      {
                        percent: 1,
                        rotation: 4,
                      },
                    ],
                  },
                ],
              },
              {
                type: "path",
                shape: {
                  pathData:
                    "M939.232,226.08l-2.065-27.452a2.009,2.009,0,0,0-.083-.45.062.062,0,0,0-.068-.042,3.86,3.86,0,0,1-1.081,0,.061.061,0,0,0-.068.042,1.988,1.988,0,0,0-.083.45L933.72,226.08a1.622,1.622,0,0,0,.322,1.179.508.508,0,0,0,.369.178h4.13a.508.508,0,0,0,.369-.178A1.622,1.622,0,0,0,939.232,226.08Z",
                  width: 16,
                  height: 16,
                  x: point[0] - 8,
                  y: point[1] - 20,
                },
                style: {
                  fill: "#ffde33",
                  stroke: "#ffde33",
                },
              },
              // {
              //   type: "circle",
              //   shape: {
              //     cx: point[0],
              //     cy: point[1],
              //     r: 5,
              //   },
              //   style: {
              //     fill: "#000",
              //     stroke: "#fff",
              //     lineWidth: 2,
              //   },
              //   draggable: true,
              // },
            ],
          }
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
        // data: [[116.5, 32.29]],
        data: series?.filter((i) => i.stnDeviceType === "WT"),
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
