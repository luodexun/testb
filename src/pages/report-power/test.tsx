/* eslint-disable react-hooks/exhaustive-deps */
/*
 *@Author: chenmeifeng
 *@Date: 2023-10-16 14:02:21
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-06 16:00:53
 *@Description: 报表管理-电计量报表
 */
import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import { Button, Dropdown, MenuProps } from "antd"
import Table, { ColumnsType } from "antd/es/table"
import { use } from "echarts"
import React, { useEffect, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import DragCheckbox from "@/components/property-checkbox/drag-checkbox"
import { EXPORT_LIST } from "@/configs/option-const"
import { getMngStaticInfo } from "@/utils/device-funs"

import LineChooseKey from "./components/choose-echarts"
import { TRpXDataItem } from "./components/choose-echarts/configs"
import PivotTable from "./components/excel-test"
import TableSummary from "./components/summary"
import {
  CONTROL_LOG_COLUMNS,
  DEFAULT_NEW_STATION_MAP,
  DEFAULT_STATION_MAP,
  END_TIME,
  RP_POWER_SCH_FORM_BTNS,
  RP_POWER_SCH_FORM_ITEMS,
  START_TIME,
  TAB_LIST,
} from "./configs"
import {
  changeCurve,
  doExportReportPower,
  getBasicColumns,
  getReportPowerSchData,
  onReportPowerSchFormChg,
  saveColumns,
} from "./methods"
import { IKeyMap, IRpPowerData, IRpPowerSchForm, IStationMap, TRpPowerSchFormItemName } from "./types"

export default function ReportPower() {
  const containerRef = useRef(null)
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()

  const [isSelected, setSelect] = useState<number>(0)
  const selectDeviceType = useRef("WT") // 查询类型
  // const selectGroupByPath = useRef<TRpXDataItem>("STATION_CODE") // 统计对象
  const [selectGroupByPath, setSelectGroupByPath] = useState<TRpXDataItem>("STATION_CODE")

  const [colums, setColums] = useState<ColumnsType<any>>(CONTROL_LOG_COLUMNS)
  const [property, setProperty] = useState<IKeyMap>(null)
  const [openProperty, setOpenProperty] = useState(false)
  const [dvsTypeColumns, setDvsTypeColumns] = useState([]) // 存储当前类型表头选择情况数据
  const [existColumns, setExistColumns] = useState([]) // 存储选择的非基础数据表头数据
  const [typeChooseKeyMap, setTypeChooseKeyMap] = useState({
    // 存储各类型表头选择key情况数据
    WT: null,
    PVINV: null,
    ESPCS: null,
  })
  const typeColumns = useRef({
    // 存储各类型表头选择情况数据
    WT: [],
    PVINV: [],
    ESPCS: [],
  })
  const [actualColumns, setActualColumns] = useState<IStationMap>()
  const [isUseNewColumns, setIsUseNewColumns] = useState<boolean>(false)
  // 执行查询的钩子
  const { dataSource, loading, pageInfo, pagination, onSearch } = usePageSearch<IRpPowerSchForm, IRpPowerData>(
    { serveFun: getReportPowerSchData },
    {
      formRef,
      needFirstSch: false,
    },
  )
  const getStaticColumnsInfo = async () => {
    const res = await getMngStaticInfo("rp_columns_is_new")
    const columns = res ? DEFAULT_NEW_STATION_MAP : DEFAULT_STATION_MAP
    setIsUseNewColumns(!!res)
    setActualColumns(columns)
  }
  async function onFormAction(type: "export" | "configure") {
    if (type === "export") {
      // 导出
      const formData = formRef.current?.getFormValues()
      doExportReportPower(pageInfo, formData)
    } else if (type === "configure") {
      setOpenProperty((prev) => !prev)
    }
  }

  const [groupByTime, setGroupByTime] = useState<string>("1d")
  const onSchValueChgRef = useRef(async (changedValue: IRpPowerSchForm) => {
    if (changedValue?.deviceType) {
      setOpenProperty(false)
    }
    if (changedValue?.groupByTime) {
      setGroupByTime(changedValue.groupByTime)
    }
    const forItemCfgData = await onReportPowerSchFormChg(changedValue, formRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
  })

  // const currentFormItemOptions = useMemo(() => {
  //   const pickType = groupByTime === "1mo" ? "month" : groupByTime === "1y" ? "year" : "day"
  //   return RP_POWER_SCH_FORM_ITEMS(pickType)
  // }, [groupByTime])
  const exportFile: MenuProps["onClick"] = ({ key }) => {
    const formData = formRef.current?.getFormValues()
    formData.fileType = key
    doExportReportPower(pageInfo, formData)
  }
  const handleSelect = (index: number) => {
    setSelect(index)
    changeCurve()
    onSearch()
  }

  const searchRef = () => {
    onSearch()

    const { deviceType = "WT", groupByPath = "STATION_CODE" } = formRef.current?.getFormValues() || {}
    const checkList = typeColumns.current[deviceType]
    // const storageKeyMap = getStorage(StorageRptPowerClmn)?.typeChooseKeyMap
    setSelectGroupByPath(groupByPath)
    if (checkList?.length) {
      const list = checkList.filter((i) => typeChooseKeyMap?.[deviceType]?.[i.dataIndex])
      setExistColumns(list)
      const basicColumns = getBasicColumns(groupByPath).concat(list)
      setColums(basicColumns)
    } else {
      const clns = actualColumns[deviceType]?.colums
      const basicColumns = getBasicColumns(groupByPath).concat(clns)
      setExistColumns(clns)
      setColums(basicColumns)
    }
  }

  const propertyClk = async (type, propertyInfo, checkList) => {
    if (type === "comfirm") {
      setDvsTypeColumns(checkList)
      setProperty(propertyInfo)

      const { deviceType = "WT", groupByPath = "STATION_CODE" } = formRef.current?.getFormValues() || {}
      typeColumns.current[deviceType] = checkList
      const typeMaps = { ...typeChooseKeyMap, [deviceType]: propertyInfo }
      setTypeChooseKeyMap(typeMaps)
      const data = {
        typeChooseKeyMap: typeMaps,
        typeColumns: typeColumns.current,
      }
      const operate = await saveColumns(data, isUseNewColumns ? "report_power_columns_new" : "report_power_columns_old")
      // setStorage(data, StorageRptPowerClmn)
      const list = checkList.filter((i) => propertyInfo?.[i.dataIndex])
      const basicColumns = getBasicColumns(groupByPath).concat(list)
      setExistColumns(list)
      setColums(basicColumns)
    } else {
      setOpenProperty(false)
    }
  }
  useEffect(() => {
    const { deviceType = "WT" } = formRef.current?.getFormValues() || {}
    if (openProperty) {
      setProperty(typeChooseKeyMap?.[deviceType])
    }
    // 如果缓存中某个类型表头数据不存在，取初始值
    if (openProperty && !typeColumns.current?.[deviceType]?.length) {
      const allColums = actualColumns[deviceType]?.colums
      setDvsTypeColumns(allColums)
    } else if (typeColumns.current?.[deviceType]?.length) {
      setDvsTypeColumns(typeColumns.current?.[deviceType])
    }
  }, [openProperty])
  const getColumnsFromApi = async (clns, basicColumns) => {
    const res = await getMngStaticInfo(isUseNewColumns ? "report_power_columns_new" : "report_power_columns_old")
    if (res?.typeColumns) {
      typeColumns.current = Object.keys(res?.typeColumns)?.reduce(
        (prev, cur) => {
          prev[cur] = res?.typeColumns[cur]?.map((i) => {
            const info = actualColumns[cur]?.colums?.find((j: any) => j.dataIndex === i.dataIndex)
            return info
          })
          return prev
        },
        { WT: null, PVINV: null, ESPCS: null },
      )
      setTypeChooseKeyMap(res?.typeChooseKeyMap)
      const { deviceType = "WT", groupByPath = "STATION_CODE" } = formRef.current?.getFormValues() || {}
      const list = typeColumns.current?.[deviceType]?.filter((i) => res?.typeChooseKeyMap?.[deviceType]?.[i.dataIndex])
      setExistColumns(list)
      const basicColumns = getBasicColumns(groupByPath).concat(list)
      setColums(basicColumns)
    } else {
      setExistColumns(clns)
      setColums(basicColumns)
    }
  }

  useEffect(() => {
    if (!actualColumns) return
    const formInst = formRef.current?.getInst()
    const { deviceType = "WT", groupByPath = "STATION_CODE" } = formRef.current?.getFormValues() || {}
    formInst?.setFieldsValue({ dateRange: [START_TIME, END_TIME] })
    formInst?.submit()

    const clns = actualColumns[deviceType]?.colums
    const basicColumns = getBasicColumns(groupByPath).concat(clns)
    // 初始化表头和统计行
    getColumnsFromApi(clns, basicColumns)
  }, [actualColumns])
  //初始化赋值
  useEffect(() => {
    getStaticColumnsInfo()
  }, [])

  return (
    <div className="page-wrap rp-power" ref={containerRef}>
      <div className="rp-power-top">
        <CustomForm
          ref={formRef}
          loading={loading}
          itemOptionConfig={formItemConfig}
          itemOptions={RP_POWER_SCH_FORM_ITEMS}
          buttons={RP_POWER_SCH_FORM_BTNS}
          formOptions={{
            // validateTrigger: ["onSubmit"],
            onValuesChange: onSchValueChgRef.current,
          }}
          onSearch={searchRef}
          onAction={onFormAction}
        />
        <Dropdown
          menu={{ items: EXPORT_LIST, onClick: exportFile }}
          placement="bottomLeft"
          getPopupContainer={() => containerRef.current}
        >
          <Button>导出</Button>
        </Dropdown>
      </div>
      <div className="tab">
        <div className="tab-list">
          {TAB_LIST.map((e, index) => (
            <span
              key={e}
              className={`item ${isSelected === index ? "active" : ""}`}
              onClick={() => handleSelect(index)}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
      {isSelected === 0 ? (
        <CustomTable
          rowKey="index"
          limitHeight
          loading={loading}
          columns={colums}
          dataSource={dataSource}
          pagination={pagination}
          summary={() => {
            let totalCapacitys = 0
            dataSource.forEach(({ totalCapacity }) => {
              totalCapacitys += totalCapacity
            })
            return (
              <>
                <TableSummary
                  dataSource={dataSource}
                  existColumns={existColumns}
                  formData={formRef.current?.getFormValues()}
                />
              </>
            )
          }}
        />
      ) : isSelected === 1 ? (
        <LineChooseKey groupByPath={selectGroupByPath} deviceType={selectDeviceType.current} dataSource={dataSource} />
      ) : (
        <PivotTable columns={colums} dataSource={dataSource} />
      )}
      {openProperty ? <DragCheckbox options={dvsTypeColumns} property={property} btnClick={propertyClk} /> : ""}
    </div>
  )
}
