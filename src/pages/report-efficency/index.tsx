/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-30 14:52:01
 *@Description: 报表管理-电计量报表
 */

import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import { ColumnsType } from "antd/es/table"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"

import CurveContent from "./components/curve-content"
import { COLUMNS, END_TIME, RP_POWER_SCH_FORM_BTNS, RP_POWER_SCH_FORM_ITEMS, START_TIME, TAB_LIST } from "./configs"
import { doExportReportPower, getReportPowerSchData, getSelectNum } from "./methods"
import { IRpPowerData, IRpPowerSchForm } from "./types"

export default function ReportEfficency() {
  const formRef = useRef<IFormInst | null>(null)
  const [isSelected, setSelect] = useState(0)
  const timeoutRef = useRef(null)
  const [colums, setColums] = useState<ColumnsType<any>>(COLUMNS)
  // 执行查询的钩子
  const { dataSource, loading, pageInfo, pagination, onSearch, setDataSource } = usePageSearch<
    IRpPowerSchForm,
    IRpPowerData
  >({ serveFun: getReportPowerSchData }, { formRef, needFirstSch: false })

  async function onFormAction(type: "export") {
    if (type === "export") {
      // 导出
      const formData = formRef.current?.getFormValues()
      doExportReportPower(pageInfo, formData)
    }
  }

  function handleSelect(index) {
    setDataSource([])
    setSelect(index)
    getSelectNum(index)
    onSearch()
  }
  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ dateRange: [START_TIME, END_TIME] })
    timeoutRef.current = setTimeout(() => {
      formInst?.submit()
    }, 400)
    return () => clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => {
    if (isSelected) {
      const { deviceType } = formRef.current?.getFormValues() || {}
      const columsLabel: any = {
        dataIndex: deviceType === "DQ" ? "shortPredPower" : "ultraShortPredPower",
        title: deviceType === "DQ" ? "短期功率（kW）" : "超短期功率（kW）",
        align: "center",
      }
      setColums([...COLUMNS, columsLabel])
    }
  }, [dataSource, isSelected])

  return (
    <div className="page-wrap report-efficency-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptions={RP_POWER_SCH_FORM_ITEMS}
        buttons={RP_POWER_SCH_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
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
            rowKey="id"
            limitHeight
            loading={loading}
            columns={colums}
            dataSource={dataSource}
            pagination={pagination}
          />
        ) : (
          <CurveContent data={dataSource} formRef={formRef} />
        )}
      </div>
    </div>
  )
}
