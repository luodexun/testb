import { useMemo } from "react"

import QuatoOneItem from "./quato-item"

/*
 * @Author: chenmeifeng
 * @Date: 2024-02-21 09:53:02
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-25 13:35:15
 * @Description:
 */
export default function QuotaList(props) {
  const { quotaList } = props
  const actualQuotaList = useMemo(() => {
    const quotaObj = {}
    quotaList?.forEach((item) => {
      if (!quotaObj[item.quotaType]) {
        quotaObj[item.quotaType] = []
      }
      quotaObj[item.quotaType].push(item)
    })
    return quotaObj
  }, [quotaList])
  return (
    <div className="quota">
      {/* {quotaList.map((i) => {
        return (
          <div key={i.id} className="quota-item">
            <i className={"i-" + i.type}></i>
            <div className="quota-item-content">
              <span className="quota-value">{i.value}</span>
              <span className="quota-name">
                {i.name}({i.unit})
              </span>
            </div>
          </div>
        )
        <div style={{ width: "40%" }}>
                <QuatoOneItem type={i.type} name={i.name} value={i.value} />
              </div>
      })} */}
      {Object.keys(actualQuotaList).map((j) => {
        return (
          <div className="quota-list" key={j}>
            {actualQuotaList?.[j].map((i) => {
              return j !== "3" ? (
                <div key={i.id} style={{ width: "90%" }}>
                  <QuatoOneItem type={i.type} unit={i.unit} name={i.name} value={i.value} />
                </div>
              ) : (
                <div key={i.id} style={{ width: "49%" }}>
                  <QuatoOneItem type={i.type} unit={i.unit} name={i.name} value={i.value} horizon={true} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
