/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 15:13:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-23 14:23:00
 * @Description: 告警分组
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

import { ALARM_HISTORY_COLUMNS, CHECKBOX_OPTS, RP_POWER_SCH_FORM_BTNS, RP_POWER_SCH_FORM_ITEMS } from "./configs"
import {
  changeIsJumpTOThisPage,
  doExportHstyAlarm,
  getAlarmLevelList,
  getAllBelongSystem,
  getBrakeLevelList,
  getReportPowerSchData,
  initCurData,
  onAlarmHistorySchFormChg,
  toMonitorPage,
} from "./methods"
import { AlarmListData, AlarmSerForm, TAlarmHistoryFormField, TAlarmHistoryTbActInfo } from "./types/index"
import { bacthPass } from "@/utils/device-funs"
import { Button, Checkbox, Dropdown, MenuProps } from "antd"
import { EXPORT_LIST1 } from "@/configs/option-const"
import AlarmAnalyseTree, { IAlarmAnalyseTreeProps } from "../alarm-analyse/components/alarm-analyse-tree"
import { TDeviceType } from "@/types/i-config"
import { isNumber } from "ahooks/es/utils"
import PropertyBox from "@/components/property-checkbox"

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
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const deviceDataRef = useRef([])
  const stationIdList = useRef([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [defaultCheckDvs, setDefaultCheckDvs] = useState([])
  const [params] = useSearchParams()
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const deviceTypeMapRef = useMemo(() => {
    return deviceTypeMap
  }, [deviceTypeMap])
  const [property, setProperty] = useState(null)
  const [openProperty, setOpenProperty] = useState(false)
  useEffect(() => {
    const obj = {}
    const formInst = formRef.current?.getInst()

    params?.forEach((value, key) => {
      obj[key] = value
      key === "deviceIds" ? (obj["deviceIds"] = [parseInt(value)]) : ""
      key === "stationId" ? (obj["stationId"] = parseInt(value)) : ""
    })
    const dvsTypeLs = Object.keys(deviceTypeMapRef)?.map((i) => {
      return {
        label: deviceTypeMapRef[i],
        value: i,
      }
    })
    setFormItemConfig((prevState) => ({ ...prevState, deviceType: { options: dvsTypeLs } }))
    if (params?.size) {
      changeIsJumpTOThisPage()
      formInst?.setFieldsValue({ ...obj, dateRange: [vDate().subtract(7, "day"), vDate()] })
      setDefaultCheckDvs(obj["deviceIds"])
      formInst?.submit()
    } else {
      formInst?.setFieldsValue({ dateRange: [vDate().subtract(7, "day"), vDate()], deviceType: "WT" })
    }
    initSelectData().then(() => {})
    return () => initCurData()
  }, [deviceTypeMapRef])

  //初始化停机等级和告警等级
  const initSelectData = async () => {
    // await getAllBelongSystem()
    const getBrakeLevelLists = await getBrakeLevelList()
    setFormItemConfig((prevState) => ({ ...prevState, brakeLevelId: { options: getBrakeLevelLists || [] } }))
  }

  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<AlarmSerForm, AlarmListData>(
    { serveFun: getReportPowerSchData },
    {
      formRef,
      needFirstSch: false,
      otherParams: { deviceIdList: deviceDataRef.current, stationIdList: stationIdList.current },
    },
  )

  async function onFormAction(type: string, select) {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      const formActualData = { ...formData, deviceIdList: deviceDataRef.current, stationIdList: stationIdList.current }
      doExportHstyAlarm(formActualData, select.key)
    } else if (type === "batchCmomfirm") {
      if (!selectedRows.length) {
        showMsg("请至少选择一条！")
        return // messageApi.open({ type: "warning", content: "请至少选择一条！" })
      }
      setIsModalOpen(true)
    } else if (type === "property") {
      setOpenProperty((prev) => !prev)
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
    if (changedValue?.deviceType) {
      const dvsType = formRef?.current?.getFormValues()?.deviceType
      setDeviceType(dvsType)
    }
  }
  const onSelectRef = useRef<IAlarmAnalyseTreeProps["onSelect"]>((devices) => {
    const station = devices?.filter((item) => !isNumber(item))?.filter((i: any) => i.split("_")?.length === 3)
    const stationIds = station.map((i: any) => i.split("_")?.[0])
    const unrepeatStationIds = [...new Set(stationIds)]
    stationIdList.current = unrepeatStationIds
    deviceDataRef.current = devices.filter((item) => isNumber(item))
  })

  const propertyClk = useRef((type, propertyInfo) => {
    if (type === "comfirm") {
      setProperty(propertyInfo)
    } else {
      setOpenProperty(false)
    }
  })
  return (
    <div className="l-full page-wrap alarm-history">
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
      <div className="alarm-history-content">
        <div className="alarm-history-content-left">
          <AlarmAnalyseTree deviceType={deviceType} defaulCheckKeys={defaultCheckDvs} onSelect={onSelectRef.current} />
        </div>
        <div className="alarm-history-content-right">
          <CustomTable
            rowKey="id"
            rowSelection={rowSelection}
            limitHeight
            loading={loading}
            columns={ALARM_HISTORY_COLUMNS({ onClick: onTbAction }, property)}
            dataSource={dataSource}
            pagination={pagination}
          />
        </div>
      </div>
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
      {openProperty ? <PropertyBox options={CHECKBOX_OPTS} property={property} btnClick={propertyClk.current} /> : ""}
    </div>
  )
}
