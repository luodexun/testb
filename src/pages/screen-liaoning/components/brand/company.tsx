/*
 * @Author: chenmeifeng
 * @Date: 2025-02-20 09:57:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-04 10:14:20
 * @Description:
 */
import "./company.less"
import { useEffect, useRef } from "react"
import { IBrandData } from "../../types"
import { judgeNull } from "@/utils/util-funs"
interface IProps {
  list: Array<IBrandData>
  type: "wt" | "pvinv"
}
export default function CompanyList(props: IProps) {
  const { list, type } = props
  const options = useRef({
    wt: [
      { name: "装机容量", key: "deviceCapacity", unit: "MW", caculate: 1000 },
      { name: "风机台数", key: "deviceQuantity", unit: "台" },
    ],
    pvinv: [
      { name: "装机容量", key: "deviceCapacity", unit: "MW", caculate: 1000 },
      { name: "逆变器数", key: "deviceQuantity", unit: "台" },
    ],
  })
  useEffect(() => {
    // effect logic
  }, [])
  return (
    <div className="ln-company">
      {list?.map((i) => {
        return (
          <div className="company-item" key={i.manufacturer}>
            <div className="item-left item-com">
              <div className="item-left-left">
                <i className="line" style={{ background: i.color }}></i>
                <span className="company-name">{i.manufacturer}</span>
              </div>
              <span className="rate" style={{ background: i.subColor }}>
                {judgeNull(i.capacityCent, 0.01, 2, "-")}%
              </span>
            </div>
            {options.current[type]?.map((item) => {
              return (
                <div key={item.key} className="item-com">
                  <span className="name">{item.name}</span>
                  <div className="box-right">
                    <span className="value">{judgeNull(i[item.key], item.caculate, 2, "-")}</span>
                    <span className="unit">{item.unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
