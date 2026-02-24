/*
 * @Author: chenmeifeng
 * @Date: 2024-03-21 14:13:49
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-29 09:54:52
 * @Description:
 */
import "./elec-chart-box.less"

import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
import { parseNum } from "@/utils/util-funs"

import { ballOption } from "../../configs/elec-ball-option"
export default function ElecChartBox(props) {
  const { chartData, data, option } = props

  const { chartRef, chartOptions } = useChartRender(chartData, ballOption)
  return (
    <div className="elec-chart-one">
      <div className="elec-chart-left">
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
      <div className="elec-chart-right">
        {option.map((i) => {
          return (
            <div className="elec-box" key={i.key}>
              <span className="elec-box-value">{parseNum(data?.[i.key], 4) || "-"}</span>
              <span className="elec-box-name">{i.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
