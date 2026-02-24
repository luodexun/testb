import "./device-list-detail.less"

import { isNumber } from "ahooks/es/utils"
import { Button, Space } from "antd"
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"

import { IOperateProps as AlP, IPerateRef as AlR } from "@/components/alarm-confirm-model"
import AlarmConfirmModel from "@/components/alarm-confirm-model"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import { day4Y2S } from "@/configs/time-constant"
import usePageSearch from "@/hooks/use-page-search"
import useTableSelection from "@/hooks/use-table-selection"
// import { bacthPass } from "@/pages/alarm-history/methods"
import { showMsg, vDate } from "@/utils/util-funs"
// import { doExportAlMgDetail, queryExpandMsg } from "../methods/detail"
import { bacthPass } from "@/utils/device-funs"
import { ALARM_HISTORY_DETAIL_COLUMNS } from "../config"
import { AlarmListData, IChooseForm } from "../config/types"
import { TAlarmHistoryTbActInfo } from "@/pages/alarm-historyV2/types"
import { doExportDtRealtime, getAlarmDtPageData } from "../methods"

export interface IDtPerateRef {
  setConfirmMsg: (step: string) => void
}
export interface IDtOperateProps {
  property: any
  data?: any
  buttonClick?: (type: "ok" | "close", Msg: string) => void
  loading?: boolean
}
const DetailModel = forwardRef<IDtPerateRef, IDtOperateProps>((props, ref) => {
  const { data, property } = props

  const [confirmMsg, setConfirmMsg] = useState("")
  // const formRef = useRef<IFormInst | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modeRef = useRef(null)
  // 判断是否点击了列表中的确认操作
  const isOperateCell = useRef(false)
  // 设置选中的一条数据
  const operateOneAlarmData = useRef([])
  // const [operateOneAlarmData, setOperateOneAlarmData] = useState([])
  const rowSelectProps = {
    needInfo: true,
    getCheckboxProps: (record: AlarmListData) => ({
      disabled: record.confirmFlag || record.alarmLevelId === 3 || record.alarmLevelId === 15, // Column configuration not to be checked
      name: record.alarmDesc,
    }),
  }
  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)

  const { dataSource, loading, pagination, onSearch } = usePageSearch<IChooseForm, AlarmListData>(
    { serveFun: getAlarmDtPageData },
    {
      otherParams: { ...data?.[0] },
      needSchParams: false,
    },
  )

  const onTbAction = (record: AlarmListData, { key }: TAlarmHistoryTbActInfo) => {
    if (key === "ensure") {
      setIsModalOpen(true)
      operateOneAlarmData.current = [record]
      isOperateCell.current = true
    }
  }

  const btnClkRef = async (type: "ok" | "close", data: string) => {
    // 执行
    if (type === "ok") {
      const res = await bacthPass(isOperateCell.current ? operateOneAlarmData.current : selectedRows, data)
      if (!res) return
      setIsModalOpen(false)
      setSelectedRowKeys([])
      setSelectedRows([])
      return onSearch()
    }
    if (type === "close") return setIsModalOpen(false)
  }

  const onFormAction = (type: "export" | "batchCmomfirm") => {
    if (type === "export") {
      doExportDtRealtime(data?.[0])
    } else {
      isOperateCell.current = false
      if (!selectedRows.length) {
        showMsg("请至少选择一条！")
        return
      }
      setIsModalOpen(true)
    }
  }

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    confirmMsg: confirmMsg,
    setConfirmMsg,
  }))
  return (
    <div className="am-detail">
      <CustomTable
        rowKey="index"
        limitHeight
        loading={loading}
        rowSelection={rowSelection}
        columns={ALARM_HISTORY_DETAIL_COLUMNS({ onClick: onTbAction }, property, true)}
        dataSource={dataSource}
        pagination={{ ...pagination, pageSize: dataSource.length, pageSizeOptions: [dataSource.length] }}
      />
      <div className="am-detail-bottom">
        <Space>
          <Button onClick={() => onFormAction("batchCmomfirm")}>批量确认</Button>
          <Button onClick={() => onFormAction("export")}>批量导出</Button>
        </Space>
      </div>
      <CustomModal<AlP, AlR>
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

export default DetailModel
