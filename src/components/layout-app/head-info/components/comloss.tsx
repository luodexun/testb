/*
 * @Author: chenmeifeng
 * @Date: 2023-11-06 10:38:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-13 16:53:06
 * @Description: 通讯中断
 */
import "./comloss.less"

import { ConfigProvider } from "antd"
import { ReactNode, useEffect, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal"
import { MS_SCEND_3 } from "@/configs/time-constant"

import { getAllComlossData } from "../methods"
import ComlossList, { IOperateProps, IPerateRef } from "./comloss-list"
// import useMqttDvsStateAlarm from "@/hooks/use-mqtt-dvs-state"
import DvsStateBox from "./dvs-state-alarmbox"

// import AlarmDetail from "./new-Detail"

interface IProps {
  children: ReactNode
  isShowModel: boolean
  onClickbtn?: any
  setRefresh?: any
  playFun?: () => void
}
export default function Comloss(props: IProps) {
  const { onClickbtn, isShowModel, children, playFun } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openStateAlarmDialog, setOpenStateAlarmDialog] = useState(false)
  const [comlossCount, setComlossCount] = useState(0)
  const [comlossList, setComlossList] = useState([])
  const [dvsStateAlarmData, setDvsStateAlarmData] = useState(null)
  const modeRef = useRef()
  const timer = useRef(null)
  const latestComlossCount = useRef(0)
  const isFirst = useRef(true)

  // useMqttDvsStateAlarm({ setDvsStateAlarmData })

  const close = () => {
    setIsModalOpen(false)
    onClickbtn?.()
  }
  const getComLossData = useRef(async () => {
    const result = await getAllComlossData(null, { deviceType: "SYZZZ", mainState: "100" })
    if (result?.fail) return
    // const result = await getAllComlossData(null, { deviceType: "WT", mainState: "7" })
    // console.log(result, "result")
    //第一次不播放，后续的逻辑：如果noCommunication有值，且比上次的值大，则播放提示音
    if (result?.noCommunication >= 1 && result?.noCommunication > latestComlossCount.current && !isFirst) {
      playFun()
    }
    setComlossCount(result?.noCommunication || 0)
    latestComlossCount.current = result?.noCommunication || 0
    isFirst.current = false
    setComlossList(result?.records)
  })
  const closeAlarm = useRef((type) => {
    setOpenStateAlarmDialog(false)
  })
  useEffect(() => {
    if (!dvsStateAlarmData) return
    console.log(dvsStateAlarmData, "dvsStateAlarmData")
    setOpenStateAlarmDialog(true)
  }, [dvsStateAlarmData])
  useEffect(() => {
    setIsModalOpen(isShowModel)
  }, [isShowModel])
  useEffect(() => {
    getComLossData.current()
    timer.current = setInterval(() => {
      getComLossData.current()
    }, 10000)
    return () => {
      clearInterval(timer.current)
    }
  }, [])
  return (
    <ConfigProvider
      theme={{
        components: {
          Notification: {
            width: 420,
          },
        },
      }}
    >
      <div className="alarm-box">
        {children}
        {comlossCount ? <span className="alarm-total">{comlossCount}</span> : ""}
      </div>
      {openStateAlarmDialog ? <DvsStateBox info={dvsStateAlarmData} btnClick={closeAlarm.current} /> : ""}
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="70%"
        title="通讯中断"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => close()}
        Component={ComlossList}
        componentProps={{ comlossData: comlossList }}
      />
    </ConfigProvider>
  )
}
