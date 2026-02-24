/*
 * @Author: chenmeifeng
 * @Date: 2024-02-28 10:39:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-12 10:30:19
 * @Description:
 */
import "wijmo/styles/wijmo.css"
import "./index.less"
import "wijmo/cultures/wijmo.culture.zh"

import { Select } from "antd"
import { useEffect, useRef, useState } from "react"
import * as wijmo from "wijmo/wijmo"
import * as wjcOlap from "wijmo/wijmo.olap"
import { PivotChart, PivotGrid, PivotPanel } from "wijmo/wijmo.react.olap"

wijmo.changeCulture("zh-CN")
const pivotTypeOption = [
  { label: "表格", value: "Table" },
  { label: "柱状图", value: "Column" },
  { label: "折线图", value: "Line" },
  { label: "进度图", value: "Bar" },
  { label: "面积图", value: "Area" },
]
export default function WijmoTable(props) {
  const { columns, dataSource } = props
  const [ngPanel, setNgPanel] = useState(null)
  const pivotRef = useRef(null)
  const flexGridRef = useRef(null)

  const [pivotType, setPivotType] = useState("Table")
  useEffect(() => {
    const ng = new wjcOlap.PivotEngine({
      itemsSource: dataSource,

      // fields: [
      //   { binding: "stationName", header: "场站" },
      //   { binding: "totalCapacity", header: "时间" },
      //   { binding: "totalDeviceCount", header: "数量" },
      // ],
      // valueFields: ["totalDeviceCount"],
      // rowFields: ["Type"], // summarize amounts
      fields: columns.map((i) => {
        return {
          binding: i.dataIndex,
          header: i.title,
        }
      }),
    })
    setNgPanel(ng)
  }, [dataSource, columns])
  const selectChange = (e) => {
    setPivotType(e)
  }

  return (
    <div id="pivot_panel" className="l-full pivot-panel">
      <div className="pivot-panel-left">
        <div>
          <span>数据展示形式：</span>
          <Select style={{ width: 120 }} options={pivotTypeOption} value={pivotType} onChange={selectChange}></Select>
        </div>
        <PivotPanel ref={pivotRef} itemsSource={ngPanel} />
      </div>

      {pivotType === "Table" ? (
        <PivotGrid style={{ width: "60%" }} ref={flexGridRef} itemsSource={ngPanel} />
      ) : (
        <PivotChart
          style={{ width: "60%" }}
          itemsSource={ngPanel}
          chartType={pivotType}
          showTitle={false}
          show-legend="Auto"
        ></PivotChart>
      )}
    </div>
  )
}
