/*
 *@Author: chenmeifeng
 *@Date: 2023-11-02 16:03:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-13 14:02:50
 *@Description: 模块描述
 */
import "./index.less"

import { day4Y2S } from "@configs/time-constant"
import usePageSearch from "@hooks/use-page-search.ts"
import { showMsg } from "@utils/util-funs.tsx"
import React, { useCallback, useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types.ts"
import TimeContent from "@/pages/analysis-power/components/time-content"
import TreeContent, { ITreeProps } from "@/pages/analysis-power/components/tree-content"
import { IPageInfo } from "@/types/i-table.ts"
import { uDate } from "@/utils/util-funs"

import TabContent from "./components/tab-content"
import TableContent from "./components/table-charts"
import { FORM_BTNS, FORM_ITEMS, TREE_FORM_ITEMS } from "./configs"
import { doExportReportPower, getReportPowerSchData, getTimeData } from "./methods"
import { IRpPowerData, IRpPowerSchForm, ITime, TRpPowerSchFormItemName } from "./types"

export default function AnalysisPower() {
  const treeFromRef = useRef<IFormInst | null>(null)

  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()
  //类型
  const [type, setType] = useState<string>("lineName")

  const { timeType } = treeFromRef?.current?.getFormValues() || {}

  const [timeData, setTimeData] = useState<ITime[]>([])
  const tabTypeRef = useRef<number>(0)
  const deviceDataRef = useRef([])

  const getPowerData = useCallback(
    async (pageInfo: IPageInfo, formData: IRpPowerSchForm) => {
      const { records, total } =
        (await getReportPowerSchData(pageInfo, formData, deviceDataRef.current, tabTypeRef.current)) || {}
      return { records, total }
    },
    [deviceDataRef, tabTypeRef],
  )

  const { dataSource, pageInfo, loading, pagination, onSearch, setDataSource } = usePageSearch<
    IRpPowerSchForm,
    IRpPowerData
  >({ serveFun: getPowerData }, { formRef })

  async function onFormAction(type: "export") {
    if (type === "export") {
      // 导出
      const formData = formRef.current?.getFormValues()
      doExportReportPower(pageInfo, formData, deviceDataRef.current)
    }
  }

  const onSelectRef = useRef<ITreeProps["onSelect"]>((devices) => {
    deviceDataRef.current = devices
  })

  //时间变化事件
  const onSchValueChgRef = useRef(async (changedValue: IRpPowerSchForm) => {
    const { type } = treeFromRef?.current?.getFormValues() || {}
    const startTime = uDate(changedValue?.dateRange?.[0], day4Y2S)
    const endTime = uDate(changedValue?.dateRange?.[1], day4Y2S)
    const formInst = formRef.current?.getInst()
    if (!type) {
      setTimeData((preData) => {
        let data: ITime[]
        const index = preData.findIndex((e) => e.startTime === startTime && e.endTime === endTime)
        if (index !== -1) {
          data = preData
          showMsg("所选时间段已存在", "error")
        } else {
          data = [...preData, { startTime, endTime }]
        }
        return data
      })
    } else {
      setTimeData([{ startTime, endTime }])
    }
    formInst?.resetFields()
  })

  //时间删除
  const onTimeDelete = useRef(({ startTime, endTime }: ITime) => {
    setTimeData((preData) => {
      return preData.filter((e) => !(e.startTime === startTime && e.endTime === endTime))
    })
  })

  const onTabSelect = (index: number) => {
    tabTypeRef.current = index
    setDataSource([])
    onSearch()
  }
  useEffect(() => {
    setFormItemConfig((prevState) => ({
      ...prevState,
      dateRange: { disabled: !timeType ? timeData.length >= 5 : timeData.length >= 1 },
    }))
    getTimeData(timeData)
  }, [timeData])

  useEffect(() => {
    setDataSource([])
  }, [timeType])

  return (
    <div className="page-wrap analysis-power-wrap">
      <div className="tree-wrap">
        <CustomForm
          ref={treeFromRef}
          loading={loading}
          itemOptions={TREE_FORM_ITEMS}
          formOptions={{
            onValuesChange: () => setTimeData([]),
          }}
        />
        <TabContent onClick={(value) => setType(value)} />
        <TreeContent type={type} treeRef={treeFromRef} onSelect={onSelectRef.current} />
      </div>
      <div className="table-wrap">
        <CustomForm
          ref={formRef}
          loading={loading}
          itemOptionConfig={formItemConfig}
          itemOptions={FORM_ITEMS}
          buttons={FORM_BTNS}
          formOptions={{
            onValuesChange: onSchValueChgRef.current,
          }}
          onSearch={onSearch}
          onAction={onFormAction}
        />
        <TimeContent data={timeData} onDelete={onTimeDelete.current} />
        <TableContent
          loading={loading}
          treeFromRef={treeFromRef.current}
          dataSource={dataSource}
          pagination={pagination}
          onSelect={onTabSelect}
        />
      </div>
    </div>
  )
}
