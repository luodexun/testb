/*
 * @Author: chenmeifeng
 * @Date: 2024-09-13 10:45:03
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-28 16:15:20
 * @Description:
 */
import "./index.less"
import AreaQualityContext from "../../configs/use-data-context"
import { useContext, useEffect, useMemo, useRef, useState } from "react"
import CustomForm from "@/components/custom-form"
import {
  DATA_QUALITY_DETAIL_FORM_ITEMS,
  DATA_QUALITY_FORM_ITEMS,
  DATA_QUALITY_SCH_FORM_BTNS,
} from "../../configs/quality-analyse"
import { getStn2DvsTypeMap } from "@/utils/device-funs"
import { getDeviceTrend, onAreaQltDvsSchFormChange } from "../../methods"
import { IAreaQltParam } from "../../types"
import { AtomConfigMap } from "@/store/atom-config"
import { useAtomValue } from "jotai"
import useChartRender from "@/hooks/use-chart-render"
import { commonBarOrLineStyle, lineOrBarOption } from "../../configs/line-bar-options"
import { IFormInst } from "@/components/custom-form/types"
import ChartRender from "@/components/chart-render"
import { showMsg, uDate } from "@/utils/util-funs"

export default function DvsQuality() {
  const formRef = useRef<IFormInst | null>(null)
  const [formList, setFormItemConfig] = useState({})
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const columns = useRef(DATA_QUALITY_FORM_ITEMS(false))
  const { areaQualityCt } = useContext(AreaQualityContext)
  const { chartRef, chartOptions } = useChartRender(chartData, lineOrBarOption)

  const { deviceTypeOfStationMap, deviceTypeMap } = useAtomValue(AtomConfigMap).map

  const onSearch = async () => {
    const seriesKey = areaQualityCt.chooseInfo?.seriesKey
    const formIns = formRef.current?.getInst()
    const formData = formIns?.getFieldsValue()
    if (!formData.deviceList) {
      showMsg("请选择设备")
      return
    }
    const res = await getDeviceTrend(formData)
    if (!res) return
    setChartData({
      xAxis: res.map((i) => uDate(i.Time)),
      series: [
        {
          ...commonBarOrLineStyle[seriesKey],
          data: res.map((i) => i[seriesKey]),
        },
      ],
    })
  }
  const onSchValueChgRef = async (changedValue: IAreaQltParam) => {
    const forItemCfgData = await onAreaQltDvsSchFormChange(
      changedValue,
      formRef.current,
      deviceTypeMap,
      deviceTypeOfStationMap,
      null,
      true,
    )
    setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
  }

  useEffect(() => {
    const formInst = formRef.current?.getInst()
    const { stationCode, deviceType, deviceCode, stationId, Time } = areaQualityCt.chooseInfo
    formInst.setFieldsValue({ stationId, deviceList: deviceCode, Time, deviceType })
    // console.log(areaQualityCt, "areaQualityCt deviceList")
    onSearch()
  }, [areaQualityCt])

  return (
    <div className="l-full">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formList}
        itemOptions={[...DATA_QUALITY_DETAIL_FORM_ITEMS, ...columns.current]}
        buttons={DATA_QUALITY_SCH_FORM_BTNS}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
        onSearch={onSearch}
      />
      <ChartRender ref={chartRef} empty option={chartOptions} />
    </div>
  )
}
