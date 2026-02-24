import "./index.less"
import CustomForm from "@/components/custom-form"
import CustomTable from "@/components/custom-table"
import { ALARM_HISTORY_COLUMNS, RP_POWER_SCH_FORM_BTNS } from "@/pages/alarm-historyV2/configs"
import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import { SITE_HSTY_SCH_FORM_ITEMS, SVG_HTRY_SCH_FORM_BTNS } from "./config"
import {
  doExportHstyAlarm,
  getBrakeLevelList,
  getReportPowerSchData,
  initCurData,
  onAlarmHistorySchFormChg,
  toMonitorPage,
} from "@/pages/alarm-historyV2/methods"
import { bacthPass } from "@/utils/device-funs"
import { useNavigate } from "react-router-dom"
import {
  AlarmListData,
  AlarmSerForm,
  TAlarmHistoryFormField,
  TAlarmHistoryTbActInfo,
} from "@/pages/alarm-historyV2/types"
import { getAlarmLevelByType, getBelongForType, showMsg, vDate } from "@/utils/util-funs"
import usePageSearch from "@/hooks/use-page-search"
import useTableSelection from "@/hooks/use-table-selection"
import { useAtomValue } from "jotai"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import CustomModal from "@/components/custom-modal"
import AlarmConfirmModel, { IOperateProps, IPerateRef } from "@/components/alarm-confirm-model"
export interface ISvgHstyTblRef {}
export interface ISvgHstyTblProps {
  stationId: number
  deviceId: number
}
const rowSelectProps = {
  needInfo: true,
  getCheckboxProps: (record: AlarmListData) => ({
    disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15, // Column configuration not to be checked
    name: record.alarmDesc,
  }),
}
const SvgHistoryTable = forwardRef<ISvgHstyTblRef, ISvgHstyTblProps>((props, ref) => {
  const { stationId, deviceId } = props
  //搜索组件数据集合
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TAlarmHistoryFormField>>({})
  const formRef = useRef<IFormInst | null>(null)
  const modeRef = useRef(null)
  const containerRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ dateRange: [vDate().subtract(3, "day"), vDate()], deviceType: "WT" })
    setTimeout(() => {
      formInst?.submit()
    }, 500)
    initSelectData().then(() => {})
    return () => initCurData()
  }, [])

  //初始化停机等级和告警等级
  const initSelectData = async () => {
    const getBrakeLevelLists = await getBrakeLevelList()
    const systemIdOptions = (await getBelongForType("SYZZZ")) || []
    const alarmLevelOpts = getAlarmLevelByType("SYZZZ")
    setFormItemConfig((prevState) => ({
      ...prevState,
      systemId: { options: systemIdOptions },
      alarmLevelId: { options: alarmLevelOpts },
      brakeLevelId: { options: getBrakeLevelLists || [] },
    }))
  }

  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<AlarmSerForm, AlarmListData>(
    { serveFun: getReportPowerSchData },
    {
      formRef,
      needFirstSch: false,
      otherParams: { deviceIdList: [deviceId], stationIdList: [stationId] },
    },
  )

  async function onFormAction(type: string, select) {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      const formActualData = { ...formData, deviceIdList: [deviceId], stationIdList: [stationId] }
      doExportHstyAlarm(formActualData, select.key)
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
    const chgOptions = await onAlarmHistorySchFormChg(changedValue, formRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  }
  return (
    <div className="l-full page-wrap site-hty">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={SITE_HSTY_SCH_FORM_ITEMS}
        buttons={SVG_HTRY_SCH_FORM_BTNS}
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
        columns={ALARM_HISTORY_COLUMNS({ onClick: onTbAction }, {})}
        dataSource={dataSource}
        pagination={pagination}
      />
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
    </div>
  )
})
export default SvgHistoryTable
