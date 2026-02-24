/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-26 10:44:54
 *@Description: 报表管理-电计量报表
 */

import usePageSearch from "@hooks/use-page-search.ts"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import { vDate } from "@/utils/util-funs"

import { CONTROL_LOG_COLUMNS, RP_POWER_SCH_FORM_BTNS, RP_POWER_SCH_FORM_ITEMS } from "./configs"
import { getReportPowerSchData, reportMeterExport } from "./methods"
import { IRpPowerData, IRpPowerSchForm, TRpPowerSchFormItemName } from "./types"

export default function ReportPower() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<IRpPowerSchForm, IRpPowerData>(
    { serveFun: getReportPowerSchData },
    { formRef, needFirstSch: false },
  )

  async function onFormAction(type: "export") {
    if (type === "export") {
      // 导出
      const formData = formRef.current?.getFormValues()
      reportMeterExport(formData)
    }
  }

  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ dateRange: [vDate().startOf("day"), vDate()] })
    formInst?.submit()
  }, [])

  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={RP_POWER_SCH_FORM_ITEMS}
        buttons={RP_POWER_SCH_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        loading={loading}
        limitHeight
        columns={CONTROL_LOG_COLUMNS}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
