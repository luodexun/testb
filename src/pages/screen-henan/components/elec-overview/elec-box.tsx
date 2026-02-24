/*
 * @Author: chenmeifeng
 * @Date: 2024-05-30 10:30:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-08 15:14:14
 * @Description: 发电量概览公用
 */
import ChartRender from "@/components/chart-render"
import useChartRender from "@/hooks/use-chart-render"
// import CommonQuotaBox from "./common-quota-box"
import { judgeNull, parseNum } from "@/utils/util-funs"
import { elecOvPie } from "../../configs/elec-ovw"
interface IProp {
  option?: any
  data: any
  chartData: any
}
export default function CommonElecBox(props: IProp) {
  const { option, data, chartData } = props
  const { chartRef, chartOptions } = useChartRender(chartData, elecOvPie)
  return (
    <div className="hn-com-elec">
      <div className="elec-chart-box">
        <ChartRender ref={chartRef} empty option={chartOptions} />
      </div>
      <div className="elec-quota">
        {option?.map((i) => {
          return (
            <div key={i.key} className="hn-elec-bitem">
              <span className="bitem-val">{judgeNull(data?.[i.key], 1, 2, "-")}</span>
              <span className="bitem-name">{`${i.name}(${i.unit})`}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
