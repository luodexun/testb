/*
 * @Author: chenmeifeng
 * @Date: 2024-03-29 10:37:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-04 12:21:44
 * @Description:
 */
import { EChartsOption } from "echarts"
import * as echarts from "echarts"
import ReactDOMServer from "react-dom/server"

import es from "@/assets/hubei-screen/new/b_es.png"
import pv from "@/assets/hubei-screen/new/b_pv.png"
import wt from "@/assets/hubei-screen/new/b_wt.png"
import brandImg from "@/assets/hubei-screen/new/brand.png"
import { parseNum } from "@/utils/util-funs"

export function brand2DPie(params) {
  const { wtInfo, pvInfo, esInfo, source, screenWidth } = params || {
    wtInfo: null,
    pvInfo: null,
    esInfo: null,
    screenWidth: 4480,
    source: [],
  }
  const option: EChartsOption = {
    grid: { left: "3%", right: "3%", top: "22%", bottom: "2%", containLabel: true },
    // dataZoom: baseDataZoom,
    //移动上去提示的文本内容
    tooltip: {
      show: true,
      confine: true,
      backgroundColor: "rgba(0,0,0,0)",
      borderWidth: 0,
      shadowBlur: 0,
      padding: 0,
      shadowColor: "rgba(0, 0, 0, 0)",
      formatter: (params) => {
        const render = (
          <ToolTipBox params={params} wtInfo={wtInfo} pvInfo={pvInfo} esInfo={esInfo} screenWidth={screenWidth} />
        )
        const renderToString = ReactDOMServer.renderToString(render)
        return renderToString
      },
    },
    title: [
      {
        text: "风机",
        left: "13.1%",
        top: "64%",
        textStyle: {
          color: "#fff",
          fontSize: 20,
          fontWeight: "normal",
        },
      },
      {
        text: "光伏",
        left: "36.1%",
        top: "64%",
        textStyle: {
          color: "#fff",
          fontSize: 20,
          fontWeight: "normal",
        },
      },
      {
        text: "储能",
        left: "61.1%",
        top: "64%",
        textStyle: {
          color: "#fff",
          fontSize: 20,
          fontWeight: "normal",
        },
      },
    ],
    //你的代码
    color: [
      "RGBA(8, 162, 255, 1)",
      "RGBA(209, 86, 255, 1)",
      "RGBA(209, 86, 255, 0.8)",
      "RGBA(255, 162, 243, 1)",
      "RGBA(255, 243, 166, 1)",
      "RGBA(254, 194, 109, 1)",
      "RGBA(254, 194, 109, 0.5)",
      "RGBA(208, 252, 197, 1)",
      "RGBA(15, 253, 253, 1)",
      "RGBA(69, 113, 255, 1)",
      "RGBA(69, 113, 255, 0.5)",
    ],
    // title: {
    //   text: `{a|${name || ""}}`,
    //   left: "center",
    //   top: "center",
    //   textStyle: {
    //     rich: {
    //       a: {
    //         fontSize: 25 * (screenWidth / 4513),
    //         color: "#fff",
    //       },
    //     },
    //   },
    // },
    graphic: [
      {
        type: "image",
        left: "4.8%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: brandImg,
          width: 250,
          height: 250,
        },
      },
      {
        type: "image",
        left: "11.3%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: wt,
          width: 92,
          height: 92,
        },
      },
      {
        type: "image",
        left: "27.8%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: brandImg,
          width: 250,
          height: 250,
        },
      },
      {
        type: "image",
        left: "34.3%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: pv,
          width: 92,
          height: 92,
        },
      },
      {
        type: "image",
        left: "52.8%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: brandImg,
          width: 250,
          height: 250,
        },
      },
      {
        type: "image",
        left: "59.3%",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: es,
          width: 92,
          height: 92,
        },
      },
    ],
    legend: {
      orient: "vertical",
      left: "75%",
      align: "left",
      top: "middle",
      itemHeight: 15,
      itemWidth: 15,
      itemGap: 25,
      textStyle: {
        color: "#FFFFFF",
        fontSize: "1.6em",
        opacity: 0.8,
      },
      icon: "rect",
    },
    dataset: {
      source: source,
    },
    series: [
      {
        type: "pie",
        radius: ["62%", "84%"],
        center: ["15%", "50%"],
        labelLine: {
          show: false,
        },
        label: {
          show: false,
          position: "center",
        },
        // No encode specified, by default, it is '2012'.
      },
      {
        type: "pie",
        radius: ["62%", "84%"],
        center: ["38.1%", "50%"],
        encode: {
          itemName: "product",
          value: "pvinv",
        },
        labelLine: {
          show: false,
        },
        label: {
          show: false,
          position: "center",
        },
      },
      {
        type: "pie",
        radius: ["62%", "84%"],
        center: ["63.1%", "50%"],
        encode: {
          itemName: "product",
          value: "espcs",
        },
        labelLine: {
          show: false,
        },
        label: {
          show: false,
          position: "center",
        },
      },
    ],
  }
  return option
}

const brandQuota = [
  { name: "装机台数(台)", key: "deviceQuantity" },
  { name: "装机容量(万kW)", key: "deviceCapacity" },
  { name: "装机容量占比(%)", key: "capacityCent" },
]
function ToolTipBox({ params, wtInfo, pvInfo, esInfo, screenWidth }) {
  let source = {}
  if (params?.seriesIndex === 0) {
    source = wtInfo?.find((i) => i.name === params.name)
  } else if (params?.seriesIndex === 1) {
    source = pvInfo?.find((i) => i.name === params.name)
  } else if (params?.seriesIndex === 2) {
    source = esInfo?.find((i) => i.name === params.name)
  }
  return (
    <div className="brand-tbox" style={{ fontSize: 10 * (screenWidth / 4513) + "px" }}>
      <div className="brand-tbox-title">{params?.name || "-"}</div>
      <div className="brand-tbox-cnt">
        {brandQuota.map((i) => {
          return (
            <div className="brand-cnt-item" key={i.key}>
              <span className="cnt-item-value">{parseNum(source?.[i.key]) || "-"}</span>
              <span className="cnt-item-name">{i.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
