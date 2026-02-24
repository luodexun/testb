/*
 * @Author: chenmeifeng
 * @Date: 2024-04-15 14:24:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-19 16:12:34
 * @Description:
 */
import { EChartsOption } from "echarts"
import ReactDOMServer from "react-dom/server"

import { baseTooltip } from "@/configs/chart-fragments"
import { IBaseChartOption } from "@/types/i-page"
import { parseNum } from "@/utils/util-funs"

import { commonBaseLegend, commonBaseXAis, commonBaseYAxis } from "./common-echarts-data"

export interface lineChartData extends IBaseChartOption {
  series: any
  screenWidth?: number
  isBrand?: boolean
  listData?: any
  yUnit?: string
  showLegend?: boolean
  axisLabel?: any
}
const brandTooltip = (data) => {
  return {
    confine: true,
    backgroundColor: "rgba(0,0,0,0)",
    borderWidth: 0,
    shadowBlur: 0,
    padding: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
    formatter: (params) => {
      const render = <ToolTipBox params={params} data={data} />
      const renderToString = ReactDOMServer.renderToString(render)
      return renderToString
    },
  }
}
export function lineOrBarOption(params: lineChartData) {
  const {
    xAxis,
    series,
    isBrand,
    listData,
    yUnit,
    showLegend = true,
    axisLabel,
  } = params || {
    xAxis: [],
    series: [],
    listData: [],
    showLegend: true,
  }
  const actTooltip = {
    ...baseTooltip,
    formatter: function (params) {
      let res = params[0].name
      for (let i = 0; i < params.length; i++) {
        res += "<br>" + params[i].marker + params[i].seriesName + "：" + parseNum(params[i].data)
      }
      return res
    },
  }
  const option: EChartsOption = {
    grid: { left: "5%", right: "3%", top: "18%", bottom: "5%", containLabel: true },
    tooltip: isBrand ? brandTooltip(listData) : (actTooltip as EChartsOption["tooltip"]),
    // dataZoom: baseDataZoom,
    legend: commonBaseLegend(showLegend),
    // toolbox: getToolbox(downloadFileName ?? "发电量报表"),
    xAxis: {
      type: "category",
      data: xAxis,
      ...commonBaseXAis({ axisLabel }),
    },
    yAxis: [
      {
        type: "value",
        name: yUnit || "万kW",
        show: true,
        position: "left",
        ...commonBaseYAxis(),
      },
    ],
    series,
  }
  return option
}
const brandQuota = [
  { name: "装机台数(台)", key: "deviceQuantity" },
  { name: "装机容量(万kW)", key: "deviceCapacity" },
  { name: "装机容量占比(%)", key: "capacityCent" },
]
// eslint-disable-next-line react-refresh/only-export-components
function ToolTipBox({ params, data }) {
  console.log(params, "params")
  const info = data?.[params.dataIndex]
  return (
    <div className="brand-tbox">
      <div className="brand-tbox-title">{params?.name || "-"}</div>
      <div className="brand-tbox-cnt">
        {brandQuota.map((i) => {
          return (
            <div className="brand-cnt-item" key={i.key}>
              <span className="cnt-item-value">{parseNum(info?.[i.key]) || "-"}</span>
              <span className="cnt-item-name">{i.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
