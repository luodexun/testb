/*
 * @Author: chenmeifeng
 * @Date: 2024-12-12 15:24:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-13 16:16:43
 * @Description:
 */
import "./contract-point.less"

import { CHART_OR_TABLE_BTNS, TChartOrTable } from "@configs/table-constant.tsx"
import usePagination from "@hooks/use-pagination.ts"
import AnalyScatterChart from "@pages/analysis-scatter/components/analy-scatter-chart.tsx"
import { ANLY_SCTTR_COLUMNS, ANLY_SCTTR_FORM_BTNS } from "@pages/analysis-scatter/configs"
import { IAnalyFormItemCfgMap, TAnlyScatterData } from "@pages/analysis-scatter/types"
import analyTrendOptions, { IAnalyTrendChartData } from "@pages/analysis-trend/components/analy-trend-options.ts"
import { AtomConfigMap } from "@store/atom-config.ts"
import { AtomStation } from "@store/atom-station.ts"
import { getStorage, isEmpty, reduceList2KeyValueMap, showMsg, vDate } from "@utils/util-funs.tsx"
import { Button, Input, Radio, Space } from "antd"
import { useAtomValue } from "jotai"
import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"

import MaximumSet from "@/components/common-maximum-set/maximum-set"
import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import EchartCom from "@/components/echarts-common"
import TypeButtonGroup from "@/components/type-button-group"
import { IDvsRunStateInfo } from "@/configs/dvs-state-info"
import { INTERVAL_OPTIONS, POLYMER_OPTIONS } from "@/configs/option-const"
import { StorageDeviceType } from "@/configs/storage-cfg"
import { ITreeLabelValue } from "@/types/i-antd.ts"

import { AL_FORM_BTNS, ANLY_CONTRACT_TREND_SCH_ITEMS } from "../configs"
import { anlyTrendSch4Chart, anlyTrendSch4Table, exportAnlyTrendData, onAnlyTrendSchFormChange } from "../methods"
import { getAnalyDeviceOptions, getDvsPoint, onAnlyCttTrendSchFormChange } from "../methods/contract-point"
import { saveTplt } from "../methods/template"
import { IAnlyTrendSchForm, TRpPowerSchFormItemName } from "../types"
import TemplateTable from "./template-table"
const VALID_INFOS: IDvsRunStateInfo<keyof IAnlyTrendSchForm>[] = [
  { field: "devicePoint", title: "请选择测点！", valueFun: (val) => !val?.length },
  { field: "timeInterval", title: "请选择刻度间隔！", valueFun: (val) => !val },
  { field: "func", title: "请选择聚合方式！", valueFun: (val) => !val },
]
const AnalysisCttTrend = forwardRef((props, ref) => {
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()
  const [colums, setColums] = useState(ANLY_SCTTR_COLUMNS)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<TAnlyScatterData[]>([])
  const [chartData, setChartData] = useState<{ series: any[]; xAxis?: any }>()
  const [displayType, setDisplayType] = useState<TChartOrTable>("chart")
  const displayTypeRef = useRef<TChartOrTable>("chart")
  const [pageInfo, setTotal, pagination, setPageInfo] = usePagination()
  const { deviceTypeOfStationMap } = useAtomValue(AtomConfigMap).map
  const { stationMap } = useAtomValue(AtomStation)
  const formRef = useRef<IFormInst<IAnlyTrendSchForm>>()
  const formItemCfgMapRef = useRef<IAnalyFormItemCfgMap>({ dvsOptionsMap: {}, deviceTypeOfStationMap, stationMap })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modeRef = useRef(null)
  const [nameModal, setNameModal] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [sharedFlag, setSharedFlag] = useState(1)

  const [showMaximums, setShowMaximums] = useState(false)
  const [showYMaximums, setShowYMaximums] = useState(false)
  const [maximumLs, setMaximumLs] = useState([])
  const [allChoosePoint, setAllChoosePoint] = useState([])
  const [allPoints, setAllPoints] = useState([])
  const [yAxisData, setYAxisData] = useState([])
  const maximumRef = useRef(null)
  const [pointYAxis, setPointYAxis] = useState([]) // 纵坐标数据

  formItemCfgMapRef.current = useMemo(() => {
    const actualDevOptions =
      formItemConfig?.deviceList?.map((i) => {
        return {
          ...i,
          value: i.deviceCode,
          label: i.deviceName,
        }
      }) || []
    const dvsOptionsMap = reduceList2KeyValueMap(actualDevOptions, { vField: "value" }, (d) => d)
    return { dvsOptionsMap, deviceTypeOfStationMap, stationMap, formItemConfig }
  }, [deviceTypeOfStationMap, formItemConfig, stationMap])

  //初始化赋值
  useEffect(() => {
    const formInst = formRef.current?.getInst()
    const endDate = vDate()
    const startDate = endDate.clone().subtract(2, "h")
    const dvsTypeLs =
      getStorage(StorageDeviceType)?.map((i) => {
        return {
          label: i.name,
          value: i.code,
        }
      }) || []
    setFormItemConfig((prevState) => ({
      ...prevState,
      deviceType: { options: dvsTypeLs },
    }))
    formInst?.setFieldsValue({ dateRange: [startDate, endDate] })
  }, [])

  const onSchValueChgRef = useRef(async (changedValue: IAnlyTrendSchForm) => {
    // setPageInfo((prevState) => ({ ...prevState, current: 1 }))

    if (isEmpty(changedValue)) return
    const formItemCfgData = await onAnlyCttTrendSchFormChange(changedValue, formRef, formItemCfgMapRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...(formItemCfgData || {}) }))
  })

  const isChart = useMemo(() => displayType === "chart", [displayType])

  const pageInfoRef = useRef(pageInfo)
  pageInfoRef.current = pageInfo

  const chartProps = useMemo(() => {
    if (!chartData?.series || !yAxisData?.length) return null

    const series = chartData.series?.map((i) => {
      const yAxisIndex = yAxisData.findIndex((y) => y.key === i.key)
      return {
        ...i,
        yAxisIndex: yAxisIndex,
      }
    })
    return {
      xAxis: chartData?.xAxis,
      series: series,
      downloadFileName: "历史趋势曲线",
      yAxisProps: yAxisData,
    }
  }, [chartData, yAxisData])

  // 执行查询
  const onSearchRef = useCallback(async () => {
    const formValue = formRef.current?.getInst()?.getFieldsValue()
    const stnDvsPointLs = []
    formValue.deviceIds?.forEach((dvsId) => {
      formValue.devicePoint?.forEach((point) => {
        stnDvsPointLs.push({ ...point, value: dvsId + "-" + point.value })
      })
    })
    setLoading(true)
    const treeData = formItemCfgMapRef.current.formItemConfig?.devicePoint?.treeData || []
    setAllPoints(treeData)
    const devicePoint = formValue.devicePoint?.map((i) => i.value) || []
    setAllChoosePoint(devicePoint)
    if (displayTypeRef.current === "table") {
      const { records, total, columns } =
        (await anlyTrendSch4Table(
          { ...formValue, devicePoint: stnDvsPointLs },
          pageInfoRef.current,
          formItemCfgMapRef.current,
        )) || {}
      setDataSource(records || [])
      setTotal(total || 0)
      if (columns?.length) setColums(columns)
      setLoading(false)
      return
    }
    const resData = await anlyTrendSch4Chart({ ...formValue, devicePoint: stnDvsPointLs }, formItemCfgMapRef.current)
    const { data } = resData
    const series = data.map((i) => {
      return {
        type: "line",
        name: i.title || "",
        smooth: true,
        data: i.data,
        ls: i.ls,
        key: i.ponit,
      }
    })
    getPointMaximum.current(series)
    setChartData({ series: series })
    const currentPointYAxis = formValue.devicePoint?.map((i) => {
      return {
        key: i.value,
        name: i.label,
      }
    })
    setPointYAxis(currentPointYAxis)
    setYAxisData(maximumRef?.current?.getYAxis(currentPointYAxis))
    setLoading(false)
  }, [displayType])

  const getPointMaximum = useRef((info) => {
    const maximumInfo = info?.map((i) => {
      const max = parseFloat(Math.max.apply(null, i.ls).toFixed(4))
      const min = parseFloat(Math.min.apply(null, i.ls).toFixed(4))
      const avg = parseFloat((i.ls.reduce((sum, val) => sum + val, 0) / i.ls.length).toFixed(4))
      return {
        name: i.name,
        max,
        min,
        avg,
      }
    })
    setMaximumLs(maximumInfo)
  })

  const displayChgRef = useRef((checked: TChartOrTable) => {
    displayTypeRef.current = checked
    setDisplayType(checked)
    if (checked === "table") {
      setPageInfo((prevState) => ({ ...prevState, current: 1 }))
    }
    onSearchRef()
  })
  async function onFormAction(type: "export" | "template" | "saveTemplate") {
    if (type === "export") {
      //导出
      const formValue = formRef.current?.getInst()?.getFieldsValue()
      const stnDvsPointLs = []
      formValue.deviceIds?.forEach((dvsId) => {
        formValue.devicePoint?.forEach((point) => {
          stnDvsPointLs.push({ ...point, value: dvsId + "-" + point.value })
        })
      })
      exportAnlyTrendData({ ...formValue, devicePoint: stnDvsPointLs })
    } else if (type === "template") {
      setIsModalOpen(true)
    } else if (type == "saveTemplate") {
      setNameModal((prev) => !prev)
    } else if (type === "maxmin") {
      // 最值查看
      setShowMaximums((prev) => !prev)
    } else if (type === "ymaxmin") {
      // y轴范围
      setShowYMaximums((prev) => !prev)
    }
  }
  const saveTemplate = async () => {
    if (!templateName) {
      showMsg("请输入名称")
      return
    }
    const formValue = formRef.current?.getInst()?.getFieldsValue()
    const timeIntervalName = INTERVAL_OPTIONS.find((i) => i.value === formValue?.timeInterval)?.label
    const funcName = POLYMER_OPTIONS.find((i) => i.value === formValue?.func)?.label
    const deviceNames = formItemConfig?.deviceList
      ?.filter((i) => formValue?.deviceIds?.includes(i.deviceCode))
      ?.map((i) => i.deviceName)
      ?.join(",")
    const deviceTypeName = formItemConfig?.deviceType?.options?.find((i) => i.value === formValue?.deviceType)?.label
    const errInfo = VALID_INFOS.find(({ field, valueFun }) => valueFun(formValue[field]))
    if (errInfo) {
      showMsg(errInfo.title)
      return
    }
    const res = await saveTplt(
      { ...formValue, timeIntervalName, funcName, deviceNames, deviceTypeName },
      templateName,
      sharedFlag,
    )
    setNameModal(false)
  }
  const changeName = (e) => {
    setTemplateName(e?.target?.value)
  }
  const btnClickRef = useRef(async (info) => {
    setIsModalOpen(false)
    const { deviceType, devicePoint, deviceIds, func, timeInterval } = info
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ deviceType, devicePoint, deviceIds, func, timeInterval })
    const { treeData, dvsList } = await getAnalyDeviceOptions(deviceType)
    const pointLs = await getDvsPoint(deviceIds, deviceType)
    setFormItemConfig((prevState) => ({
      ...prevState,
      deviceIds: { treeData: treeData },
      deviceList: dvsList,
      devicePoint: { treeData: pointLs },
    }))
  })
  const changeFlag = (e) => {
    setSharedFlag(e?.target?.value)
  }

  const setMaxmin = (e) => {
    console.log(e, "dfsd")

    setYAxisData(e)
  }
  return (
    <div className="anly-ctt">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={ANLY_CONTRACT_TREND_SCH_ITEMS}
        buttons={AL_FORM_BTNS}
        formOptions={{ onValuesChange: onSchValueChgRef.current }}
        onSearch={onSearchRef}
        onAction={onFormAction}
      />
      <TypeButtonGroup
        needFirstSearch={false}
        buttons={CHART_OR_TABLE_BTNS}
        onChange={displayChgRef.current}
        btnProps={{ size: "small" }}
      />
      {isChart ? (
        <EchartCom type="dynamicsTimeLine" chartData={chartProps} />
      ) : (
        // <AnalyScatterChart loading={loading} data={chartData} options={analyTrendOptions} />
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
        width="50%"
        title="模板选择"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={TemplateTable}
        componentProps={{ btnClick: btnClickRef.current }}
      />
      <div className={`template-name ${!nameModal ? "hidden" : ""}`}>
        <Input placeholder="请输入名称" value={templateName} onChange={changeName} />
        <Radio.Group
          value={sharedFlag}
          onChange={changeFlag}
          options={[
            { value: 1, label: "所有人可见" },
            { value: 0, label: "自己可见" },
          ]}
        />
        <div className="btn-list">
          <Space>
            <Button onClick={saveTemplate}>确认</Button>
            <Button onClick={setNameModal.bind(null, false)}>取消</Button>
          </Space>
        </div>
      </div>
      {showMaximums ? (
        <div className="attr-trend-mx">
          {maximumLs?.map((i) => {
            return (
              <div className="trend-mx-item" key={i.name}>
                {i.name}: {i.min}~{i.avg}~{i.max}
              </div>
            )
          })}
        </div>
      ) : (
        ""
      )}
      <MaximumSet
        ref={maximumRef}
        allChoosePoint={allChoosePoint}
        allDataPiontData={allPoints}
        series={pointYAxis}
        showBox={showYMaximums}
        onChange={setMaxmin}
      />
    </div>
  )
})
export default AnalysisCttTrend
