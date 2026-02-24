/*
 * @Author: chenmeifeng
 * @Date: 2024-04-28 10:40:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 16:36:45
 * @Description: 场站名称单独组件
 */
import "./station-name.less"

import classnames from "classnames"
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import AlarmConfirmModel, { IOperateProps, IPerateRef } from "@/components/alarm-confirm-model"
import CustomModal from "@/components/custom-modal"
import AreaElecContext from "@/contexts/area-elec-context"
import { bacthPass } from "@/utils/device-funs"
// import { bacthPass } from "@/pages/alarm-history/methods"
import { getStationMainId } from "@/utils/util-funs"

import { getRealtimeAlarm } from "../methods"
import { TEleOverviewDataAct } from "../types"
interface IProps {
  record: TEleOverviewDataAct
  text: string
}
export default function StatinNameText({ record, text }: IProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const { bianAlarmList, setBianAlarmList, dvsSignRecords } = useContext(AreaElecContext)
  const modeRef = useRef(null)
  const allExistAlarm = useRef([])
  const timer = useRef<any>()
  const allShangPiont = useMemo(() => {
    if (!bianAlarmList?.length) return []

    const res = Object.values(record?.breakerList)?.reduce((prev, cur) => {
      const list = prev?.concat(cur.filter((i) => i.pointType === "1"))
      return list
    }, [])
    const allShangPiont = []
    res.forEach((i) => {
      const existAlarm = bianAlarmList.find(
        (alarm) => alarm.alarmId === i.pointName && alarm.stationCode === i.stationCode,
      )
      if (existAlarm) {
        allShangPiont.push(existAlarm)
      }
    })
    allExistAlarm.current = allShangPiont
    return allShangPiont
  }, [record, bianAlarmList])
  const toPage = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (timer.current) {
        navigate(`/site/${getStationMainId(record)}/${record.stationCode}/boost`)
      }
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])
  const doubleClear = useCallback(() => {
    clearTimeout(timer.current)
    // console.log(allShangPiont, "allShangPiont")
    if (allShangPiont?.length) setIsModalOpen(true)
  }, [allShangPiont])
  const btnClkRef = useRef(async (type, msg) => {
    if (type === "ok") {
      await bacthPass(allExistAlarm.current, msg)
      const realAlarmList = await getRealtimeAlarm()
      setIsModalOpen(false)
      if (realAlarmList) {
        setBianAlarmList(realAlarmList)
      }
    }
    setIsModalOpen(false)
  })

  const isSign = useMemo(() => {
    return dvsSignRecords?.findIndex?.((i) => i.stationId == record.stationId) !== -1
  }, [dvsSignRecords])
  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])
  return (
    <div className="elec-stname">
      <span
        onClick={toPage}
        onDoubleClick={doubleClear}
        className={classnames("stname", { shang: allShangPiont?.length, sign: isSign })}
      >
        {text}
      </span>
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="30%"
        title="确认备注"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={AlarmConfirmModel}
        componentProps={{ buttonClick: btnClkRef.current }}
      />
    </div>
  )
}
