/*
 * @Author: chenmeifeng
 * @Date: 2023-11-27 16:25:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-12-25 15:38:51
 * @Description:
 */
import "./index.less"

import { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import EchartCom from "@/components/echarts-common"

import { DEFAULT_STATION_MAP } from "../../configs"
import { IRpPowerData } from "../../types"
import {
  RP_POWER_LINE_SCH_FORM_BTNS,
  RP_POWER_LINE_SCH_FORM_ITEMS,
  RP_POWER_MIX_CHART,
  RP_POWER_ORDINARY_CHART,
  TRpPowerLineSchFormItemName,
  TRpXDataItem,
} from "./configs"
import { getRadarInfo, getSeriesListBaseKey, getXDataIndex, getXDataList } from "./methods"

interface IProps {
  dataSource: Array<IRpPowerData>
  deviceType: string
  groupByPath: TRpXDataItem
}
export default function LineChooseKey(props: IProps) {
  const { dataSource, deviceType, groupByPath } = props
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerLineSchFormItemName>>()
  const [columns, setColumns] = useState(RP_POWER_LINE_SCH_FORM_ITEMS.concat(RP_POWER_ORDINARY_CHART))
  // 图表类型
  const [currentChartsType, setCurrentChartsType] = useState("line")
  // X轴指标, 只有折线图和柱状图需要
  const [xIndicator, setXIndicator] = useState([])
  // y轴指标结合，series集合
  const [seriesList, setSeriesList] = useState(null)

  // 雷达图数据集合
  const [radarInfo, setRadarInfo] = useState(null)

  const recordLastIsMixType = useRef(false) // 记录上一次选择的是否是

  async function onFormAction(type: "confirm") {
    if (type === "confirm") {
      // 处理x轴和指标数据
      const { xData, seriesData, chartsType } = formRef.current.getFormValues()
      setCurrentChartsType(chartsType)
      setXIndicator(getXDataList(dataSource, xData)) // 设置X轴
      setSeriesList(
        getSeriesListBaseKey({
          dataSource,
          keyLists: seriesData,
          chartsType,
          keyValueList: DEFAULT_STATION_MAP?.[deviceType]?.colums || [],
          xData,
        }),
      )
      if (chartsType !== "radar") return
      setRadarInfo(
        getRadarInfo({
          dataSource,
          keyLists: seriesData,
          keyValueList: DEFAULT_STATION_MAP?.[deviceType]?.colums || [],
        }),
      )
    }
  }

  const onSchValueChgRef = (changeValue) => {
    const isExistType = Object.keys(changeValue).includes("chartsType")
    const formIns = formRef.current.getInst()
    if (isExistType) {
      if (changeValue.chartsType === "conbination") {
        setColumns(RP_POWER_LINE_SCH_FORM_ITEMS.concat(RP_POWER_MIX_CHART))
        formIns.setFieldValue("seriesData", null)
        setFormItemConfig((prevState) => ({
          ...prevState,
          seriesData: { options: DEFAULT_STATION_MAP?.[deviceType]?.colums || [] },
        }))
        recordLastIsMixType.current = true
        return
      } else {
        setColumns(RP_POWER_LINE_SCH_FORM_ITEMS.concat(RP_POWER_ORDINARY_CHART))
      }
      if (recordLastIsMixType.current) {
        formIns.setFieldValue("seriesData", null)
      }
      // 选择图表类型，单选/多选互相切换
      const mode = changeValue.chartsType === "pie" || changeValue.chartsType === "funnel" ? "" : "multiple" // pie单选

      setFormItemConfig((prevState) => ({ ...prevState, seriesData: { mode: mode } }))
      const seriesData = formIns.getFieldValue("seriesData")
      // debugger
      mode === "multiple" && typeof seriesData === "string" ? formIns.setFieldValue("seriesData", [seriesData]) : ""
      mode !== "multiple" && typeof seriesData === "object" ? formIns.setFieldValue("seriesData", seriesData?.[0]) : ""
      recordLastIsMixType.current = false
    }
  }

  useEffect(() => {
    setFormItemConfig((prevState) => ({
      ...prevState,
      seriesData: { options: DEFAULT_STATION_MAP?.[deviceType]?.colums || [] },
      xData: { options: getXDataIndex(groupByPath) || [] },
    }))
  }, [dataSource])
  return (
    <div className="rp-line">
      <CustomForm
        ref={formRef}
        itemOptionConfig={formItemConfig}
        itemOptions={columns}
        buttons={RP_POWER_LINE_SCH_FORM_BTNS}
        onAction={onFormAction}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
      />
      <EchartCom type={currentChartsType} chartData={{ xAxis: xIndicator, series: seriesList, radar: radarInfo }} />
    </div>
  )
}
