/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-27 13:53:03
 *@Description: 控制日志
 */
import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import { showMsg, vDate } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"
import React, { forwardRef, useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import useTableSelection from "@/hooks/use-table-selection"
import { userInfoAtom } from "@/store/atom-auth"

import { CONTROL_LOG_COLUMNS, CTRL_LOG_SCH_FORM_BTNS, CTRL_LOG_SCH_FORM_ITEMS } from "./configs"
import {
  downSignsDevice,
  exportControlLog,
  getSignLogData,
  getStn2DvsTypeInfoMap,
  onSignLogSchFormChange,
} from "./methods"
import AddModal from "./sign"
import { ISignLogData, ISignLogSchForm, TSignLogSchFmItemName } from "./types"
export interface ISignProps {
  stationId: number
}
export interface ISignRef {}

const rowSelectProps = {
  needInfo: true,
  getCheckboxProps: (record: ISignLogData) => ({
    disabled: !!record.endTime, // Column configuration not to be checked
  }),
}
const SignLog = forwardRef((props: ISignProps, ref: ISignRef) => {
  const { stationId } = props
  const formRef = useRef<IFormInst | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TSignLogSchFmItemName>>({})
  const { deviceTypeOfStationMap, deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const userInfo = useAtomValue(userInfoAtom)
  const dvsTypeInfoOfStnMapRef = useRef<ReturnType<typeof getStn2DvsTypeInfoMap>>({})
  const [currentStationId, setCurrentStationId] = useState(undefined)

  useEffect(() => {
    dvsTypeInfoOfStnMapRef.current = getStn2DvsTypeInfoMap(deviceTypeOfStationMap, deviceTypeMap)
  }, [deviceTypeMap, deviceTypeOfStationMap])

  // 选择框
  const { rowSelection, setSelectedRowKeys, selectedRows, setSelectedRows } = useTableSelection(rowSelectProps)
  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<ISignLogSchForm, ISignLogData>(
    { serveFun: getSignLogData },
    {
      formRef,
      needFirstSch: false,
    },
  )

  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ stationId, dateRange: [vDate().subtract(7, "d"), vDate()] })

    formInst?.submit()
  }, [stationId])

  async function onFormAction(type, help) {
    if (type === "export") {
      // 导出
      const formData = formRef.current?.getFormValues()
      exportControlLog(formData)
      setOpenModal(false)
    } else if (type === "sign") {
      setOpenModal((prev) => !prev)
    } else if (type === "unsign" && help !== "cancel") {
      setOpenModal(false)
      if (!selectedRows?.length) {
        showMsg("请至少选择一条数据")
        return
      }
      const down = await downSignsDevice(selectedRows, userInfo)
      onSearch()
    }
  }

  const deviceTypeMapRef = useRef(deviceTypeMap)
  deviceTypeMapRef.current = deviceTypeMap

  const onSchValueChgRef = async (changedValue: ISignLogSchForm) => {
    if (changedValue.stationId) {
      setCurrentStationId(changedValue.stationId)
    }
    const dvsTypeInfoOfStnMap = dvsTypeInfoOfStnMapRef.current
    const deviceTypeMap = deviceTypeMapRef.current
    const forItemCfgData = await onSignLogSchFormChange(
      changedValue,
      formRef.current,
      dvsTypeInfoOfStnMap,
      deviceTypeMap,
    )
    setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
  }
  const buttonClick = useRef((type, data) => {
    setOpenModal(false)
    if (type === "ok") {
      onSearch()
    }
  })
  return (
    <div className="booster-sign">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={CTRL_LOG_SCH_FORM_ITEMS}
        buttons={CTRL_LOG_SCH_FORM_BTNS}
        formOptions={{ onValuesChange: onSchValueChgRef }}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        rowSelection={rowSelection}
        columns={CONTROL_LOG_COLUMNS}
        dataSource={dataSource}
        limitHeight
        scroll={{ y: 750 }}
        pagination={pagination}
      />
      {openModal ? <AddModal buttonClick={buttonClick.current} stationId={currentStationId || stationId} /> : ""}
    </div>
  )
})

export default SignLog
