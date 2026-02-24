/*
 * @Author: chenmeifeng
 * @Date: 2024-05-30 10:30:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-31 15:47:10
 * @Description: 发电量概览公用
 */
import "./common-elec-box.less"

import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"

import CommonQuotaBox from "../common-quota-box"
import { parseNum } from "@/utils/util-funs"
import { elecOvPie } from "../../configs/elec-overview"
export default function CommonElecBox(props) {
  const { title, option, data, chartData } = props
  const { chartRef, chartOptions } = useChartRender(chartData, elecOvPie)
  return (
    <div className="com-elec">
      <div className="com-elec-left">
        <div className="elec-box-text">
          <span>{title}</span>
        </div>
        <div className="elec-quota">
          {option?.map((i) => {
            return <CommonQuotaBox key={i.key} name={i.name} unit={i.unit} value={parseNum(data?.[i.key]) || "-"} />
          })}
        </div>
      </div>
      <div className="elec-chart-box">
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
    </div>
  )
}
