/*
 * @Author: chenmeifeng
 * @Date: 2023-10-17 17:01:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-23 10:57:35
 * @Description:
 */

import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import { useAtomValue } from "jotai"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types.ts"
import CustomModal from "@/components/custom-modal"
import RemoveContent from "@/components/custom-modal/components/remove-content"
import CustomTable from "@/components/custom-table"
import useTableSelection from "@/hooks/use-table-selection"
import { AtomStation } from "@/store/atom-station"
import { showMsg } from "@/utils/util-funs"

import PwLnModel, { IPwrLineMdlProps } from "./components/power-line-model"
import { DEVICE_ATT_COLUMNS, ST_MANAGE_FORM_ITEMS, ST_MANAGE_SCH_FORM_BTNS } from "./configs/index"
import {
  delWtPowerCurveById,
  geStPwLineSchData,
  getCurDeviceModel,
  insertWtPowerCurve,
  onSetPWlIineSchFormChg,
} from "./methods/index"
import { IPowerData, ISearchFr, TModelFrAndTbInfo, TPowerTbActInfo, TSrhFormActType } from "./types/index"
import { TDeviceType } from "@/types/i-config"

const rowSelectProps = {
  needInfo: true,
}
export default function DeviceManage() {
  const formRef = useRef<IFormInst | null>(null)
  //搜索组件数据集合
  const [formList, setFormItemConfig] = useState({})

  const [isModalOpen, setIsModalOpen] = useState("")
  const [isEditOrAdd, setIsEditOrAdd] = useState("add")
  // 设置选中的一条数据
  const [selectRowInfo, setSelectRowInfo] = useState<IPowerData>()

  const { stationOptions4Id } = useAtomValue(AtomStation)
  const [deviceType, setDeviceType] = useState<TDeviceType>()
  const [searchDvsTyps, setSearchDvsTyps] = useState<TDeviceType>("WT") // 点击查询时候的设备类型

  useEffect(() => {
    ;(async function () {
      const result = await getCurDeviceModel()
      setFormItemConfig((prevState) => ({
        ...prevState,
        // stationId: { options: stationOptions4Id },
        modelId: { options: result },
      }))
      const formInst = formRef.current?.getInst()
      formInst?.submit()
    })()
  }, [stationOptions4Id])

  // 选择框
  const { selectedRowKeys, rowSelection, selectedRows, setSelectedRowKeys, setSelectedRows } =
    useTableSelection(rowSelectProps)

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<ISearchFr, IPowerData>(
    { serveFun: geStPwLineSchData },
    { formRef, needFirstSch: false },
  )

  const onSchValueChgRef = async (changedValue: ISearchFr) => {
    if (changedValue.curveId) {
      setDeviceType(changedValue.curveId)
    }
    const chgOptions = await onSetPWlIineSchFormChg(changedValue, formRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  }

  const onTbAction = async (record: IPowerData, { key }: TPowerTbActInfo) => {
    setIsModalOpen(key)
    setSelectRowInfo(record)
    if (key === "edit" || key === "see") {
      setIsEditOrAdd(key)
    }
  }
  async function onFormAction(type: TSrhFormActType) {
    setSelectRowInfo(null)
    if (type === "add") {
      setIsModalOpen(type)
      setIsEditOrAdd("add")
    }
    if (type === "batchDel") {
      // 批量删除
      if (!selectedRowKeys.length) {
        showMsg("请至少选择一条！")
        return
      }
      setIsModalOpen("deleted")
    }
  }

  const btnClkRef = async (type: "ok" | "close", data?: TModelFrAndTbInfo) => {
    // 执行
    if (type === "ok") {
      const res = await insertWtPowerCurve(data, isEditOrAdd)
      if (!res) return
      setIsModalOpen("")
      setSelectRowInfo(null)
      // setSelectedRowKeys([])
      // setSelectedRows([])
      return searchTable()
    }
    setSelectRowInfo(null)
    if (type === "close") return setIsModalOpen("")
  }

  const searchTable = () => {
    onSearch()
    const formInst = formRef.current?.getInst()
    const dvsType = formInst.getFieldValue("curveId")
    setSearchDvsTyps(dvsType)
  }

  const delSPBtnClkRef = async (type: "ok" | "close" | "delete_ok") => {
    // 执行
    if (type === "delete_ok") {
      const dvsType = selectRowInfo?.deviceType || selectedRows?.[0].deviceType
      const res = await delWtPowerCurveById(selectRowInfo ? [selectRowInfo.id] : (selectedRowKeys as number[]), dvsType)
      if (!res) return
      setSelectRowInfo(null)
      setIsModalOpen("")
      setSelectedRowKeys([])
      setSelectedRows([])
      return searchTable()
    }
    setSelectRowInfo(null)
    if (type === "close") return setIsModalOpen("")
  }

  return (
    <div className="page-wrap power-line">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formList}
        itemOptions={ST_MANAGE_FORM_ITEMS}
        buttons={ST_MANAGE_SCH_FORM_BTNS}
        formOptions={{
          // validateTrigger: ["onSubmit"],
          onValuesChange: onSchValueChgRef,
        }}
        onSearch={searchTable}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        limitHeight
        columns={DEVICE_ATT_COLUMNS({ onClick: onTbAction }, searchDvsTyps)}
        dataSource={dataSource}
        pagination={pagination}
      />
      <CustomModal<IPwrLineMdlProps>
        width="60%"
        title={isModalOpen === "edit" ? " 编辑" : "查看"}
        destroyOnClose
        open={isModalOpen === "add" || isModalOpen === "edit" || isModalOpen === "see"}
        footer={null}
        onCancel={() => {
          setIsModalOpen("")
          setSelectRowInfo(null)
        }}
        Component={PwLnModel}
        componentProps={{ buttonClick: btnClkRef, deviceType: deviceType, editType: isEditOrAdd, selectRowInfo }}
      />
      <CustomModal
        title="删除"
        destroyOnClose
        open={isModalOpen === "deleted"}
        footer={null}
        onCancel={() => setIsModalOpen("")}
        Component={RemoveContent}
        componentProps={{ buttonClick: delSPBtnClkRef }}
      />
    </div>
  )
}
