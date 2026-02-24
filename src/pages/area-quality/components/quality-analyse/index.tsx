/*
 * @Author: chenmeifeng
 * @Date: 2024-08-09 10:18:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-28 16:04:57
 * @Description:数据质量分析
 */
import ChartRender from "@/components/chart-render"
import "./index.less"
import InfoCard from "@/components/info-card"
import useChartRender from "@/hooks/use-chart-render"
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { commonBarOrLineStyle, lineOrBarOption } from "../../configs/line-bar-options"
import CustomForm from "@/components/custom-form"
import { DATA_QUALITY_FORM_ITEMS, DATA_QUALITY_SCH_FORM_BTNS, RATE_OPTION } from "../../configs/quality-analyse"
import { IFormInst } from "@/components/custom-form/types"
import { IAreaQltParam, ILowerDvsData } from "../../types"
import usePageSearch from "@/hooks/use-page-search"
import { useAtomValue } from "jotai"
import { AtomConfigMap } from "@/store/atom-config"
import { getLowestDevice, onAreaQltDvsSchFormChange } from "../../methods"
import { getStn2DvsTypeMap } from "@/utils/device-funs"
import AreaQualityContext from "../../configs/use-data-context"
import { useRefresh } from "@/hooks/use-refresh"
import { vDate } from "@/utils/util-funs"

export default function QualityAnalyse(props) {
  const { title } = props

  const columns = useRef(DATA_QUALITY_FORM_ITEMS(true))
  const formRef = useRef<IFormInst | null>(null)
  const [formList, setFormItemConfig] = useState({})
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useRefresh(60 * 1000) // 1min
  const [dataSource, setDataSource] = useState<ILowerDvsData[]>([])
  const dataSourceRef = useRef<ILowerDvsData[]>([])
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [],
    downloadFileName: "",
  })
  const chooseDvs = useRef({
    deviceCode: "",
    seriesName: "",
    seriesKey: "",
    stationCode: "",
    stationId: null,
    deviceType: "",
  })

  const { chartRef, chartOptions } = useChartRender(chartData, lineOrBarOption)
  const { setAreaQualityCt, areaQualityCt } = useContext(AreaQualityContext)
  const { deviceTypeOfStationMap, deviceTypeMap } = useAtomValue(AtomConfigMap).map

  const clickBar = useCallback((params) => {
    if (params.componentType === "series" && params.seriesType === "bar") {
      // 只处理柱子的点击事件,获取当前点击的设备id和柱子序列明
      chooseDvs.current = {
        deviceType: dataSourceRef.current[params.dataIndex].deviceType,
        stationId: dataSourceRef.current[params.dataIndex].stationId,
        stationCode: dataSourceRef.current[params.dataIndex].stationCode,
        deviceCode: dataSourceRef.current[params.dataIndex].deviceCode,
        seriesName: params.seriesName,
        seriesKey: RATE_OPTION?.find((i) => i.label === params.seriesName)?.value,
      }
      // 在这里可以根据params.dataIndex执行相应的操作
      titleClick.current()
    }
  }, [])

  const onSearch = async () => {
    setLoading(true)
    // console.log(e, formRef, "formref", deviceTypeOfStationMap, deviceTypeMap)
    getData()
  }
  const getData = async () => {
    const formData = formRef.current?.getInst()
    const res = await getLowestDevice(
      { ...formData?.getFieldsValue(), stationCode: areaQualityCt.stationCode },
      "collectionCoverageRate",
    )
    setLoading(false)
    if (!res) return
    setRefresh(false)
    setDataSource(res)
    dataSourceRef.current = res
  }
  const onSchValueChgRef = useCallback(
    async (changedValue: IAreaQltParam) => {
      const forItemCfgData = await onAreaQltDvsSchFormChange(
        changedValue,
        formRef.current,
        deviceTypeMap,
        deviceTypeOfStationMap,
        areaQualityCt.stationId,
      )
      setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
    },
    [deviceTypeMap, deviceTypeOfStationMap, areaQualityCt],
  )

  const titleClick = useRef(() => {
    const formInst = formRef.current?.getInst()
    const { deviceType, Time } = formInst.getFieldsValue()
    const { deviceCode, seriesName, seriesKey, stationCode, stationId } = chooseDvs.current
    setAreaQualityCt((prev) => {
      prev.openDraw = true
      prev.chooseInfo = { deviceType, stationCode, stationId: stationId, deviceCode, seriesName, seriesKey, Time }
      return { ...prev }
    })
  })
  useEffect(() => {
    setFormItemConfig((prevState) => ({
      ...prevState,
      deviceType: { options: getStn2DvsTypeMap(deviceTypeOfStationMap, deviceTypeMap, areaQualityCt.stationId) },
    }))
  }, [deviceTypeOfStationMap, deviceTypeMap, areaQualityCt.stationId])
  useEffect(() => {
    setChartData((prev) => {
      prev["xAxis"] = dataSource.map((i) => i.deviceName)
      prev["series"] = [
        {
          ...commonBarOrLineStyle.dataQualityRate,
          data: dataSource.map((i) => i.dataQualityRate),
        },
        {
          ...commonBarOrLineStyle.dataIntegrityRate,
          data: dataSource.map((i) => i.dataIntegrityRate),
        },
        {
          ...commonBarOrLineStyle.collectionCoverageRate,
          data: dataSource.map((i) => i.collectionCoverageRate),
        },
      ]
      prev["downloadFileName"] = "数据质量"
      return { ...prev }
    })
  }, [dataSource])
  useEffect(() => {
    const formData = formRef.current?.getInst()
    formData.setFieldValue("Time", vDate().endOf("day"))
  }, [])
  useEffect(() => {
    if (!areaQualityCt?.stationCode) return
    const formData = formRef.current?.getInst()
    formData.setFieldsValue({ deviceType: null, deviceList: [] })
    setRefresh(true)
  }, [areaQualityCt])
  useEffect(() => {
    if (!refresh || !areaQualityCt.stationCode) return
    getData()
  }, [refresh, areaQualityCt])
  return (
    <InfoCard
      title={title}
      className={`area-quality-anls`}
      extra={
        <>
          <CustomForm
            ref={formRef}
            loading={loading}
            itemOptionConfig={formList}
            itemOptions={columns.current}
            buttons={DATA_QUALITY_SCH_FORM_BTNS}
            formOptions={{
              onValuesChange: onSchValueChgRef,
            }}
            onSearch={onSearch}
          />
        </>
      }
    >
      <ChartRender ref={chartRef} empty option={chartOptions} onClick={clickBar} />
    </InfoCard>
  )
}
