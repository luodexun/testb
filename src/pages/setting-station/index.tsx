/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 14:57:58
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-28 16:37:22
 * @Description:
 */
import { useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import CustomTable from "@/components/custom-table"
import usePageSearch from "@/hooks/use-page-search"
import usePagination from "@/hooks/use-pagination"
import { AtomStation } from "@/store/atom-station"

import EditableCell from "./components/edit-input"
import { ST_STATION_FORM_ITEMS, ST_STATION_SCH_FORM_BTNS, ST_STATION_SYS_COLUMNS } from "./configs"
import { changeRefleshFlag, getSettingStIdexSchData, saveStnIdxData } from "./methods"
import { IStationIdxListParam, IStationIndexInfo, TStationIdxSchFormField } from "./types"

export default function SettingStation() {
  const formRef = useRef<IFormInst | null>(null)
  //搜索组件数据集合
  const [formList] = useState<TFormItemConfig<TStationIdxSchFormField>>({})
  const [dataSourceList, setDataSourceList] = useState<Array<IStationIndexInfo>>([])
  const isEditState = useRef(false)
  const isFirst = useRef(true)
  const [column, setColumn] = useState(ST_STATION_SYS_COLUMNS)

  const setStationValue = useSetAtom(AtomStation)

  const [btnCombination, setBtnCombination] = useState(ST_STATION_SCH_FORM_BTNS)
  const [, setTotal, pagination] = usePagination({ pageSizeOptions: [10, 20, 50, 100, 500] })
  const { dataSource, loading, onSearch } = usePageSearch<IStationIdxListParam, IStationIndexInfo>(
    { serveFun: getSettingStIdexSchData },
    { formRef, needFirstSch: false },
  )
  const defaultTextColumn = [{ dataIndex: "priority", title: "顺序", render: (text, record) => record.tags?.priority }]

  const setDataSource = ({ record, value }) => {
    const newData = [...dataSourceList]
    const index = newData.findIndex((item) => record.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      tags: {
        ...(item?.tags || {}),
        priority: value,
      },
      edit: true,
    })
    setDataSourceList(newData)
  }

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      setColumn((prev) => prev.concat(defaultTextColumn))
      const formInst = formRef.current?.getInst()
      formInst?.submit()
    }
  }, [])

  useEffect(() => {
    setDataSourceList(dataSource)
    setTotal(dataSource?.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource])
  useEffect(() => {
    if (isEditState.current) {
      setColumn(
        ST_STATION_SYS_COLUMNS.concat([
          {
            dataIndex: "priority",
            title: "顺序",
            render: (text, record) => (
              <EditableCell value={record.tags?.priority} record={record} setDataSource={setDataSource} />
            ),
          },
        ]),
      )
    }
  }, [dataSourceList])

  async function onFormAction(type: string) {
    if (type === "save") {
      isEditState.current = !isEditState.current
      const groud = JSON.parse(JSON.stringify(ST_STATION_SCH_FORM_BTNS))
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
                dataIndex: "priority",
                title: "顺序",
                render: (text, record) => (
                  <EditableCell value={record.tags?.priority} record={record} setDataSource={setDataSource} />
                ),
              },
            ]),
          )
        : setColumn(ST_STATION_SYS_COLUMNS.concat(defaultTextColumn))
      !isEditState.current
        ? saveStnIdxData(dataSourceList).then((res) => {
            setStationValue(true)
            onSearch()
          })
        : ""
    }
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
        onAction={onFormAction}
      />
      <CustomTable rowKey="id" limitHeight columns={column} dataSource={dataSourceList} pagination={pagination} />
    </div>
  )
}
