/*
 *@Author: chenmeifeng
 *@Date: 2024-03-27 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-05 09:45:42
 *@Description: 报表管理-涉网电量报表
 */

import usePageSearch from "@hooks/use-page-search.ts"
import { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import { vDate } from "@/utils/util-funs"

import { CONTROL_HN_COLUMNS, RP_HN_SCH_FORM_BTNS, RP_HN_SCH_FORM_ITEMS } from "./configs/index"
import { getReportHnSchData, reportGridExport } from "./methods"
import { IRpOperationData, IRpOperationSchForm, TRpOperationSchFormItemName } from "./types"

export default function ReportHenan() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig] = useState<TFormItemConfig<TRpOperationSchFormItemName>>()

  const { dataSource, loading, pagination, onSearch } = usePageSearch<IRpOperationSchForm, IRpOperationData>(
    { serveFun: getReportHnSchData },
    { formRef, needFirstSch: false },
  )

  async function onFormAction(type: "export") {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      reportGridExport(formData)
    }
  }

  useEffect(() => {
    const formInst = formRef.current?.getInst()
    // 获取昨天的日期
    const yesterday = vDate().subtract(1, "day")
    // 获取昨天的开始时间（0点）
    const startOfYesterday = yesterday.startOf("day")
    // 获取昨天的结束时间（24点）
    const endOfYesterday = yesterday.endOf("day")

    // 获取昨天22:30
    // const startOfYesterday = yesterday.startOf("day").add(22, "hour").add(30, "minute")
    // // 获取今天22:30
    // const endOfYesterday = vDate().startOf("day").add(22, "hour").add(30, "minute")

    formInst?.setFieldsValue({ dateRange: [startOfYesterday, endOfYesterday] })
    formInst?.submit()
  }, [])

  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={RP_HN_SCH_FORM_ITEMS}
        buttons={RP_HN_SCH_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="index"
        loading={loading}
        limitHeight
        columns={CONTROL_HN_COLUMNS}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
