/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-16 13:38:47
 *@Description: 控制日志
 */

import usePageSearch from "@hooks/use-page-search.ts"
import {
  dealControlLogData,
  exportControlLog,
  getControlLogData,
  getStn2DvsTypeInfoMap,
  onCtrlLogSchFormChange,
} from "@pages/control-log/methods"
import { IControlLogData, IControlLogSchForm, TControlLogSchFmItemName } from "@pages/control-log/types"
import { AtomConfigMap } from "@store/atom-config.ts"
import { vDate } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"

import { CONTROL_LOG_COLUMNS, CTRL_LOG_SCH_FORM_BTNS, CTRL_LOG_SCH_FORM_ITEMS } from "./configs"

export default function ControlLog() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TControlLogSchFmItemName>>({})
  const { deviceTypeOfStationMap, deviceTypeMap, controlTypeMap } = useAtomValue(AtomConfigMap).map

  const dvsTypeInfoOfStnMapRef = useRef<ReturnType<typeof getStn2DvsTypeInfoMap>>({})

  useEffect(() => {
    dvsTypeInfoOfStnMapRef.current = getStn2DvsTypeInfoMap(deviceTypeOfStationMap, deviceTypeMap)
  }, [deviceTypeMap, deviceTypeOfStationMap])

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<IControlLogSchForm, IControlLogData>(
    { serveFun: getControlLogData },
    {
      formRef,
      needFirstSch: false,
      dealRecords: (records) => dealControlLogData(records, controlTypeMap, deviceTypeMap),
    },
  )

  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ dateRange: [vDate().subtract(7, "d"), vDate()] })
    formInst?.submit()
    // return () => {
    //   formInst.resetFields()
    //   console.log("组件即将卸载", formInst.getFieldsValue())
    //   // 在这里执行清理操作
    // }
  }, [])

  function onFormAction() {
    // 导出
    const formData = formRef.current?.getFormValues()
    exportControlLog(formData)
  }

  const deviceTypeMapRef = useRef(deviceTypeMap)
  deviceTypeMapRef.current = deviceTypeMap

  const onSchValueChgRef = async (changedValue: IControlLogSchForm) => {
    const dvsTypeInfoOfStnMap = dvsTypeInfoOfStnMapRef.current
    const deviceTypeMap = deviceTypeMapRef.current
    const forItemCfgData = await onCtrlLogSchFormChange(
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
        columns={CONTROL_LOG_COLUMNS}
        dataSource={dataSource}
        limitHeight
        scroll={{ y: 750 }}
        pagination={pagination}
      />
    </div>
  )
}
