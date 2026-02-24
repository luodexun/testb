/*
 *@Author: chenmeifeng
 *@Date: 2024-03-27 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-18 11:30:50
 *@Description: 报表管理-涉网电量报表
 */

import usePageSearch from "@hooks/use-page-search.ts"
import { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import { vDate } from "@/utils/util-funs"

import { CONTROL_GRID_NEW_COLUMNS, RP_GRID_SCH_FORM_BTNS, RP_GRID_SCH_FORM_ITEMS } from "./configs"
import { getReportGridSchData, reportGridExport } from "./methods"
import { IRpGRIDData, IRpGridSchForm, TRpGridSchFormItemName } from "./types"

export default function ReportPower() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig] = useState<TFormItemConfig<TRpGridSchFormItemName>>()

  const { dataSource, loading, pagination, onSearch } = usePageSearch<IRpGridSchForm, IRpGRIDData>(
    { serveFun: getReportGridSchData },
    { formRef, needFirstSch: false },
  )

  async function onFormAction(type: "export") {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      reportGridExport(formData)
    }
  }

  useEffect(() => {
    // const formInst = formRef.current?.getInst()
    // formInst?.setFieldsValue({ dateRange: [vDate().subtract(1, "day"), vDate()] })
    // formInst?.submit()
    const formInst = formRef.current?.getInst()
    // 获取昨天的日期
    const yesterday = vDate().subtract(1, "day")
    // 获取昨天的开始时间（0点）
    const startOfYesterday = yesterday.startOf("day")
    // 获取昨天的结束时间（24点）
    const endOfYesterday = yesterday.endOf("day")

    formInst?.setFieldsValue({ dateRange: [startOfYesterday, endOfYesterday] })
    formInst?.submit()
  }, [])

  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={RP_GRID_SCH_FORM_ITEMS}
        buttons={RP_GRID_SCH_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="time"
        loading={loading}
        limitHeight
        columns={CONTROL_GRID_NEW_COLUMNS}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
