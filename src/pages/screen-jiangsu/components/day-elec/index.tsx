/*
 * @Author: chenmeifeng
 * @Date: 2024-06-26 14:55:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-27 15:27:47
 * @Description:
 */
import JsCommonBox from "../common-box"
import "./index.less"
import { useRef, useState } from "react"
import useChartRender from "@/hooks/use-chart-render"
import { brand2DPie } from "../../configs/pie-options"
import DayElecLeft from "./left"
import DayElecRight from "./right"
export default function DayElec() {
  const [chartData, setChartData] = useState(null)
  const { chartRef, chartOptions } = useChartRender(chartData, brand2DPie)

  return (
    <JsCommonBox title="日实时发电量">
      <div className="js-day-elec">
        <div className="js-day-elec--left">
          <DayElecLeft />
        </div>
        <div className="js-day-elec--right">
          <DayElecRight />
        </div>
      </div>
    </JsCommonBox>
  )
}
