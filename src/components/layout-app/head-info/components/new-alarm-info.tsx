/*
 * @Author: chenmeifeng
 * @Date: 2023-11-06 10:38:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-14 11:26:53
 * @Description: 告警弹框模块 静态表dialog表示："1"-详情框，"2"-条数框，"0"-不展示   custom_dialog表示："1"-展示自定义告警
 */
import "./new-alarm-info.less"
import { ConfigProvider } from "antd"
import { useSetAtom } from "jotai"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import { StorageAlarmList } from "@/configs/storage-cfg"
import useMqttAlarm from "@/hooks/use-mqtt-alarm"
import { alarmAudioSetAtom, alarmInfoSetAtom } from "@/store/atom-alarm"
import { IAlarmMqttInfo } from "@/types/i-alarm"
import { getStorage, showMsg, validResErr } from "@/utils/util-funs"

import AlarmBoxCount from "./alarm-box-count"
import AlarmDetail from "./new-Detail"
import { useNavigate } from "react-router"
import AlarmShutdownDetail from "./alarm-box-shutdown"
import useMqttCustomAlarm from "@/hooks/use-mqtt-custom-alarm"

interface IProps {
  children: ReactNode
  isShowModel: boolean
  onClickbtn?: any
  setRefresh?: any
}
const tabs = [
  { label: "告警", value: "realtime_alarm" },
  { label: "自定义告警", value: "custom_alarm" },
]
// const MODEL_SHOW_ALARM_DETAIL = process.env["VITE_MODEL_SHOW_ALARM_DETAIL"] === "true"
export default function AlarmInfo(props: IProps) {
  const { onClickbtn, isShowModel, children, setRefresh } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("1") // 0:不展示 1：弹框 2：条数
  const timer = useRef(null)
  const [isJump, setIsJump] = useState(false)
  const shieldType = useRef({
    SYZZZ: [15],
    otherType: [3],
  })
  const [customModal, setCustomModalModal] = useState(false)
  const audioPlayType = useRef([1, 2, 10, 11, 12, 13, 14])
  const setGlobalValue = useSetAtom(alarmInfoSetAtom)
  const setAlarmAudioValue = useSetAtom(alarmAudioSetAtom)
  // 实时告警
  const [alarmMqttData, setAlarmMqttData] = useState<IAlarmMqttInfo>()
  useMqttAlarm({ setAlarmMqttData })
  // 自定义告警
  const [customAlarmMqttData, setCustomAlarmMqttData] = useState(null)
  useMqttCustomAlarm({ setAlarmMqttData: setCustomAlarmMqttData })
  const navigate = useNavigate()
  useEffect(() => {
    if (alarmMqttData?.alarmMessages) {
      const actAlarmData = JSON.parse(JSON.stringify(alarmMqttData))
      // 声音
      const audioPlayList = actAlarmData.alarmMessages?.filter((i) => i.sound)
      setAlarmAudioValue({
        alarmInfo: audioPlayList,
      })
      // 弹框
      // 如果有任意 `popup: 2`，则关闭弹窗
      const shouldClosePopup = actAlarmData.alarmMessages.some(
        (msg) => msg.popup === 2
      );
      if (shouldClosePopup) {
        setIsModalOpen(false);
      }
      actAlarmData.alarmMessages = actAlarmData.alarmMessages.filter((i) => i.popup === 1)
      if (!actAlarmData.alarmMessages.length) return
      clearTimeout(timer.current)
      // close()
      setGlobalValue({
        alarmInfo: actAlarmData,
        call: (isErr: boolean) => {
          if (!isErr) return
          onClickbtn.current("virtualAlarm", true)
          setRefresh(`open${Date.now()}`)
          openNotification()
        },
      })
    }
    return () => clearTimeout(timer.current)
  }, [alarmMqttData])
  useEffect(() => {
    if (customAlarmMqttData && customModal) {
      const sound = {
        ...customAlarmMqttData,
        deviceDesc: customAlarmMqttData.deviceName,
        stationDesc: customAlarmMqttData.stationName,
      }
      setAlarmAudioValue({
        alarmInfo: [sound],
      })
      onClickbtn.current("virtualAlarm", true)
      setRefresh(`open${Date.now()}`)
      setIsModalOpen(true)
    }
  }, [customAlarmMqttData])
  const dialogInfo = useMemo(() => {
    const info = {
      realtime_alarm: modalMode === "1",
      custom_alarm: customModal,
    }
    console.log(info)

    return info
  }, [modalMode, customModal])

  const alIfComf = useRef(async (type: "ok" | "close") => {
    if (type === "close") {
      onClickbtn.current("virtualAlarm", false)
      setRefresh(`open${Date.now()}`)
      setIsModalOpen(false)
    }
  })

  const close = () => {
    setIsModalOpen(false)
    onClickbtn.current("virtualAlarm", false)
    setRefresh(`open${Date.now()}`)
  }
  const openNotification = () => {
    const AlarmListStorage = getStorage(StorageAlarmList)
    if ((modalMode === "1" || modalMode === "2") && AlarmListStorage.alarmMessages) {
      setIsModalOpen(true)
      return
    }
  }
  const getModalMode = async () => {
    const res = await doBaseServer("queryMngStatic", { key: "dialog" })
    const res1 = await doBaseServer("queryMngStatic", { key: "custom_dialog" })
    // if (validResErr(res) || validResErr(res1)) return
    setCustomModalModal(res1?.data === "1")
    setModalMode(res?.data || "1")
  }
  const getShieldType = async () => {
    const res = await doBaseServer("queryMngStatic", { key: "shield" })
    if (validResErr(res) || !res?.data) return
    try {
      const { playType, modalShieldType } = JSON.parse(res?.data)
      shieldType.current = modalShieldType
      audioPlayType.current = playType
    } catch (e) {}
  }
  const getSyzzzJump = async () => {
    const res = await doBaseServer("queryMngStatic", { key: "SYZZZ_jump" })
    if (validResErr(res) || !res?.data) return
    setIsJump(JSON.parse(res?.data))
  }
  useEffect(() => {
    getModalMode()
    getShieldType()
    getSyzzzJump()
  }, [])
  useEffect(() => {
    // 点击弹出告警弹框,先隐藏
    // const AlarmListStorage = getStorage(StorageAlarmList)
    // if (isShowModel) {
    //   if (!AlarmListStorage || !AlarmListStorage.alarmMessages?.length) {
    //     showMsg("暂无告警信息")
    //     onClickbtn.current("virtualAlarm", false)
    //     setRefresh(`open${Date.now()}`)
    //     return
    //   }
    //   openNotification()
    // } else {
    //   close()
    // }
    // 跳转至实时告警页面
    if (isShowModel) {
      // navigate("/alarm/realtime")
      onClickbtn.current("virtualAlarm", false)
      setRefresh(`open${Date.now()}`)
    }
  }, [isShowModel])
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
      {children}
      {isModalOpen && (modalMode === "1" || customModal) ? (
        <AlarmDetail
          isJump={isJump}
          buttonClick={alIfComf.current}
          customRealtimeData={customAlarmMqttData}
          dialogInfo={dialogInfo}
        />
      ) : (
        ""
      )}
      {isModalOpen && modalMode === "2" ? <AlarmBoxCount /> : ""}
      <AlarmShutdownDetail realtimeData={customAlarmMqttData} />
    </ConfigProvider>
  )
}
