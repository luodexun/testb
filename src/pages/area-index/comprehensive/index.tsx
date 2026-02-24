/*
 * @Author: xiongman
 * @Date: 2023-08-23 17:50:51
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-29 14:37:45
 * @Description: 区域中心-指标总览-综合指标
 */

import "./index.less"

import { COMPREHENSIVE_INDICATOR, MONITOR_CENTER_INFO_LIST } from "@configs/dvs-state-info.ts"
import { UNIT } from "@configs/text-constant.ts"
import useMonitorCenterData from "@hooks/use-monitor-center-data.ts"
import classnames from "classnames"
import { useEffect, useMemo, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import InfoCard from "@/components/info-card"
import PanelTag from "@/components/metric-tag/panel-tag.tsx"
import { StorageComprehensive } from "@/configs/storage-cfg"
import { IBaseProps } from "@/types/i-page.ts"
import { getStorage, validResErr } from "@/utils/util-funs"

import QuotaOffset from "./components/offset-modal"

const INDEX_LIST = MONITOR_CENTER_INFO_LIST.filter((item) => item.field !== "capacity")

interface IProps extends IBaseProps {}
export default function Comprehensive(props: IProps) {
  const { title, className } = props
  const [openModal, setOpenModal] = useState(false)
  const [quotaData, setQuotaData] = useState(null)
  const baseDataMQ = useMonitorCenterData()

  const wrapCls = useMemo(() => classnames("comprehensive-wrap", className), [className])
  const titleClick = () => {
    setOpenModal((prev) => !prev)
  }
  const changeModal = useRef((type: "cancel" | "ok") => {
    setOpenModal(false)
    if (type === "cancel") return
    initForm.current()
  })
  const initForm = useRef(async () => {
    const res = await doBaseServer("queryMngStatic", { key: "energy_quota" })
    if (validResErr(res)) return
    if (res.data) {
      setQuotaData(JSON.parse(res.data))
    }
  })
  const quotaAndBaseDataMQ = useMemo(() => {
    const localFakeData = getStorage<Partial<string> & { fk: boolean }>(StorageComprehensive)
    if (quotaData && baseDataMQ && !localFakeData?.fk) {
      return {
        ...baseDataMQ,
        activePower: (baseDataMQ.activePower || 0) + quotaData.activePower,
        count: (baseDataMQ.count || 0) + quotaData.count,
        rate: (baseDataMQ.rate || 0) + quotaData.rate,
        dailyProduction: (baseDataMQ.dailyProduction || 0) + quotaData.dailyProduction,
        monthlyProduction: (baseDataMQ.monthlyProduction || 0) + quotaData.monthlyProduction,
        yearlyProduction: (baseDataMQ.yearlyProduction || 0) + quotaData.yearlyProduction,
      }
    }
    return baseDataMQ || null
  }, [baseDataMQ, quotaData])
  useEffect(() => {
    initForm.current()
  }, [])
  return (
    <InfoCard title={title} titleClick={titleClick} className={wrapCls}>
      {INDEX_LIST.map(({ title, field, unit }, index) => (
        <PanelTag
          key={field}
          title={title}
          value={quotaAndBaseDataMQ?.[field] ?? "-"}
          unit={unit}
          unitInTitle={unit === UNIT.ELEC}
          className={`comprehensive_${index}`}
        />
      ))}
      {openModal ? (
        <div className="comprehensive-model">
          <QuotaOffset list={INDEX_LIST} formData={quotaData} changeModal={changeModal.current} />
        </div>
      ) : (
        ""
      )}
    </InfoCard>
  )
}
