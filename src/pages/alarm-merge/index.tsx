/*
 * @Author: chenmeifeng
 * @Date: 2024-04-16 15:13:53
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-28 14:12:25
 * @Description: 告警分组
 */
import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import { isNumber } from "ahooks/es/utils"
import { useEffect, useRef, useState } from "react"

import AlarmConfirmModel, { IOperateProps, IPerateRef } from "@/components/alarm-confirm-model"
import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import { day4Y2S } from "@/configs/time-constant"
import useTableSelection from "@/hooks/use-table-selection"
import { TDeviceType } from "@/types/i-config.ts"
import { getStartAndEndTime } from "@/utils/form-funs"
import { showMsg, vDate } from "@/utils/util-funs"

import AlarmAnalyseTree, { IAlarmAnalyseTreeProps } from "../alarm-analyse/components/alarm-analyse-tree"
// import { bacthPass } from "../alarm-history/methods"
import MergeDetailModel, { IOperateProps as IDtP, IPerateRef as IDtR } from "./components/device-list-detail"
import { AL_MERGE_SCH_FORM_BTNS, ALARM_MERGE_COLUMNS, ALARM_MERGE_SCH_FORM_ITEMS } from "./configs"
import { doExportAlMg, getAlarmMergePageData } from "./methods"
import { IAlarmMergeSchForm, IAlarmMgData, IChooseForm, TAlarmmergeTbActInfo } from "./types"
import { bacthPass } from "@/utils/device-funs"

export default function AlarmMerge() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig] = useState<TFormItemConfig<any>>()
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const deviceDataRef = useRef([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetalModalOpen, setIsDetalModalOpen] = useState(false)
  const [curChooseVal, setCurChooseVal] = useState<IChooseForm>({ groupType: 1 })
  const modeRef = useRef(null)

  // 判断是否点击了列表中的确认操作
  const [isOperateCell, setOperateState] = useState(false)
  // 设置选中的一条数据
  const [operateOneAlarmData, setOperateOneAlarmData] = useState([])
  const rowSelectProps = {
    needInfo: true,
    getCheckboxProps: (record: IAlarmMgData) => ({
      disabled: record.confirmFlag || record.alarmLevelId === "3" || record.alarmLevelId === "15", // Column configuration not to be checked
      name: record.alarmDesc,
    }),
  }
  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)

  const { dataSource, loading, pagination, onSearch } = usePageSearch<IAlarmMergeSchForm, IAlarmMgData>(
    { serveFun: getAlarmMergePageData },
    {
      formRef,
      otherParams: { deviceIdList: deviceDataRef.current },
      needFirstSch: false,
    },
  )

  const onSelectRef = useRef<IAlarmAnalyseTreeProps["onSelect"]>((devices) => {
    deviceDataRef.current = devices.filter((item) => isNumber(item))
  })

  const btnClkRef = async (type: "ok" | "close", data: string) => {
    // 执行
    if (type === "ok") {
      const res = await bacthPass(isOperateCell ? operateOneAlarmData : selectedRows, data)
      if (!res) return
      setIsModalOpen(false)
      setSelectedRowKeys([])
      setSelectedRows([])
      return onSearch()
    }
    if (type === "close") return setIsModalOpen(false)
  }
  const searchTable = useRef(() => {
    onSearch()
    const formData = formRef.current?.getFormValues()

    const { endTime, startTime } = getStartAndEndTime<number>(formData?.dateRange, "", null, true)
    // console.log(sdf, "formData")
    setCurChooseVal({ groupType: formData?.groupType, formEndTime: endTime, formStTime: startTime })
  })

  async function onFormAction(type: "export" | "batchCmomfirm") {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      doExportAlMg({ ...formData, deviceIdList: deviceDataRef.current })
    } else {
      if (!selectedRows.length) {
        showMsg("请至少选择一条！")
        return // messageApi.open({ type: "warning", content: "请至少选择一条！" })
      }
      setIsModalOpen(true)
    }
  }
  const onTbAction = useRef((record: IAlarmMgData, { key }: TAlarmmergeTbActInfo) => {
    if (key === "ensure") {
      setIsModalOpen(true)
      setOperateState(true)
      setOperateOneAlarmData([record])
    }
    if (key === "detail") {
      // toMonitorPage(record, navigate)
      setIsDetalModalOpen(true)
      setOperateOneAlarmData([record])
    }
  })
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ dateRange: [vDate().subtract(7, "h"), vDate()] })
    setTimeout(() => {
      // formInst?.submit()
    }, 400)
  }, [])
  return (
    <div className="l-full page-wrap alarm-merge">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={ALARM_MERGE_SCH_FORM_ITEMS}
        formOptions={{
          onValuesChange: () => setDeviceType(formRef?.current?.getFormValues()?.deviceType),
        }}
        buttons={AL_MERGE_SCH_FORM_BTNS}
        onSearch={searchTable.current}
        onAction={onFormAction}
      />
      <div className="alarm-merge-content">
        <div className="al-merge-content-left">
          <AlarmAnalyseTree deviceType={deviceType} onSelect={onSelectRef.current} />
        </div>
        <div className="al-merge-content-right">
          <CustomTable
            rowKey="index"
            limitHeight
            rowSelection={rowSelection}
            initHeight={"100%"}
            loading={loading}
            columns={ALARM_MERGE_COLUMNS({ onClick: onTbAction.current })}
            dataSource={dataSource}
            pagination={{ ...pagination }}
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
      <CustomModal<IDtP, IDtR>
        ref={modeRef}
        width="70%"
        title="详情"
        destroyOnClose
        open={isDetalModalOpen}
        footer={null}
        onCancel={() => setIsDetalModalOpen(false)}
        Component={MergeDetailModel}
        componentProps={{ data: operateOneAlarmData, chooseVal: curChooseVal }}
      />
    </div>
  )
}
