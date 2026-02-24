/*
 *@Author: chenmeifeng
 *@Date: 2023-11-06 15:34:53
 *@LastEditors: chenmeifeng
 *@LastEditTime: 2023-11-06 15:34:53
 *@Description: 模块描述
 */
import "./table-content.less"

import { useState } from "react"

import CustomTable from "@/components/custom-table"
import { IFormInst } from "@/components/custom-form/types.ts"
import { COLUMNS } from "../configs"
import CurveContent from "./curve-content"

interface IProps {
  loading: boolean
  treeFromRef?: IFormInst | null
  dataSource?: any
  pagination?: any
  onSelect?: (value: number) => void
}
export default function ChartAndTable(props: IProps) {
  const { treeFromRef, dataSource, pagination, onSelect } = props
  const TAB_LIST = ["曲线", "表格"]
  const [isSelected, setSelected] = useState(0)
  const handleSelect = (index) => {
    setSelected(index)
    onSelect?.(index)
  }
  return (
    <div className="l-full table-charts-wrap">
      <div className="tab">
        <div className="tab-list">
          {TAB_LIST.map((e, index) => (
            <span
              key={e}
              className={`item ${isSelected === index ? "active" : ""}`}
              onClick={() => handleSelect(index)}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
      <div className="content">
        {isSelected ? (
          <CustomTable
            rowKey="index"
            limitHeight
            initHeight={"100%"}
            columns={COLUMNS}
            dataSource={dataSource}
            pagination={pagination}
          />
        ) : (
          <CurveContent chartData={dataSource} treeFromRef={treeFromRef} />
        )}
      </div>
    </div>
  )
}
