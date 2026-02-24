/*
 *@Author: chenmeifeng
 *@Date: 2024-03-27 16:03:08
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-26 15:26:40
 *@Description: 报表管理-涉网电量报表
 */

import usePageSearch from "@hooks/use-page-search.ts"
import { ColumnsType } from "antd/es/table"
import { useEffect, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import { vDate } from "@/utils/util-funs"

import { CONTROL_OPERATION_COLUMNS, RP_OPERATION_SCH_FORM_BTNS, RP_OPERATION_SCH_FORM_ITEMS } from "./configs/index"
import { getReportGridSchData, reportGridExport } from "./methods"
import { IRpOperationData, IRpOperationSchForm, TRpOperationSchFormItemName } from "./types"

export default function ReportPower() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig] = useState<TFormItemConfig<TRpOperationSchFormItemName>>()
  const [deviceType, setDeviceType] = useState("GLYC")

  const { dataSource, loading, pagination, onSearch } = usePageSearch<IRpOperationSchForm, IRpOperationData>(
    { serveFun: getReportGridSchData },
    { formRef, needFirstSch: false },
  )

  const columns = useMemo(() => {
    return CONTROL_OPERATION_COLUMNS?.filter((item) => item.unShow !== deviceType) as ColumnsType<any>
  }, [deviceType])
  async function onFormAction(type: "export") {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      reportGridExport(formData)
    }
  }

  const searchRef = () => {
    onSearch()
    const formInst = formRef.current?.getInst()
    const { deviceType } = formInst?.getFieldsValue() || {}
    setDeviceType(deviceType)
  }
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({
      dateRange: [vDate().subtract(1, "day"), vDate().subtract(1, "day")],
      deviceType: "GLYC",
    })
    formInst?.submit()
  }, [])

  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={RP_OPERATION_SCH_FORM_ITEMS}
        buttons={RP_OPERATION_SCH_FORM_BTNS}
        onSearch={searchRef}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="index"
        loading={loading}
        limitHeight
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
