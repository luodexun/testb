/*
 *@Author: chenmeifeng
 *@Date: 2024-03-29 16:50:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-16 15:15:50
 *@Description: 告警分析
 */

import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import { isNumber } from "ahooks/es/utils"
import { useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import { TDeviceType } from "@/types/i-config.ts"

import AlarmAnalyseTree, { IAlarmAnalyseTreeProps } from "./components/alarm-analyse-tree"
import TableContent from "./components/table-charts"
import { ALARM_ANALYSE_SCH_FORM_BTNS, ALARM_ANALYSE_SCH_FORM_ITEMS } from "./configs"
import { alarmAnalyseExport, getAlarmAnalyseSchData } from "./methods"
import { IRpAlarmAnalyseData, IRpAlarmAnalyseSchForm, TRpAlarmAnalyseSchFormItemName } from "./types"

export default function AlarmAnalyse() {
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig] = useState<TFormItemConfig<TRpAlarmAnalyseSchFormItemName>>()
  const [deviceType, setDeviceType] = useState<TDeviceType>("WT")
  const deviceDataRef = useRef([])
  const tabTypeRef = useRef<number>(0)

  const { dataSource, loading, pagination, onSearch, setDataSource } = usePageSearch<
    IRpAlarmAnalyseSchForm,
    IRpAlarmAnalyseData
  >(
    { serveFun: getAlarmAnalyseSchData },
    {
      formRef,
      otherParams: { deviceIdList: deviceDataRef.current },
    },
  )

  const onSelectRef = useRef<IAlarmAnalyseTreeProps["onSelect"]>((devices) => {
    deviceDataRef.current = devices.filter((item) => isNumber(item))
  })

  const onTabSelect = (index: number) => {
    tabTypeRef.current = index
    setDataSource([])
    onSearch()
  }

  async function onFormAction(type: "export") {
    if (type === "export") {
      const formData = formRef.current?.getFormValues()
      alarmAnalyseExport({ ...formData, deviceIdList: deviceDataRef.current })
    }
  }

  return (
    <div className="l-full alarm-analyse-wrap">
      <div className="alarm-analyse-top">
        <CustomForm
          ref={formRef}
          loading={loading}
          itemOptionConfig={formItemConfig}
          itemOptions={ALARM_ANALYSE_SCH_FORM_ITEMS}
          formOptions={{
            onValuesChange: () => setDeviceType(formRef?.current?.getFormValues()?.deviceType),
          }}
          buttons={ALARM_ANALYSE_SCH_FORM_BTNS}
          onSearch={onSearch}
          onAction={onFormAction}
        />
      </div>
      <div className="alarm-analyse-content">
        <div className="al-analyse-content-left">
          <AlarmAnalyseTree deviceType={deviceType} onSelect={onSelectRef.current} />
        </div>
        <div className="al-analyse-content-right">
          <TableContent
            loading={loading}
            // treeFromRef={formRef.current}
            dataSource={dataSource}
            pagination={pagination}
            onSelect={onTabSelect}
          />
        </div>
      </div>
    </div>
  )
}
