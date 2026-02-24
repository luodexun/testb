/*
 * @Author: chenmeifeng
 * @Date: 2024-07-09 10:01:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-09 10:47:54
 * @Description:
 */
import "./index.less"
import { parseNum } from "@/utils/util-funs"
import CommonCtBox from "../common-box"
import CommonQuotaBox from "../common-quota"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"
const mapQtlist = [
  { name: "风速", unit: "m/s", key: "windSpeed", icon: "speed" },
  { name: "有功功率", unit: "万kW", key: "activePower", icon: "actPower" },
  { name: "年利用小时", unit: "h", key: "yearlyUtilizationHour", icon: "time" },
]
export default function RealtimeBox() {
  const mainCpnInfo = useAtomValue(mainComAtom)
  return (
    <CommonCtBox title="实时数据" direction="right">
      {/* <ChartRender ref={chartRef} empty option={chartOptions} /> */}
      <div className="ah-realtime">
        {mapQtlist.map((i) => {
          return (
            <div key={i.key} className="hb-center-tbox">
              <i className={`i-${i.icon}`} />
              <CommonQuotaBox name={i.name} unit={i.unit} value={parseNum(mainCpnInfo?.[i.key]) || "-"} />
            </div>
          )
        })}
      </div>
    </CommonCtBox>
  )
}
