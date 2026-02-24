/*
 * @Author: chenmeifeng
 * @Date: 2023-10-17 17:01:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-25 11:37:38
 * @Description:
 */
import usePageSearch from "@hooks/use-page-search.ts"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types.ts"
// import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"

import { DEVICE_ATT_COLUMNS, ST_MANAGE_FORM_ITEMS, ST_MANAGE_SCH_FORM_BTNS } from "./configs/index"
import { getStStateModelSchData } from "./methods/index"
// import { IModelListData } from "./types/index"
export default function DeviceManage() {
  const formRef = useRef<IFormInst | null>(null)
  //搜索组件数据集合
  const [formList, setFormList] = useState({})

  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.submit()
  }, [])
  // const initData = () => {
  //   const res = await doBaseServer<AlarmListData[]>("confirmAlarmmsg", params)
  // }

  // 执行查询的钩子
  //  usePageSearch<IRpPowerSchParams, IRpPowerData>
  const { dataSource, loading, pagination, onSearch } = usePageSearch(
    { serveFun: getStStateModelSchData },
    { formRef, needFirstSch: false },
  )

  const onSchValueChgRef = async (changedValue) => {}

  async function onFormAction(type: string) {
    // if (type === "export") {
    //   // 导出
    //   const formData = formRef.current?.getFormValues()
    //   doExportReportPower(pageInfo, formData)
    // } else if (type === "batchCmomfirm") {
    //   if (!selectedRows.length) {
    //     messageApi.open({
    //       type: "warning",
    //       content: "请至少选择一条！",
    //     })
    //     return
    //   }
    //   setIsModalOpen(true)
    // }
  }

  return (
    <div className="page-wrap">
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
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        limitHeight
        columns={DEVICE_ATT_COLUMNS}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
