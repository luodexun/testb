import "./index.less"

import { Drawer, DrawerProps } from "antd"
import { useAtomValue } from "jotai"
import { useCallback, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import CustomTable from "@/components/custom-table"
import usePageSearch from "@/hooks/use-page-search"
import useTableSelection from "@/hooks/use-table-selection"
import { AtomConfigMap } from "@/store/atom-config"
import { showMsg } from "@/utils/util-funs"

import AlarmRule from "."
import { ALARM_NEW_RULE_COLUMNS, ALARM_RULE_SCH_FORM_ITEMS, AR_WAI_FORM_BTNS } from "./configs"
import { BATCH_CONTROL_KEYS } from "./configs/table"
import { onAlarmRuleSchFormChg } from "./methods"
import {
  batchDelRules,
  doExportAlarmRule,
  getAlarmRuleSchData,
  updateRulesAction,
  updateRulesEnable,
} from "./methods/table"
import { AlarmSerForm, TAlarmFormField } from "./types"
import { IAlarmRuleLs } from "./types/table"
const COMMON_PROPS: DrawerProps = {
  placement: "right",
  width: "100%",
  closable: false,
  destroyOnClose: true,
  rootStyle: { position: "absolute", left: 0, padding: 0, height: "100%", width: "100%" },
  styles: { wrapper: { left: 0, height: "100%", width: "100%", maxWidth: "unset" } },
}
const rowSelectProps = {
  needInfo: true,
  getCheckboxProps: (record: IAlarmRuleLs) => ({
    // disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15, // Column configuration not to be checked
    name: record.id?.toString(),
  }),
}
export default function AlarmRuleContent() {
  const modeRef = useRef(null)
  const formRef = useRef<IFormInst | null>(null)
  const containerRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TAlarmFormField>>({})
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map

  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)
  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<AlarmSerForm, IAlarmRuleLs>(
    { serveFun: getAlarmRuleSchData },
    { formRef, needFirstSch: true },
  )

  const onSchValueChgRef = async (changedValue) => {
    const chgOptions = await onAlarmRuleSchFormChg(changedValue, formRef.current, deviceTypeMap)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  }

  const onFormAction = async (type) => {
    if (type === "toPage") {
      setOpenDrawer(true)
    }
    const ids = selectedRows.map((i) => i.id)
    if (BATCH_CONTROL_KEYS.includes(type) && !ids.length) {
      showMsg("请选择要操作的行！")
      return
    }
    if (type === "batchDelete") {
      await batchDelRules(ids)
    } else if (type === "disable" || type === "enable") {
      await updateRulesEnable(ids, type === "disable" ? 0 : 1)
    } else if (type === "shutdown") {
      await updateRulesAction(ids, 1)
    } else if (type === "export") {
      const deviceIds = []
      doExportAlarmRule(deviceIds)
    }
    if (BATCH_CONTROL_KEYS.includes(type)) {
      onSearch()
      setSelectedRows([])
      setSelectedRowKeys([])
    }
  }
  const onClose = () => {
    setOpenDrawer(false)
  }
  const setDrawer = useCallback(() => {
    setOpenDrawer(false)
  }, [])
  return (
    <div className="page-wrap alarm-rule" ref={containerRef}>
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={ALARM_RULE_SCH_FORM_ITEMS}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
        buttons={AR_WAI_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        rowSelection={rowSelection}
        limitHeight
        loading={loading}
        columns={ALARM_NEW_RULE_COLUMNS}
        dataSource={dataSource}
        pagination={pagination}
      />
      <Drawer
        {...COMMON_PROPS}
        closable={false}
        onClose={onClose}
        open={openDrawer}
        getContainer={containerRef.current}
      >
        <AlarmRule setDrawer={setDrawer} />
      </Drawer>
    </div>
  )
}
