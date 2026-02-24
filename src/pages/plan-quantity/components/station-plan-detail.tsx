/*
 * @Author: chenmeifeng
 * @Date: 2024-07-05 10:24:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-05 17:55:14
 * @Description: 计划电量修正页面
 */
import { Button } from "antd"
import "./station-plan-detail.less"
import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"
import { useEffect, useMemo, useRef, useState } from "react"
import usePageSearch from "@/hooks/use-page-search"
import {
  MONTHMAP,
  PLAN_CORRECT_TABLE,
  RP_CORRECT_SCH_FORM_ITEMS,
  RP_POWER_CORRECT_SCH_FORM_BTNS,
  RP_POWER_SCH_FORM_ITEMS,
} from "../configs"
import { ICorrectDetail, ICorrectList, IRpPowerData, IRpPowerSchForm } from "../types"
import { getReportPowerSchData } from "../methods"
import CustomTable from "@/components/custom-table"
import { ColumnsType } from "rc-table"
import { uDate, vDate } from "@/utils/util-funs"
import { day4Y } from "@/configs/time-constant"
import FileImport from "./import-file"
import CustomModal from "@/components/custom-modal"
import { AtomStation } from "@/store/atom-station"
import { useAtomValue } from "jotai"
import { doExportCorrectPower, getDailyPdCorrectData, loopNTimes } from "../methods/correct"
export default function StationPlanDetail(props) {
  const { clickStation, onBackBtn } = props

  const [importModal, setImportModal] = useState(false)
  const [curMonth, setCurMonth] = useState("0")
  const [stationCode, setStationCode] = useState("")
  const formRef = useRef<IFormInst | null>(null)

  const { stationList } = useAtomValue(AtomStation)
  // const [colums] = useState([...PLAN_CORRECT_TABLE])
  // 执行查询的钩子
  const { dataSource, loading, onSearch } = usePageSearch<IRpPowerSchForm, ICorrectList>(
    { serveFun: getDailyPdCorrectData },
    { formRef, needFirstSch: false },
  )

  const actDataSource = useMemo<ICorrectDetail[]>(() => {
    if (dataSource) {
      const month = parseInt(curMonth) + 1 + "月"
      return dataSource[month] || []
    }
    return []
  }, [dataSource, curMonth])

  const colums = useMemo(() => {
    const yearForm = formRef.current?.getInst()?.getFieldValue("year")
    const year = yearForm ? uDate(yearForm, day4Y) : 2024
    const dayList = loopNTimes(year, curMonth)
    return PLAN_CORRECT_TABLE.concat([
      { dataIndex: "year", title: "发电量（kWh)", align: "center", children: [...dayList] },
    ])
  }, [curMonth, dataSource])

  const onFormAction = (type) => {
    const stnCode = formRef.current?.getInst()?.getFieldValue("stationCode")
    setStationCode(stnCode)
    if (type === "import") {
      setImportModal(true)
    } else if (type === "export") {
      // 导出
      const formData = formRef.current?.getFormValues()
      doExportCorrectPower(formData)
    }
  }

  const changeMonth = useRef((val) => {
    setCurMonth(val)
  })

  const btnClick = useRef((type) => {
    setImportModal(false)
    if (type === "ok") {
      onSearch()
    }
  })

  useEffect(() => {
    if (clickStation) {
      const { stationId, year } = clickStation
      const formInst = formRef.current?.getInst()
      const date = new Date(year + 1, 0, 0) // 注意月份是从0开始的，所以0代表1月
      const isoString = date.toISOString()
      const stnCode = stationList?.find((i) => i.id === stationId)?.stationCode

      formInst?.setFieldsValue({ stationCode: stnCode, year: vDate(isoString, day4Y) })
      formInst?.submit()
    }
  }, [stationList, clickStation])
  return (
    <div className="l-full plan-correct">
      <Button size="small" shape="circle" title="返回" onClick={onBackBtn} />
      <div className="plan-correct-from">
        <CustomForm
          ref={formRef}
          loading={loading}
          itemOptions={RP_CORRECT_SCH_FORM_ITEMS}
          buttons={RP_POWER_CORRECT_SCH_FORM_BTNS}
          onSearch={onSearch}
          onAction={onFormAction}
        />
      </div>
      <div className="plan-correct-content">
        <div className="mouth-list">
          {Object.keys(MONTHMAP)?.map((i) => {
            return (
              <span
                key={i}
                className={`mouth-item ${i === curMonth ? "active-item" : ""}`}
                onClick={changeMonth.current.bind(null, i)}
              >
                {MONTHMAP[i]}
              </span>
            )
          })}
        </div>
        <div className="plan-table">
          <CustomTable rowKey="id" limitHeight columns={colums} dataSource={actDataSource} pagination={false} />
        </div>
      </div>
      <CustomModal
        width="20%"
        title="发电量导入"
        destroyOnClose
        open={importModal}
        footer={null}
        onCancel={() => setImportModal(false)}
        Component={FileImport}
        componentProps={{ stationCode: stationCode, btnClick: btnClick.current }}
      />
    </div>
  )
}
