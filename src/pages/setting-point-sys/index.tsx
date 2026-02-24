/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 14:57:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-09 15:18:27
 * @Description:
 */
import { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import CustomTable from "@/components/custom-table"
import { StorageDeviceSystem } from "@/configs/storage-cfg"
import usePageSearch from "@/hooks/use-page-search"
import { getStorage } from "@/utils/util-funs"
import EditableInputCell from "@/pages/setting-station/components/edit-input"
import EditableCell from "./components/edit-select"
import {
  ST_POINT_SCH_FORM_BTNS,
  ST_STATION_FORM_ITEMS,
  ST_STATION_SYS_COLUMNS,
  ST_STATION_SYS_COLUMNS_SHOW,
} from "./configs"
import {
  changeRefleshFlag,
  getAllBelongSystem,
  getSettingStIdexSchData,
  onSetPointSysSchFormChg,
  savePointSysData,
} from "./methods"
import { IPointSysInfo, IStPiontSysListParam, TStationIdxSchFormField } from "./types"
const options = [
  { value: 1, label: "是" },
  { value: 0, label: "否" },
]
export default function SettingStation() {
  const formRef = useRef<IFormInst | null>(null)
  //搜索组件数据集合
  const [formList, setFormItemConfig] = useState<TFormItemConfig<TStationIdxSchFormField>>({})
  const [dataSourceList, setDataSourceList] = useState([])
  const isEditState = useRef(false)
  const isFirst = useRef(true)
  const [column, setColumn] = useState(ST_STATION_SYS_COLUMNS_SHOW)

  const [btnCombination, setBtnCombination] = useState([...ST_POINT_SCH_FORM_BTNS])
  const [belongList, setBelongList] = useState([])
  const { dataSource, loading, pagination, onSearch } = usePageSearch<IStPiontSysListParam, IPointSysInfo>(
    { serveFun: getSettingStIdexSchData },
    { formRef, needFirstSch: false },
  )
  const defaultTextColumn = [{ dataIndex: "systemName", title: "归属系统" }]
  const setDataSource = async ({ record, value, dataIndex }) => {
    console.log(dataIndex, "dataIndex")

    const newData = [...dataSourceList]
    const index = newData.findIndex((item) => record.id === item.id)
    const item = newData[index]
    const belongSys = await getAllBelongSystem()
    const isSys =
      dataIndex === "systemId"
        ? {
            systemName: belongSys?.find((sys) => sys.value === value)?.label || value,
            systemId: value,
          }
        : {
            tags: {
              ...(item?.tags || {}),
              [dataIndex]: value,
            },
          }
    newData.splice(index, 1, {
      ...item,
      ...isSys,
      edit: true,
    })
    setDataSourceList(newData)
  }

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      setColumn((prev) => prev.concat(defaultTextColumn))
      const getAllBelongSystem = getStorage(StorageDeviceSystem)?.map((i) => {
        return {
          value: i.id,
          label: i.name,
        }
      })
      setFormItemConfig((prevState) => ({ ...prevState, systemId: { options: getAllBelongSystem || [] } }))
      const formInst = formRef.current?.getInst()
      formInst?.submit()
      allInitPromise()
    }
  }, [])

  useEffect(() => {
    setDataSourceList(dataSource)
  }, [dataSource])

  const allInitPromise = async () => {
    const res = await getAllBelongSystem()
    setBelongList(res)
    // const deviceModelList = await getDeciveMode()
    // setFormItemConfig((prevState) => ({ ...prevState, modelId: { options: deviceModelList || [] } }))
  }

  useEffect(() => {
    if (isEditState.current) {
      setColumn(
        ST_STATION_SYS_COLUMNS.concat([
          {
            dataIndex: "systemId",
            title: "归属系统",
            render: (text, record) => (
              <EditableCell
                value={text}
                record={record}
                valkey="systemId"
                setDataSource={setDataSource}
                option={belongList}
              />
            ),
          },
          {
            dataIndex: "display",
            title: "展示",
            render: (text, record) => (
              <EditableCell
                value={text}
                record={record}
                valkey="display"
                setDataSource={setDataSource}
                option={options}
              />
            ),
          },
          {
            dataIndex: "priority",
            title: "顺序",
            render: (text, record) => (
              <EditableInputCell value={text} record={record} valkey="priority" setDataSource={setDataSource} />
            ),
          },
        ]),
      )
    }
  }, [dataSourceList])

  async function onFormAction(type: string) {
    if (type === "save") {
      isEditState.current = !isEditState.current
      const groud = JSON.parse(JSON.stringify(ST_POINT_SCH_FORM_BTNS))
      groud.forEach((i) => {
        if (i.name === "save") {
          i.label = isEditState.current ? "保存" : "编辑"
        }
      })
      setBtnCombination(groud)
      isEditState.current
        ? setColumn(
            ST_STATION_SYS_COLUMNS.concat([
              {
                dataIndex: "systemId",
                title: "归属系统",
                render: (text, record) => (
                  <EditableCell
                    value={text}
                    record={record}
                    valkey="systemId"
                    setDataSource={setDataSource}
                    option={belongList}
                  />
                ),
              },
              {
                dataIndex: "display",
                title: "展示",
                render: (text, record) => (
                  <EditableCell
                    value={text}
                    record={record}
                    valkey="display"
                    setDataSource={setDataSource}
                    option={options}
                  />
                ),
              },
              {
                dataIndex: "priority",
                title: "顺序",
                render: (text, record) => (
                  <EditableInputCell value={text} valkey="priority" record={record} setDataSource={setDataSource} />
                ),
              },
            ]),
          )
        : setColumn(ST_STATION_SYS_COLUMNS_SHOW)
      !isEditState.current
        ? savePointSysData(dataSourceList).then((res) => {
            if (!res) return
            onSearch()
          })
        : ""
    }
  }

  const onSchValueChgRef = async (changedValue) => {
    const chgOptions = await onSetPointSysSchFormChg(changedValue, formRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  }

  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formList}
        itemOptions={ST_STATION_FORM_ITEMS}
        buttons={btnCombination}
        onSearch={() => {
          changeRefleshFlag(true)
          onSearch()
        }}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        loading={loading}
        limitHeight
        columns={column}
        dataSource={dataSourceList}
        pagination={pagination}
      />
    </div>
  )
}
