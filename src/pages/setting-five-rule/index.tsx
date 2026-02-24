/*
 * @Author: chenmeifeng
 * @Date: 2024-12-05 17:03:20
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-03 10:40:12
 * @Description: 规则配置-五防规则
 */
import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types.ts"
import CustomModal from "@/components/custom-modal"
import RemoveContent from "@/components/custom-modal/components/remove-content"
import CustomTable from "@/components/custom-table"
import useTableSelection from "@/hooks/use-table-selection"
import { showMsg } from "@/utils/util-funs"

import AddModal, { IFiveRulePerateRef, ISvgFiveRuleMdlProps } from "./components/edit"
import { DEVICE_ATT_COLUMNS, PJCT_SEARCH_FORM_ITEMS, ST_MANAGE_SCH_FORM_BTNS } from "./configs/index"
import { exportData, exportTemplate, getPjctSchData, importFile } from "./methods/index"
import { IRuleInfo, IRuleInfoParam, TUserTbActInfo } from "./types/index"
import FileImport from "@/components/custom-upload/upload"
import { delFiveRule } from "./methods/edit"

const rowSelectProps = { needInfo: true }

export default function AlarmFiveRule() {
  const formRef = useRef<IFormInst | null>(null)
  const modeRef = useRef<any>(null)
  const [formList, setFormItemConfig] = useState({})
  const [isModalOpen, setIsModalOpen] = useState("")
  const [importModal, setImportModal] = useState(false)
  const [isEditOrAdd, setIsEditOrAdd] = useState("add")
  // 设置选中的一条数据
  const [selectRowInfo, setSelectRowInfo] = useState<IRuleInfo | null>()
  const [cpnyList, setCpnyList] = useState([])

  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRowKeys, setSelectedRows } = useTableSelection(rowSelectProps)
  const initData = async () => {
    const formInst = formRef.current?.getInst?.()
    formInst?.submit()
  }

  useEffect(() => {
    initData()
  }, [])

  // 执行查询的钩子
  const { dataSource, loading, onSearch, pagination } = usePageSearch<IRuleInfoParam, IRuleInfo>(
    { serveFun: getPjctSchData },
    { formRef, needFirstSch: false },
  )

  async function onFormAction(type) {
    if (type === "add") {
      setIsModalOpen("add")
      setIsEditOrAdd("add")
    } else if (type === "batchDelete") {
      if (!selectedRowKeys.length) {
        return showMsg("请至少选择一条！")
      }
      setIsModalOpen("deleted")
    } else if (type === "template") {
      const res = await exportTemplate()
    } else if (type === "import") {
      setImportModal(true)
      // const res = await
    } else if (type === "export") {
      const formData = formRef.current?.getFormValues()
      exportData(formData)
    }
  }
  const btnClick = useRef(async (type, formData) => {
    if (type === "ok") {
      const res = await importFile(formData)
      if (res) {
        setImportModal(false)
        onSearch()
      }
    } else {
      setImportModal(false)
    }
  })
  const onTbAction = async (record: IRuleInfo, { key, label }: TUserTbActInfo) => {
    setIsModalOpen(key)
    setSelectRowInfo(record)
    if (key === "edit") {
      setIsEditOrAdd(key)
    }
    console.log(record, key, label)
  }

  const closeEditModal = useRef((type?) => {
    if (type === "ok") {
      onSearch()
    }
    setIsModalOpen("")
    setSelectRowInfo(null)
  })

  const delBtnClkRef = async (type: "ok" | "close" | "delete_ok") => {
    // 执行
    if (type === "delete_ok") {
      const res = await delFiveRule(selectRowInfo ? [selectRowInfo.id] : selectedRowKeys)
      if (!res) return
      showMsg(res)
      setSelectRowInfo(null)
      setIsModalOpen("")
      setSelectedRowKeys([])
      setSelectedRows([])
      return onSearch()
    }
    setSelectRowInfo(null)
    if (type === "close") return setIsModalOpen("")
  }
  const onSchValueChgRef = useRef((changedValue) => {})
  return (
    <div className="page-wrap setting-five-rule">
      <CustomForm
        ref={formRef}
        loading={loading}
        buttons={ST_MANAGE_SCH_FORM_BTNS}
        itemOptionConfig={formList}
        itemOptions={PJCT_SEARCH_FORM_ITEMS}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        rowSelection={rowSelection}
        limitHeight
        columns={DEVICE_ATT_COLUMNS({ onClick: onTbAction })}
        dataSource={dataSource}
        pagination={pagination}
      />
      <CustomModal<ISvgFiveRuleMdlProps, IFiveRulePerateRef>
        width="50%"
        ref={modeRef}
        title={isEditOrAdd === "add" ? "新增" : "修改"}
        destroyOnClose
        open={isModalOpen === "add" || isModalOpen === "edit"}
        footer={null}
        onCancel={closeEditModal.current}
        Component={AddModal}
        componentProps={{
          pointInfo: selectRowInfo,
          editType: isEditOrAdd,
          controlType: selectRowInfo?.controlType,
          changeClk: closeEditModal.current,
        }}
      />
      <CustomModal
        title="删除"
        destroyOnClose
        open={isModalOpen === "deleted"}
        footer={null}
        onCancel={() => setIsModalOpen("")}
        Component={RemoveContent}
        componentProps={{ buttonClick: delBtnClkRef, selectRowInfo }}
      />
      <CustomModal
        width="20%"
        title="导入"
        destroyOnClose
        open={importModal}
        footer={null}
        onCancel={() => setImportModal(false)}
        Component={FileImport}
        componentProps={{ btnClick: btnClick.current }}
      />
    </div>
  )
}
