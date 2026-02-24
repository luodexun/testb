/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-13 11:14:11
 *@Description: 报表管理-电计量报表
 */
import "./index.less"
import usePageSearch from "@hooks/use-page-search.ts"
import { showMsg, vDate } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import AlarmConfirmModel, { IOperateProps, IPerateRef } from "@/components/alarm-confirm-model"
import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import useTableSelection from "@/hooks/use-table-selection"
import { AtomConfigMap } from "@/store/atom-config"

import { ALARM_HISTORY_COLUMNS, RP_POWER_SCH_FORM_BTNS, RP_POWER_SCH_FORM_ITEMS } from "./configs"
import {
  changeIsJumpTOThisPage,
  doExportHstyAlarm,
  getAlarmLevelList,
  getAllBelongSystem,
  getBrakeLevelList,
  getReportPowerSchData,
  onAlarmHistorySchFormChg,
  toMonitorPage,
} from "./methods"
import { AlarmListData, AlarmSerForm, TAlarmHistoryFormField, TAlarmHistoryTbActInfo } from "./types/index"
import { bacthPass } from "@/utils/device-funs"
import { Button, Dropdown, MenuProps } from "antd"
import { EXPORT_LIST1 } from "@/configs/option-const"

const rowSelectProps = {
  needInfo: true,
  getCheckboxProps: (record: AlarmListData) => ({
    disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15, // Column configuration not to be checked
    name: record.alarmDesc,
  }),
}
export default function ReportPower() {
  //搜索组件数据集合
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TAlarmHistoryFormField>>({})
  const formRef = useRef<IFormInst | null>(null)
  const modeRef = useRef(null)
  const containerRef = useRef(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [params] = useSearchParams()
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const deviceTypeMapRef = useMemo(() => {
    return deviceTypeMap
  }, [deviceTypeMap])
  useEffect(() => {
    const obj = {}
    const formInst = formRef.current?.getInst()

    params?.forEach((value, key) => {
      obj[key] = value
      key === "deviceIds" ? (obj["deviceIds"] = [parseInt(value)]) : ""
      key === "stationId" ? (obj["stationId"] = parseInt(value)) : ""
    })
    if (params?.size) {
      changeIsJumpTOThisPage()
      formInst?.setFieldsValue({ ...obj, dateRange: [vDate().subtract(1, "day"), vDate()] })
    } else {
      formInst?.setFieldsValue({ dateRange: [vDate().subtract(7, "day"), vDate()] })
    }
    // setTimeout(() => {
    //   formInst?.submit()
    // }, 500)
    initSelectData().then(() => {})
  }, [])

  //初始化停机等级和告警等级
  const initSelectData = async () => {
    // await getAllBelongSystem()
    const getAlarmLevelLists = await getAlarmLevelList()
    const getBrakeLevelLists = await getBrakeLevelList()

    setFormItemConfig((prevState) => ({ ...prevState, alarmLevelId: { options: getAlarmLevelLists || [] } }))
    setFormItemConfig((prevState) => ({ ...prevState, brakeLevelId: { options: getBrakeLevelLists || [] } }))
  }

  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<AlarmSerForm, AlarmListData>(
    { serveFun: getReportPowerSchData },
    { formRef, needFirstSch: false },
  )

  async function onFormAction(type: string, select) {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      doExportHstyAlarm(formData, select.key)
    } else if (type === "batchCmomfirm") {
      if (!selectedRows.length) {
        showMsg("请至少选择一条！")
        return // messageApi.open({ type: "warning", content: "请至少选择一条！" })
      }
      setIsModalOpen(true)
    }
  }

  // 判断是否点击了列表中的确认操作
  const [isOperateCell, setOperateState] = useState(false)
  // 设置选中的一条数据
  const [operateOneAlarmData, setOperateOneAlarmData] = useState([])
  const navigate = useNavigate()
  function onTbAction(record: AlarmListData, { key }: TAlarmHistoryTbActInfo) {
    if (key === "ensure") {
      setIsModalOpen(true)
      setOperateState(true)
      setOperateOneAlarmData([record])
    }
    if (key === "toMonitor") {
      toMonitorPage(record, navigate)
    }
  }

  const btnClkRef = async (type: "ok" | "close", data: string) => {
    // 执行
    if (type === "ok") {
      const res = await bacthPass(isOperateCell ? operateOneAlarmData : selectedRows, data)
      if (!res) return
      setIsModalOpen(false)
      setOperateState(false)
      setSelectedRowKeys([])
      setSelectedRows([])
      return onSearch()
    }
    if (type === "close") return setIsModalOpen(false)
  }

  const onSchValueChgRef = async (changedValue) => {
    const chgOptions = await onAlarmHistorySchFormChg(changedValue, formRef.current, deviceTypeMapRef)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  }

  return (
    <div className="page-wrap alarm-history" ref={containerRef}>
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="30%"
        title="确认备注"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={AlarmConfirmModel}
        componentProps={{ buttonClick: btnClkRef }}
      />
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={RP_POWER_SCH_FORM_ITEMS}
        buttons={RP_POWER_SCH_FORM_BTNS}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        rowSelection={rowSelection}
        limitHeight
        loading={loading}
        columns={ALARM_HISTORY_COLUMNS({ onClick: onTbAction })}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
