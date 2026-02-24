/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-05 15:24:55
 *@Description: 报表管理-电计量报表
 */
import "./index.less"
import usePageSearch from "@hooks/use-page-search.ts"
import useTableSelection from "@hooks/use-table-selection.ts"
import { Button, Space } from "antd"
import { ColumnsType } from "antd/es/table"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types.ts"
import CustomModal from "@/components/custom-modal"
import RemoveContent from "@/components/custom-modal/components/remove-content"
import CustomTable from "@/components/custom-table"
import { IOperateInfo } from "@/components/device-control/types.ts"
import { day4Y } from "@/configs/time-constant"
import { vDate } from "@/utils/util-funs"

import AddPlan from "./components/addPlan"
import { ACTIONS_TYPE, CONTROL_LOG_COLUMNS, RP_POWER_SCH_FORM_BTNS, RP_POWER_SCH_FORM_ITEMS } from "./configs"
import { getNewData, getReportPowerSchData, handleDelete, handleOption } from "./methods"
import { IOperateStepProps, IRpPowerData, IRpPowerSchForm } from "./types"
import PlanCorrectDrawer from "./components/station-draw"

export default function PlanQuantity() {
  const formRef = useRef<IFormInst | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showDrawn, setShowDrawn] = useState(false)

  //是否删除
  const [isRemove, setRemove] = useState<boolean>(false)

  //批量删除
  const [isBatchRemove, seBatchRemove] = useState<boolean>(false)
  //弹窗类型
  const [type, setType] = useState<string>("")

  const [data, setData] = useState([])

  const [modalData, setModal] = useState({
    title: "新增",
    width: "20%",
    open: false,
    component: null,
  })
  const [operateInfo, setInfo] = useState<IRpPowerData>()
  const TABLE_ACTIONS_COLUMS: ColumnsType<any> = [
    {
      dataIndex: "actions",
      title: "操作",
      align: "center",
      render: (_, data) => {
        return (
          <Space size="middle">
            <Button type="primary" onClick={() => onTableAction("edit", data)}>
              编辑
            </Button>
            <Button type="primary" onClick={() => onTableAction("delete", data)}>
              删除
            </Button>
            <Button type="primary" onClick={() => onTableAction("correct", data)}>
              修正
            </Button>
          </Space>
        )
      },
    },
  ]

  const [colums] = useState([...CONTROL_LOG_COLUMNS, ...TABLE_ACTIONS_COLUMS])

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } = useTableSelection()

  // 执行查询的钩子
  const { dataSource, loading, onSearch } = usePageSearch<IRpPowerSchForm, IRpPowerData>(
    { serveFun: getReportPowerSchData },
    { formRef, needFirstSch: false },
  )

  async function onFormAction(type: keyof typeof ACTIONS_TYPE) {
    if (type != "add" && !selectedRowKeys?.length) return
    if (type === "delete" || type === "batchRemove") {
      seBatchRemove(true)
    }
    setModal((prevModel) => {
      const updatedModel = { ...prevModel }
      updatedModel.open = true
      updatedModel.width = type === "add" ? "45%" : "20%"
      updatedModel.title = ACTIONS_TYPE[type]
      updatedModel.component = type === "add" ? AddPlan : RemoveContent
      return updatedModel
    })
  }

  async function onTableAction(type: string, data) {
    console.log(data, "xiuz")

    setInfo(data)
    if (type === "correct") {
      setShowDrawn(true)
      return
    }
    setModal((prevModel) => {
      const updatedModel = { ...prevModel }
      updatedModel.open = true
      updatedModel.width = type === "edit" ? "45%" : "20%"
      updatedModel.title = ACTIONS_TYPE[type]
      updatedModel.component = type === "edit" ? AddPlan : RemoveContent
      return updatedModel
    })
  }

  const btnClkRef = useRef(
    async (type: "ok" | "close" | "delete_ok", form: IRpPowerSchForm, tableData: IRpPowerData[]) => {
      setType(type)
      if (type === "close") return setModal((prevModel) => ({ ...prevModel, open: false }))
      if (type === "ok") {
        const { stationId, year } = form
        if (!stationId || !year) return
        const res = await handleOption(form, tableData)
        if (!res) return
        onSearch()
        setModal({ ...modalData, open: false })
        setSelectedRowKeys([])
      } else if (type === "delete_ok") {
        setRemove(true)
      }
    },
  )

  const onCencel = () => {
    setRemove(false)
    seBatchRemove(false)
    setModal({ ...modalData, open: false })
  }

  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({
      year: vDate("", day4Y),
    })
    formInst?.submit()
  }, [])

  useEffect(() => {
    const tableData = getNewData(dataSource)
    setData(tableData)
  }, [dataSource])

  useEffect(() => {
    if (!isRemove) return
    const fetchData = async () => {
      const rpPowerData: IRpPowerData = operateInfo as unknown as IRpPowerData
      const params = isBatchRemove ? (selectedRowKeys as number[]) : rpPowerData
      const res = await handleDelete(params, data)
      if (!res) return
      onSearch()
      setModal({ ...modalData, open: false })
    }
    setRemove(false)
    seBatchRemove(false)

    fetchData().then((r) => r)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRemove, isBatchRemove, operateInfo, type])

  return (
    <div className="page-wrap plan-quantity" ref={containerRef}>
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptions={RP_POWER_SCH_FORM_ITEMS}
        buttons={RP_POWER_SCH_FORM_BTNS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        limitHeight
        columns={colums}
        dataSource={data}
        rowSelection={rowSelection}
        pagination={false}
      />
      <CustomModal<IOperateStepProps>
        width={modalData.width}
        title={modalData.title}
        destroyOnClose
        open={modalData.open}
        footer={null}
        onCancel={onCencel}
        Component={modalData.component}
        componentProps={{ loading, data: operateInfo, buttonClick: btnClkRef.current, type: modalData.title }}
      />
      <PlanCorrectDrawer
        containerDom={containerRef.current}
        showDrawn={showDrawn}
        clickStation={operateInfo}
        setShowDrawn={setShowDrawn}
      />
    </div>
  )
}
