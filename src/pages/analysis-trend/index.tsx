/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-26 14:17:42
 *@Description: 报表管理-电计量报表
 */

import { CHART_OR_TABLE_BTNS, TChartOrTable } from "@configs/table-constant.tsx"
import usePagination from "@hooks/use-pagination.ts"
import AnalyScatterChart from "@pages/analysis-scatter/components/analy-scatter-chart.tsx"
import { ANLY_SCTTR_COLUMNS, ANLY_SCTTR_FORM_BTNS } from "@pages/analysis-scatter/configs"
import { IAnalyFormItemCfgMap, TAnlyScatterData } from "@pages/analysis-scatter/types"
import analyTrendOptions, { IAnalyTrendChartData } from "@pages/analysis-trend/components/analy-trend-options.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import { AtomStation } from "@store/atom-station.ts"
import { isEmpty, reduceList2KeyValueMap, vDate } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"
import React, { useEffect, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import TypeButtonGroup from "@/components/type-button-group"
import { ITreeLabelValue } from "@/types/i-antd.ts"

import { ANLY_TREND_FORM_BTNS, ANLY_TREND_SCH_ITEMS } from "./configs"
import { anlyTrendSch4Chart, anlyTrendSch4Table, exportAnlyTrendData, onAnlyTrendSchFormChange } from "./methods"
import { IAnlyTrendSchForm, TRpPowerSchFormItemName } from "./types"
import CustomModal from "@/components/custom-modal"
import AnalysisCttTrend from "./components/contract-point"

export default function AnalysisTrend() {
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()
  const [colums, setColums] = useState(ANLY_SCTTR_COLUMNS)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<TAnlyScatterData[]>([])
  const [chartData, setChartData] = useState<IAnalyTrendChartData>()
  const [displayType, setDisplayType] = useState<TChartOrTable>("chart")
  const modeRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pageInfo, setTotal, pagination, setPageInfo] = usePagination()
  const { deviceTypeOfStationMap } = useAtomValue(AtomConfigMap).map
  const { stationMap } = useAtomValue(AtomStation)
  const formRef = useRef<IFormInst<IAnlyTrendSchForm>>()
  const formItemCfgMapRef = useRef<IAnalyFormItemCfgMap>({ dvsOptionsMap: {}, deviceTypeOfStationMap, stationMap })

  formItemCfgMapRef.current = useMemo(() => {
    const dvsOptions: ITreeLabelValue[] = formItemConfig?.deviceIds?.options
    const actualDevOptions = dvsOptions?.reduce((prev, cur) => prev.concat(cur?.children || []), [])
    const dvsOptionsMap = reduceList2KeyValueMap(actualDevOptions, { vField: "value" }, (d) => d)
    return { dvsOptionsMap, deviceTypeOfStationMap, stationMap, formItemConfig }
  }, [deviceTypeOfStationMap, formItemConfig, stationMap])

  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    const endDate = vDate()
    const startDate = endDate.clone().subtract(2, "h")
    formInst?.setFieldsValue({ dateRange: [startDate, endDate], displayType: "chart" })
    setFormItemConfig((prevState) => ({ ...prevState, devicePoint: { treeData: [] } }))
  }, [])

  const onSchValueChgRef = useRef(async (changedValue: IAnlyTrendSchForm) => {
    setPageInfo((prevState) => ({ ...prevState, current: 1 }))
    if (isEmpty(changedValue)) return
    const formItemCfgData = await onAnlyTrendSchFormChange(changedValue, formRef, formItemCfgMapRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...(formItemCfgData || {}) }))
  })

  const isChart = useMemo(() => displayType === "chart", [displayType])

  const pageInfoRef = useRef(pageInfo)
  pageInfoRef.current = pageInfo

  // 执行查询
  const onSearchRef = useRef(async () => {
    const formValue = formRef.current?.getFormValues()
    setLoading(true)
    if (formValue.displayType === "table") {
      const { records, total, columns } =
        (await anlyTrendSch4Table(formValue, pageInfoRef.current, formItemCfgMapRef.current)) || {}
      setDataSource(records || [])
      setTotal(total || 0)
      if (columns?.length) setColums(columns)
      setLoading(false)
      return
    }
    await anlyTrendSch4Chart(formValue, formItemCfgMapRef.current).then(setChartData)
    setLoading(false)
  })

  useEffect(() => {
    if (isChart) return
    onSearchRef.current()
  }, [isChart])

  const onFormSchRef = useRef((formValue: IAnlyTrendSchForm) => {
    onSearchRef.current()
  })

  const displayChgRef = useRef((checked: TChartOrTable) => {
    setDisplayType((prevState) => {
      if (prevState === checked) return prevState
      const formInst = formRef.current?.getInst()
      formInst?.setFieldValue("displayType", checked)
      if (checked === "chart") {
        onSearchRef.current() // 直接查询
      } else {
        onFormSchRef.current({ displayType: checked }) // 通过分页器触发查询
      }
      return checked
    })
  })
  async function onFormAction(type: "export" | "contract") {
    console.log(type, "sdfjkl")
    if (type === "export") {
      //导出
      const formData = formRef.current?.getFormValues()
      exportAnlyTrendData(formData)
    }
    if (type === "contract") {
      setIsModalOpen(true)
    }
  }
  return (
    <div className="page-wrap">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={ANLY_TREND_SCH_ITEMS}
        buttons={ANLY_TREND_FORM_BTNS}
        formOptions={{ onValuesChange: onSchValueChgRef.current }}
        onSearch={onFormSchRef.current}
        onAction={onFormAction}
      />
      <TypeButtonGroup buttons={CHART_OR_TABLE_BTNS} onChange={displayChgRef.current} btnProps={{ size: "small" }} />
      {isChart ? (
        <AnalyScatterChart loading={loading} data={chartData} options={analyTrendOptions} />
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
      <CustomModal
        ref={modeRef}
        width="80%"
        height="80vh"
        title="对比分析"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={AnalysisCttTrend}
      />
    </div>
  )
}
