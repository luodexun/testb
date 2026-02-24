/*
 * @Author: chenmeifeng
 * @Date: 2023-12-21 10:43:47
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-22 14:47:15
 * @Description:
 */
import "./index.less"

import { Button, Checkbox, Select } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

const CHART_TYPE_OPTION = [
  { label: "柱状图", value: "bar" },
  { label: "折线图", value: "line" },
  // { label: "条形图", value: "horizontalBar" },
  { label: "面积图", value: "lineArea" },
]
export interface TTableInfo {
  key: string
  name: string
  chartType: string
  choose: boolean
}
export interface IPerateRef {}
export interface IPwrLineMdlProps {
  buttonClick?: (data: Array<TTableInfo>) => void
  chooseValue?: Array<TTableInfo>
}
const ChooseTable = forwardRef<IPerateRef, IPwrLineMdlProps>((props, ref) => {
  const { buttonClick, chooseValue } = props
  const [tableList, setTableList] = useState<Array<TTableInfo>>(chooseValue)
  const btnClkRef = () => {
    buttonClick?.(tableList)
  }
  const selectChage = (cur, info, type) => {
    const newData = [...tableList]
    const index = newData.findIndex((item) => item.name === info.name)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      [type]: type === "choose" ? cur.target.checked : cur,
    })
    setTableList(newData)
  }
  useEffect(() => {
    setTableList(chooseValue)
  }, [chooseValue])
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="rp-ct">
      <div className="ct-title">
        <span className="ct-com-one"></span>
        <span className="ct-com-two">系列名</span>
        <span className="ct-com-three">图表类型</span>
      </div>
      <div className="ct-content">
        {tableList?.map((i) => {
          return (
            <div key={i.name} className="ct-content-ls">
              <div className="ls--item ct-com-one">
                <Checkbox
                  onChange={(e) => {
                    selectChage(e, i, "choose")
                  }}
                  checked={i.choose}
                ></Checkbox>
              </div>
              <div className="ls--item ct-com-two">{i.name}</div>
              <div className="ls--item ct-com-three">
                <Select
                  value={i.chartType}
                  onChange={(e) => {
                    selectChage(e, i, "chartType")
                  }}
                  style={{ width: 120 }}
                  options={CHART_TYPE_OPTION}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="ct-btn">
        <Button onClick={btnClkRef}>保存</Button>
      </div>
    </div>
  )
})
export default ChooseTable
