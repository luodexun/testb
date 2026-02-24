/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-26 10:47:18
 *@Description: 报表管理-电计量报表
 */

import { CHART_OR_TABLE_BTNS, TChartOrTable } from "@configs/table-constant.tsx"
import usePagination from "@hooks/use-pagination.ts"
import analyScatterOptions from "@pages/analysis-scatter/components/analy-scatter-options.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import { AtomStation } from "@store/atom-station.ts"
import { isEmpty, reduceList2KeyValueMap, vDate } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"
import React, { useEffect, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import TypeButtonGroup from "@/components/type-button-group"

import AnalyScatterChart from "./components/analy-scatter-chart.tsx"
import { ANLY_SCTTR_COLUMNS, ANLY_SCTTR_FORM_BTNS, ANLY_SCTTR_FORM_ITEMS } from "./configs"
import { anlyScttrSch4Chart, anlyScttrSch4Table, exportAnalysisScatter, onAnlyScttrSchFormChange } from "./methods"
import {
  IAnalyFormItemCfgMap,
  IAnlyScatterSchForm,
  IAnlyScttrSchItemName,
  TAnlyScatterData,
  TAnlyScttrChartData,
} from "./types"

export default function AnalysisScatter() {
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<IAnlyScttrSchItemName>>()
  const [colums, setColums] = useState(ANLY_SCTTR_COLUMNS)
  const [dataSource, setDataSource] = useState<TAnlyScatterData[]>([])
  const [chartData, setChartData] = useState<TAnlyScttrChartData>()
  const [loading, setLoading] = useState(false)
  const [displayType, setDisplayType] = useState<TChartOrTable>("chart")
  const { deviceTypeOfStationMap } = useAtomValue(AtomConfigMap).map
  const { stationMap } = useAtomValue(AtomStation)
  const formRef = useRef<IFormInst<IAnlyScatterSchForm> | null>(null)
  const [pageInfo, setTotal, pagination, setPageInfo] = usePagination()
  const formItemCfgMapRef = useRef<IAnalyFormItemCfgMap>({ dvsOptionsMap: {}, deviceTypeOfStationMap, stationMap })

  formItemCfgMapRef.current = useMemo(() => {
    const dvsOptions = formItemConfig?.deviceIds?.options
    const actualDevOptions = dvsOptions?.reduce((prev, cur) => {
      return prev.concat(cur.children)
    }, [])
    const dvsOptionsMap = reduceList2KeyValueMap(actualDevOptions, { vField: "value" }, (d) => d)
    return { dvsOptionsMap, deviceTypeOfStationMap, stationMap, formItemConfig }
  }, [deviceTypeOfStationMap, formItemConfig, stationMap])

  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    const endDate = vDate()
    const startDate = endDate.clone().subtract(2, "h")
    formInst?.setFieldsValue({ dateRange: [startDate, endDate], displayType: "chart" })
    const initTreeData = { treeData: [] }
    setFormItemConfig((prevState) => ({ ...prevState, devicePointX: initTreeData, devicePointY: initTreeData }))
  }, [])

  const isChart = useMemo(() => displayType === "chart", [displayType])

  const pageInfoRef = useRef(pageInfo)
  pageInfoRef.current = pageInfo
  // 执行查询
  const onSearchRef = useRef(async () => {
    const formValue = formRef.current?.getFormValues()
    setLoading(true)
    if (formValue.displayType === "table") {
      const { records, total, columns } = (await anlyScttrSch4Table(formValue, pageInfoRef.current)) || {}
      setDataSource(records || [])
      setTotal(total || 0)
      if (columns?.length) setColums(columns)
      setLoading(false)
      return
    }
    await anlyScttrSch4Chart(formValue).then(setChartData)
    setLoading(false)
  })

  useEffect(() => {
    if (isChart) return
    onSearchRef.current()
  }, [isChart])

  const onFormSchRef = useRef((formValue: IAnlyScatterSchForm) => {
    onSearchRef.current()
  })

  const onSchValueChgRef = useRef(async (changedValue: IAnlyScatterSchForm) => {
    setPageInfo((prevState) => ({ ...prevState, current: 1 }))
    if (isEmpty(changedValue)) return
    const formItemCfgData = await onAnlyScttrSchFormChange(changedValue, formRef, formItemCfgMapRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...(formItemCfgData || {}) }))
  })

  async function onFormAction() {
    // 导出
    const formData = formRef.current?.getFormValues()
    exportAnalysisScatter(formData)
  }

  const displayChgRef = useRef((checked: TChartOrTable) => {
    setDisplayType((prevState) => {
      if (prevState === checked) return prevState
      formRef.current?.getInst()?.setFieldValue("displayType", checked)
      if (checked === "chart")
        onSearchRef.current() // 直接查询
      else onFormSchRef.current({ displayType: checked }) // 通过分页器触发查询
      return checked
    })
  })

  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={ANLY_SCTTR_FORM_ITEMS}
        buttons={ANLY_SCTTR_FORM_BTNS}
        formOptions={{ onValuesChange: onSchValueChgRef.current }}
        onSearch={onFormSchRef.current}
        onAction={onFormAction}
      />
      <TypeButtonGroup buttons={CHART_OR_TABLE_BTNS} onChange={displayChgRef.current} btnProps={{ size: "small" }} />
      {isChart ? (
        <AnalyScatterChart loading={loading} data={chartData} options={analyScatterOptions} />
      ) : (
        <CustomTable
          rowKey="id"
          limitHeight
          loading={loading}
          columns={colums}
          dataSource={dataSource}
          pagination={pagination}
        />
      )}
    </div>
  )
}
