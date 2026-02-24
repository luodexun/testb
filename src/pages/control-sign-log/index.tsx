/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-11 17:07:28
 *@Description: 控制日志
 */

import usePageSearch from "@hooks/use-page-search.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import { vDate } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"
import React, { useEffect, useRef, useState, useMemo } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"

import { CONTROL_LOG_COLUMNS, WORK_LOG_COLUMNS, CTRL_LOG_SCH_FORM_BTNS, CTRL_LOG_SCH_FORM_ITEMS } from "./configs"
import { TSignLogSchFmItemName, ISignLogSchForm, ISignLogData } from "./types"
import { exportControlLog, getSignLogData, getStn2DvsTypeInfoMap, onSignLogSchFormChange } from "./methods"
import { dealControlLogData } from "../control-log/methods"

export default function ControlLog() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TSignLogSchFmItemName>>({})
  const { deviceTypeOfStationMap, deviceTypeMap, controlTypeMap } = useAtomValue(AtomConfigMap).map

  const dvsTypeInfoOfStnMapRef = useRef<ReturnType<typeof getStn2DvsTypeInfoMap>>({})
  const [tableColumns, setTableColumns] = useState<any[]>([])

  useEffect(() => {
    dvsTypeInfoOfStnMapRef.current = getStn2DvsTypeInfoMap(deviceTypeOfStationMap, deviceTypeMap)
  }, [deviceTypeMap, deviceTypeOfStationMap])

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<ISignLogSchForm, ISignLogData>(
    { serveFun: getSignLogData },
    {
      formRef,
      needFirstSch: false,
    },
  )

  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ logType: 1 })
    formInst?.setFieldsValue({ dateRange: [vDate().subtract(7, "d"), vDate()] })
    formInst?.submit()
  }, [])

  function onFormAction() {
    // 导出
    const formData = formRef.current?.getFormValues()
    exportControlLog(formData)
  }
  useMemo(()=>{
    let logType = formRef.current?.getFormValues().logType
    setTableColumns(logType == 1 ? CONTROL_LOG_COLUMNS : WORK_LOG_COLUMNS)
  },[formRef.current?.getFormValues()?.logType])

  const deviceTypeMapRef = useRef(deviceTypeMap)
  deviceTypeMapRef.current = deviceTypeMap

  const onSchValueChgRef = async (changedValue: ISignLogSchForm) => {
    const dvsTypeInfoOfStnMap = dvsTypeInfoOfStnMapRef.current
    const deviceTypeMap = deviceTypeMapRef.current
    const forItemCfgData = await onSignLogSchFormChange(
      changedValue,
      formRef.current,
      dvsTypeInfoOfStnMap,
      deviceTypeMap,
    )
    setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
  }
  return (
    <div className="page-wrap control-log-warp">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={CTRL_LOG_SCH_FORM_ITEMS}
        buttons={CTRL_LOG_SCH_FORM_BTNS}
        formOptions={{ onValuesChange: onSchValueChgRef }}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        columns={tableColumns}
        dataSource={dataSource}
        limitHeight
        scroll={{ y: 750 }}
        pagination={pagination}
      />
    </div>
  )
}
