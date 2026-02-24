/*
 * @Author: chenmeifeng
 * @Date: 2023-10-17 17:01:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-30 14:51:42
 * @Description:
 */

import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import { fork } from "child_process"
import { useAtomValue } from "jotai"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
// import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import { AtomStation } from "@/store/atom-station"
import {
  DEVICE_ATT_COLUMNS,
  DEVICE_DEFAULT_TEXT_COLUMN,
  ST_MANAGE_FORM_ITEMS,
  ST_MANAGE_SCH_FORM_BTNS,
  getDeviceColumns,
} from "./configs/index"
import { changeRefleshFlag, getSettingMngSchData, onSettingMngSchFormChg, saveStnIdxData } from "./methods/index"
import { DevideListParam, IDeviceListData, TDeviceSchFormField } from "./types/index"
export default function DeviceManage() {
  const formRef = useRef<IFormInst | null>(null)
  //搜索组件数据集合
  const [formList, setFormItemConfig] = useState<TFormItemConfig<TDeviceSchFormField>>({})
  const { stationOptions4Id } = useAtomValue(AtomStation)
  const isEditState = useRef(false)
  const isFirst = useRef(true)
  const deviceTypeRef = useRef("WT")
  const [column, setColumn] = useState(DEVICE_ATT_COLUMNS)
  const [dataSourceList, setDataSourceList] = useState([])

  const [btnCombination, setBtnCombination] = useState([...ST_MANAGE_SCH_FORM_BTNS])
  // 执行查询的钩子
  //  usePageSearch<IRpPowerSchParams, IRpPowerData>
  const { dataSource, loading, pagination, onSearch } = usePageSearch<DevideListParam, IDeviceListData>(
    { serveFun: getSettingMngSchData },
    { formRef, needFirstSch: false },
  )

  const setDataSource = ({ record, value, dataIndex }) => {
    const newData = [...dataSourceList]
    const index = newData.findIndex((item) => record.deviceId === item.deviceId)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      tags: {
        ...(item?.deviceTags || {}),
        ...(item?.tags || {}),
        [dataIndex]: value,
      },
      edit: true,
    })
    setDataSourceList(newData)
  }

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      const formInst = formRef.current?.getInst()
      const deviceType = formRef.current?.getFormValues()?.deviceType
      setColumn(DEVICE_ATT_COLUMNS.concat(DEVICE_DEFAULT_TEXT_COLUMN(deviceType)))
      formInst?.submit()
    }
  }, [])

  useEffect(() => {
    setDataSourceList(dataSource)
  }, [dataSource])

  useEffect(() => {
    if (isEditState.current) {
      setColumn(getDeviceColumns(deviceTypeRef.current, setDataSource))
    }
  }, [dataSourceList])

  useEffect(() => {
    // setFormItemConfig((prevState) => ({ ...prevState, stationId: { options: stationOptions4Id } }))
    const formInst = formRef.current?.getInst()
    formInst?.submit()
  }, [stationOptions4Id])

  async function onFormAction(type: string) {
    if (type === "save") {
      isEditState.current = !isEditState.current
      const groud = JSON.parse(JSON.stringify(ST_MANAGE_SCH_FORM_BTNS))
      groud.forEach((i) => {
        if (i.name === "save") {
          i.label = isEditState.current ? "保存" : "编辑"
        }
      })
      setBtnCombination(groud)
      if (!isEditState.current) {
        await saveStnIdxData(dataSourceList)
          .then((res) => {
            if (!res) return
            onSearch()
          })
          .finally(() => {
            setColumn(DEVICE_ATT_COLUMNS.concat(DEVICE_DEFAULT_TEXT_COLUMN(deviceTypeRef.current)))
          })
      } else {
        setColumn(getDeviceColumns(deviceTypeRef.current, setDataSource))
      }
    }
  }

  const onSchValueChgRef = async (changedValue) => {
    const chgOptions = await onSettingMngSchFormChg(changedValue, formRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  }
  const searchTable = () => {
    changeRefleshFlag(true)
    const deviceType = formRef.current?.getFormValues()?.deviceType
    deviceTypeRef.current = deviceType
    // console.log(deviceType, "考虑时间地方了", formRef.current?.getFormValues())

    setColumn(DEVICE_ATT_COLUMNS.concat(DEVICE_DEFAULT_TEXT_COLUMN(deviceType)))
    onSearch()
  }
  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formList}
        itemOptions={ST_MANAGE_FORM_ITEMS}
        buttons={btnCombination}
        formOptions={{
          // validateTrigger: ["onSubmit"],
          onValuesChange: onSchValueChgRef,
        }}
        onSearch={searchTable}
        onAction={onFormAction}
      />
      <CustomTable rowKey="deviceId" limitHeight columns={column} dataSource={dataSourceList} pagination={pagination} />
    </div>
  )
}
