/*
 * @Author: chenmeifeng
 * @Date: 2024-08-29 10:41:41
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-14 16:24:44
 * @Description:
 */
import { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import usePageSearch from "@/hooks/use-page-search"
import useTableSelection from "@/hooks/use-table-selection"
import { showMsg } from "@/utils/util-funs"

import { ALARM_RULE_COLUMNS, AR_FORM_BTNS, BATCH_CONTROL_KEYS } from "../configs/table"
import {
  batchDelRules,
  doExportAlarmRule,
  getAlarmRuleSchData,
  updateRulesAction,
  updateRulesEnable,
} from "../methods/table"
import { IBatchStn2DvsTreeData } from "../types"
import { AlarmSerForm, IAlarmRuleLs, TEditType } from "../types/table"
import EditRuleModel, { IOperateProps, IPerateRef } from "./edit-rule/index"
const rowSelectProps = {
  needInfo: true,
  getCheckboxProps: (record: IAlarmRuleLs) => ({
    // disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15, // Column configuration not to be checked
    name: record.id?.toString(),
  }),
}
interface IProps {
  devices: Array<IBatchStn2DvsTreeData>
}
export default function AlarmRuleTable(props: IProps) {
  const { devices } = props
  const modeRef = useRef(null)
  const formRef = useRef<IFormInst | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [device, setDevice] = useState<IAlarmRuleLs>(null) // 当前选择的行数据
  const [editType, setEditType] = useState<TEditType>("add")
  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<AlarmSerForm, IAlarmRuleLs>(
    { serveFun: getAlarmRuleSchData },
    { formRef, needFirstSch: false, otherParams: { deviceIds: devices?.map((i) => i.deviceId) } },
  )

  async function onFormAction(type: string) {
    setDevice(null)
    const ids = selectedRows.map((i) => i.id)
    if (BATCH_CONTROL_KEYS.includes(type) && !ids.length) {
      showMsg("请选择要操作的行！")
      return
    }
    if (type === "batchDelete") {
      await batchDelRules(ids)
    } else if (type === "add" && devices?.length) {
      setIsModalOpen(true)
      setEditType("add")
    } else if (type === "add" && !devices?.length) {
      showMsg("请至少选择一台设备！")
    } else if (type === "disable" || type === "enable") {
      await updateRulesEnable(ids, type === "disable" ? 0 : 1)
    } else if (type === "shutdown") {
      await updateRulesAction(ids, 1)
    } else if (type === "export") {
      const deviceIds = devices?.map((i) => i.deviceId)
      doExportAlarmRule(deviceIds)
    }
    if (BATCH_CONTROL_KEYS.includes(type)) {
      onSearch()
      setSelectedRows([])
      setSelectedRowKeys([])
    }
  }
  const onTbAction = async (info, { key }) => {
    setDevice(info)
    setEditType("edit")
    if (key === "edit") {
      setIsModalOpen(true)
    } else if (key === "delete") {
      const res = await batchDelRules([info.id])
      onSearch()
    }
  }
  const btnClkRef = useRef((type) => {
    setIsModalOpen(false)
    if (type === "ok") onSearch()
  })
  const searchTable = () => {
    if (!devices?.length) {
      showMsg("请至少选择一台设备！")
      return
    }
    onSearch()
  }
  useEffect(() => {
    console.log(devices, "deviceIds")
  }, [devices])
  return (
    <div className="alrule-table l-full">
      <div className="alrule-top"></div>
      <CustomForm
        ref={formRef}
        loading={loading}
        // itemOptionConfig={formItemConfig}
        // itemOptions={RP_POWER_SCH_FORM_ITEMS}
        buttons={AR_FORM_BTNS}
        onSearch={searchTable}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        rowSelection={rowSelection}
        limitHeight
        loading={loading}
        columns={ALARM_RULE_COLUMNS({ onClick: onTbAction })}
        dataSource={dataSource}
        pagination={pagination}
      />
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="80%"
        title=""
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={EditRuleModel}
        componentProps={{ buttonClick: btnClkRef.current, data: device, devices, editType }}
      />
    </div>
  )
}
