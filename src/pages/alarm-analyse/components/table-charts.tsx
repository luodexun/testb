/*
 * @Author: chenmeifeng
 * @Date: 2024-04-01 10:00:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-02 10:32:00
 * @Description: 告警分析内容组件
 */
import "./table-content.less"

import { useState } from "react"

import CustomTable from "@/components/custom-table"

import { ALARM_ANALYSE_COLUMNS } from "../configs"
import AnalyseContent from "./analyse-content"

interface IProps {
  loading: boolean
  dataSource?: any
  pagination?: any
  onSelect?: (value: number) => void
}
export default function ChartAndTable(props: IProps) {
  const { dataSource, pagination, onSelect } = props
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
            columns={ALARM_ANALYSE_COLUMNS}
            dataSource={dataSource}
            pagination={{ ...pagination, pageSize: dataSource.length, pageSizeOptions: [dataSource.length] }}
          />
        ) : (
          <AnalyseContent dataSource={dataSource} />
        )}
      </div>
    </div>
  )
}
