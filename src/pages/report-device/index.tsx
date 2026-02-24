/*
 * @Author: chenmeifeng
 * @Date: 2024-08-26 10:07:04
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-08-26 17:22:14
 * @Description: 单机发电量
 */
import usePageSearch from "@hooks/use-page-search.ts"
import { useEffect, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import { vDate } from "@/utils/util-funs"
import { IQueryRpDvsParams, IRpDvsList, TRpDvsFormField } from "./types"
import { getReportDevSchData, onReportDvsSchFormChg, reportDvsExport } from "./methods"
import {
  CONTROL_OPTION,
  REPORT_DEVICE_COLUMNS1,
  REPORT_DEVICE_COLUMNS2,
  REPORT_DEVICE_COLUMNS3,
  RP_DEVICE_SCH_FORM_BTNS,
  RP_DEVICE_SCH_FORM_ITEMS,
} from "./configs"
import { AtomConfigMap } from "@/store/atom-config"
import { useAtomValue } from "jotai"
import { AtomStation } from "@/store/atom-station"
import { ColumnsType } from "antd/es/table"

export default function ReportDevice() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpDvsFormField>>()

  const { stationList } = useAtomValue(AtomStation)
  const { deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const deviceTypeMapRef = useMemo(() => {
    return deviceTypeMap
  }, [deviceTypeMap])

  const { dataSource, loading, pagination, onSearch } = usePageSearch<IQueryRpDvsParams, IRpDvsList>(
    { serveFun: getReportDevSchData },
    { formRef, needFirstSch: false, otherParams: { stationList } },
  )

  async function onFormAction(type: "export") {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      reportDvsExport(formData, stationList)
    }
  }

  const ACTUAL_COLUMS = useMemo<ColumnsType<any>>(() => {
    const { deviceType = "WT" } = formRef.current?.getFormValues() || {}
    if (deviceType === "PVINV") {
      return REPORT_DEVICE_COLUMNS1
    }
    if (deviceType === "WT") {
      return REPORT_DEVICE_COLUMNS3
    }
    return REPORT_DEVICE_COLUMNS2
  }, [dataSource])

  const onSchValueChgRef = useRef(async (changedValue) => {
    const chgOptions = await onReportDvsSchFormChg(changedValue, formRef.current, deviceTypeMapRef)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  })

  useEffect(() => {
    const formInst = formRef.current?.getInst()
    formInst?.setFieldsValue({ dateRange: [vDate().subtract(1, "day"), vDate()] })
    setFormItemConfig((prevState) => ({ ...prevState, deviceType: { options: CONTROL_OPTION } }))
    // formInst?.submit()
  }, [])

  return (
    <div className="page-wrap l-full">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formItemConfig}
        itemOptions={RP_DEVICE_SCH_FORM_ITEMS}
        buttons={RP_DEVICE_SCH_FORM_BTNS}
        formOptions={{
          onValuesChange: onSchValueChgRef.current,
        }}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="id"
        loading={loading}
        limitHeight
        columns={ACTUAL_COLUMS}
        dataSource={dataSource}
        pagination={pagination}
      />
    </div>
  )
}
