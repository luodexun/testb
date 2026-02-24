/*
 * @Author: chenmeifeng
 * @Date: 2024-03-06 15:17:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-20 14:36:29
 * @Description:
 */
import { Button, Flex } from "antd"
import { useAtomValue, useSetAtom } from "jotai"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"
import CustomTable from "@/components/custom-table"
import usePageSearch from "@/hooks/use-page-search"
import useTableSelection from "@/hooks/use-table-selection"
import { alarmCountInfoSetAtom } from "@/store/atom-alarm"
import { AtomConfigMap } from "@/store/atom-config"

import { CANCEL_SHIELD_COLUMNS, CANCEL_SHIELD_FORM_ITEMS, CANCEL_SHIELD_SCH_FORM_BTNS } from "../configs/cancel-form"
import { cancelShield, getAllShieldData, onCcFormChange } from "../methods/cancel-form"
import { IAlarmShieldData } from "../types"
import { TCcShieldForm } from "../types/cancel-form"

export interface IPerateRef {}
export interface IOperateProps {
  buttonClick?: (type: "ok" | "close", data?: any) => void
}
const CancelShield = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { buttonClick } = props
  const formRef = useRef<IFormInst | null>(null)
  //搜索组件数据集合
  const [formList, setFormItemConfig] = useState({})
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const setGlobalValue = useSetAtom(alarmCountInfoSetAtom)
  // 选择框
  const { rowSelection, selectedRows } = useTableSelection({
    type: "radio",
    needInfo: true,
  })

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<TCcShieldForm, IAlarmShieldData>(
    { serveFun: getAllShieldData },
    {
      formRef,
      // needFirstSch: false,
      // dealRecords: (records) => dealControlLogData(records, controlTypeMap, deviceTypeMap),
    },
  )

  const btnClkRef = async (type: "ok" | "close") => {
    if (type === "ok") {
      const cancelFun = await cancelShield(selectedRows)
      if (!cancelFun) return
      setGlobalValue({
        // alarmInfo: {},
        call: (isErr: boolean) => {
          if (!isErr) return
        },
        // showMqttCount: false,
      })
      buttonClick?.("ok")
      return
    }
    buttonClick?.("close")
  }
  const onSchValueChgRef = useRef(async (changeVal) => {
    const forItemCfgData = await onCcFormChange(changeVal, formRef.current, deviceTypeMap)
    setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
  })

  useImperativeHandle(ref, () => ({}))

  return (
    <div className="cancel-shield">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formList}
        itemOptions={CANCEL_SHIELD_FORM_ITEMS}
        buttons={CANCEL_SHIELD_SCH_FORM_BTNS}
        formOptions={{
          onValuesChange: onSchValueChgRef.current,
        }}
        onSearch={onSearch}
      />
      <CustomTable
        rowKey="id"
        limitHeight
        loading={loading}
        rowSelection={rowSelection}
        columns={CANCEL_SHIELD_COLUMNS}
        dataSource={dataSource}
        pagination={pagination}
      />
      <div className="confirm-btn">
        <Flex gap="small" wrap="wrap" justify="flex-end">
          <Button size="small" onClick={() => btnClkRef("ok")}>
            确认
          </Button>
          <Button size="small" onClick={() => btnClkRef("close")}>
            取消
          </Button>
        </Flex>
      </div>
    </div>
  )
})
export default CancelShield
