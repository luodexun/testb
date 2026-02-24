/*
 * @Author: chenmeifeng
 * @Date: 2024-03-07 10:50:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-07 16:21:06
 * @Description: 规则列表
 */
import { useAtomValue } from "jotai"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"
import CustomTable from "@/components/custom-table"
import usePageSearch from "@/hooks/use-page-search"
import useTableSelection from "@/hooks/use-table-selection"
import { getStn2DvsTypeInfoMap } from "@/pages/control-log/methods"
import { AtomConfigMap } from "@/store/atom-config"

import { ALARM_SHIELD_COLUMNS, ALARM_SHIELD_FORM_ITEMS, MODEL_ALARM_SHIELD_SCH_FORM_BTNS } from "../configs"
import { getAlarmShieldData, onAlarmShSchFormChange } from "../methods"
import { IAlarmShieldData, IAlarmShieldParam } from "../types"

const RuleTable = forwardRef((props, ref) => {
  const formRef = useRef<IFormInst | null>(null)
  //搜索组件数据集合
  const [formList, setFormItemConfig] = useState({})
  const { deviceTypeOfStationMap, deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const dvsTypeInfoOfStnMapRef = useRef<ReturnType<typeof getStn2DvsTypeInfoMap>>({})

  // 选择框
  const { rowSelection, selectedRows } = useTableSelection({
    type: "radio",
    needInfo: true,
  })

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<IAlarmShieldParam, IAlarmShieldData>(
    { serveFun: getAlarmShieldData },
    {
      formRef,
    },
  )
  useEffect(() => {
    dvsTypeInfoOfStnMapRef.current = getStn2DvsTypeInfoMap(deviceTypeOfStationMap, deviceTypeMap)
  }, [deviceTypeMap, deviceTypeOfStationMap])
  useEffect(() => {
    // onSearch()
  }, [])
  const deviceTypeMapRef = useRef(deviceTypeMap)
  deviceTypeMapRef.current = deviceTypeMap
  const onSchValueChgRef = async (changedValue: IAlarmShieldParam) => {
    const dvsTypeInfoOfStnMap = dvsTypeInfoOfStnMapRef.current
    const deviceTypeMap = deviceTypeMapRef.current
    const forItemCfgData = await onAlarmShSchFormChange(
      changedValue,
      formRef.current,
      dvsTypeInfoOfStnMap,
      deviceTypeMap,
    )
    setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
  }

  // 暴露数据
  useImperativeHandle(ref, () => ({
    selectedRows: selectedRows,
  }))
  return (
    <div className="page-wrap" style={{ height: "500px" }}>
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formList}
        itemOptions={ALARM_SHIELD_FORM_ITEMS}
        buttons={MODEL_ALARM_SHIELD_SCH_FORM_BTNS}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
        onSearch={onSearch}
      />
      <CustomTable
        rowKey="alarmId"
        limitHeight
        rowSelection={rowSelection}
        columns={ALARM_SHIELD_COLUMNS}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
})
export default RuleTable
