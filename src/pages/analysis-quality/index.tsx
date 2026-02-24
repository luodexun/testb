/*
 *@Author: chenmeifeng
 *@Date: 2023-11-09 17:14:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-22 16:49:31
 *@Description: 模块描述
 */

import "./index.less"

import usePageSearch from "@hooks/use-page-search.ts"
import classnames from "classnames"
import React, { useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types.ts"
import { TFormItemConfig } from "@/components/custom-form/types.ts"
import CustomTable from "@/components/custom-table"
import { vDate } from "@/utils/util-funs"

import AnlsCharts from "./components/anls-charts"
import CardInfo from "./components/card-info"
import { AQTAB_LIST, COLUMNS, FORM_BTNS, FORM_ITEMS } from "./configs"
import { exportAnlsLs, getAllCardInfo, getReportPowerSchData, onCfgWeatheSchFormChange } from "./methods"
import { IAnlsQueData, IAnlsQueSchForm, TRpPowerSchFormItemName } from "./types"

export default function AnalysisQuality() {
  const formRef = useRef<IFormInst | null>(null)
  const [isSelected, setSelect] = useState<number>(0)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TRpPowerSchFormItemName>>()

  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      const formInst = formRef.current?.getInst()
      formInst?.setFieldsValue({ dateRange: [vDate().subtract(1, "day"), vDate().subtract(1, "day")] })
      formInst?.submit()
    }
  }, [])
  const { dataSource, loading, onSearch } = usePageSearch<IAnlsQueSchForm, IAnlsQueData>(
    { serveFun: getReportPowerSchData },
    { formRef },
  )

  async function onFormAction(type: "export") {
    if (type !== "export") return
    // 导出
    const formData = formRef.current?.getFormValues()
    exportAnlsLs(formData)
  }

  //时间变化事件
  const onSchValueChgRef = useRef(async (changedValue: IAnlsQueSchForm) => {
    const chgOptions = await onCfgWeatheSchFormChange(changedValue, formRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  })
  const handleSelect = (index: number) => {
    setSelect(index)
  }
  return (
    <div className="page-wrap analysis-quality-wrap">
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
      <CardInfo data={getAllCardInfo(dataSource)} />
      <div className="tab">
        <div className="tab-list">
          {AQTAB_LIST.map((e, index) => (
            <span
              key={e}
              className={classnames("item", { active: isSelected === index })}
              onClick={() => handleSelect(index)}
              children={e}
            />
          ))}
        </div>
      </div>
      <div className="analysis-content">
        {isSelected ? (
          <CustomTable
            loading={loading}
            rowKey="id"
            limitHeight
            columns={COLUMNS}
            dataSource={dataSource}
            pagination={false}
          />
        ) : (
          <AnlsCharts loading={loading} chartData={dataSource} />
        )}
      </div>
    </div>
  )
}
