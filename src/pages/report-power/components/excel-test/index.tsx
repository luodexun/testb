/*
 * @Author: chenmeifeng
 * @Date: 2024-02-26 15:21:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-25 15:29:53
 * @Description:
 */
import "./index.less"
import "react-pivottable/pivottable.css" // 引入样式文件
import "react-pivottable/pivottable.css"

import { Select } from "antd"
import { useEffect, useRef, useState } from "react"
import PivotTableUI from "react-pivottable/PivotTableUI"
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers"
import TableRenderers from "react-pivottable/TableRenderers"
import Plot from "react-plotly.js"
// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot)
export default function PivotTable(props) {
  const { columns, dataSource } = props
  const pivottableRef = useRef(null)
  const [aggre, setAggre] = useState("")
  const [data, setData] = useState([])
  // const [rows, setRows] = useState(["场站"])
  // const [cols, setCols] = useState(["时间"])
  // const [colOrder, setColOrder] = useState()
  // const [rowOrder, setRowOrder] = useState()
  // const [aggregatorName, setAggregatorName] = useState("Count") // 计算方式
  // const [vals, setVals] = useState([])
  // const [rendererName, setRendererName] = useState("Table") // 内容展示形式
  // const [valueFilter, setValueFilter] = useState({})
  // const [derivedAttributes, setDerivedAttributes] = useState({})
  // const [hiddenAttributes, setHiddenAttributes] = useState([])
  // const [hiddenFromAggregators, setHiddenFromAggregators] = useState([])
  // const [hiddenFromDragDrop, setHiddenFromDragDrop] = useState([])
  const [pivotData, setPivotData] = useState(null)
  useEffect(() => {
    console.log(pivottableRef.current.props)
    const columnName = columns.map((i) => i.title)
    const twoDimensionalArr = []
    dataSource.forEach((item) => {
      const arr = columns.map((i) => item[i.dataIndex] || 0)
      twoDimensionalArr.push(arr)
    })
    twoDimensionalArr.unshift(columnName)
    setData(twoDimensionalArr)
  }, [dataSource])
  const changeDrag = (e) => {
    setPivotData(e)
  }
  const selectChange = (e) => {
    setAggre(e)
    setPivotData((prev) => {
      prev.aggregatorName = e
      return prev
    })
    // aggregators[e]?.()
  }
  return (
    <div className="l-full pivot">
      {/* <Select
        ref={aggregatorRef}
        style={{ width: 120 }}
        options={aggreOption}
        value={aggre}
        onChange={selectChange}
      ></Select>
      <Select
        ref={pivotTypeRef}
        style={{ width: 120 }}
        options={pivotTypeOption}
        value={aggre}
        onChange={selectChange}
      ></Select> */}

      <PivotTableUI
        ref={pivottableRef}
        style={{ width: "100%" }}
        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        data={data}
        hiddenAttributes={["序号"]}
        aggregatorName={pivotData?.aggregatorName}
        rendererName={pivotData?.rendererName}
        onChange={changeDrag}
        rows={pivotData?.rows}
        cols={pivotData?.cols}
        colOrder={pivotData?.colOrder}
        rowOrder={pivotData?.rowOrder}
        vals={pivotData?.vals}
        valueFilter={pivotData?.valueFilter}
        unusedOrientationCutoff={Infinity}
      />
    </div>
  )
}
