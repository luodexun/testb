/* eslint-disable react-hooks/exhaustive-deps */
/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-30 17:39:21
 *@Description: 报表管理-电计量报表
 */

import usePageSearch from "@hooks/use-page-search.ts"
import { ColumnsType } from "antd/es/table"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"

import {
  COLOUMNS_QICI,
  COLOUMNS_SB,
  COLOUMNS_XL,
  CONTROL_LOG_COLUMNS,
  DEFAULT_STATION_MAP,
  END_TIME,
  RP_POWER_SCH_FORM_BTNS,
  RP_POWER_SCH_FORM_ITEMS,
  START_TIME,
} from "./configs"
import { doExportReportPower, getReportPowerSchData, onReportPowerSchFormChg } from "./methods"
import { IRpPowerData, IRpPowerSchForm, TRpPowerSchFormItemName } from "./types"

export default function ReportPower() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()

  const [colums, setColums] = useState<ColumnsType<any>>(CONTROL_LOG_COLUMNS)
  // 执行查询的钩子
  const { dataSource, loading, pageInfo, pagination, onSearch } = usePageSearch<IRpPowerSchForm, IRpPowerData>(
    { serveFun: getReportPowerSchData },
    { formRef, needFirstSch: false },
  )

  async function onFormAction(type: "export") {
    if (type === "export") {
      // 导出
      const formData = formRef.current?.getFormValues()
      doExportReportPower(pageInfo, formData)
    }
  }

  const onSchValueChgRef = useRef(async (changedValue: IRpPowerSchForm) => {
    const keys = Object.keys(changedValue)
    if (keys?.[0] !== "deviceType") return
    const options = await onReportPowerSchFormChg(changedValue, null)
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ stationCode: undefined })
    setFormItemConfig((prevState) => ({ ...prevState, stationCode: { options: options || [] } }))
  })

  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ dateRange: [START_TIME, END_TIME] })
    formInst?.submit()
  }, [])

  useEffect(() => {
    const { deviceType = "WT", groupByPath } = formRef.current?.getFormValues() || {}
    const othersColums = DEFAULT_STATION_MAP?.[deviceType]?.colums || []
    let actColumns = CONTROL_LOG_COLUMNS
    if (groupByPath === "PERIOD") {
      actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_QICI]
    } else if (groupByPath === "LINE") {
      actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_XL]
    } else if (groupByPath === "DEVICE_CODE") {
      actColumns = [...CONTROL_LOG_COLUMNS, ...COLOUMNS_SB]
    }
    setColums([...actColumns, ...othersColums])
  }, [dataSource])
  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={RP_POWER_SCH_FORM_ITEMS}
        buttons={RP_POWER_SCH_FORM_BTNS}
        formOptions={{
          // validateTrigger: ["onSubmit"],
          onValuesChange: onSchValueChgRef.current,
        }}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="index"
        limitHeight
        loading={loading}
        columns={colums}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
