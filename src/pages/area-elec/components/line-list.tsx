/*
 * @Author: chenmeifeng
 * @Date: 2024-01-05 11:01:48
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-12 14:58:02
 * @Description:
 */
import "./line-list.less"

import { Tooltip } from "antd"
import classnames from "classnames"
import { useCallback, useContext, useMemo, useRef, useState } from "react"

import AlarmConfirmModel, { IOperateProps, IPerateRef } from "@/components/alarm-confirm-model"
// import CustomModal from "@/components/custom-modal"
import AreaElecContext from "@/contexts/area-elec-context"
// import { bacthPass } from "@/pages/alarm-history/methods"

import { getRealtimeAlarm } from "../methods"
import { IEleOverviewInfo } from "../types"
import { bacthPass } from "@/utils/device-funs"

interface IProps {
  lineData: IEleOverviewInfo[]
  align?: "center" | "right" | "left"
}
export default function LineList(props: IProps) {
  const { lineData, align = "left" } = props
  const textAlign = useRef(align)
  const modeRef = useRef(null)
  const { isHideMode, bianAlarmList, setBianAlarmList, currentPiontInfo, setCurrentPiontInfo, setIsClick } =
    useContext(AreaElecContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [overlayStyle, setOverlayStyle] = useState(null)
  const curData = useRef(null)
  // 显示数据逻辑：bianAlarmList存在时，判断每条数据pointName字段是否和bianAlarmList中的alarmId/stationCode相等，存在就设dodge为true； 当isHideMode为true时，隐藏带pointDesc字段有备的数据
  const actualShowData = useMemo<IEleOverviewInfo[]>(() => {
    if (!lineData?.length) return []
    const res = bianAlarmList?.length
      ? lineData.map((i) => {
          const existAlarm = bianAlarmList.find(
            (alarm) => alarm.alarmId === i.pointName && alarm.stationCode === i.stationCode,
          )
          return {
            ...i,
            dodge: existAlarm ? true : false,
          }
        })
      : lineData
    if (isHideMode) {
      return res?.filter((i) => i.pointDesc?.indexOf("备") === -1)
    }

    return res
  }, [isHideMode, lineData, bianAlarmList])

  const getLastNumber = (str) => {
    if (!str) return "-"
    const regex = /[A-Za-z0-9]+/g
    const regex1 = /^[A-Za-z]+$/
    const matches = str.match(regex)
    let newMatches = []
    matches?.forEach((i) => {
      if (!regex1.test(i)) newMatches.push(i)
    })
    return newMatches?.[newMatches?.length - 1]
  }

  const btnClkRef = useCallback(
    async (type, msg) => {
      if (type === "ok") {
        const alarmInfo = bianAlarmList.filter((i) => i.alarmId === curData.current?.pointName)
        await bacthPass(alarmInfo, msg)
        const realAlarmList = await getRealtimeAlarm()
        setIsModalOpen(false)
        if (realAlarmList) {
          setBianAlarmList(realAlarmList)
        }
      }
    },
    [bianAlarmList],
  )
  const clickIcon = useCallback((info) => {
    if (info.dodge) {
      // curData.current = info
      // setIsModalOpen(true)
      setIsClick(true)
    }
  }, [])
  const mouseLeaveRef = useRef((e, info) => {
    setCurrentPiontInfo(null)
  })
  const mouseEnterRef = useRef((e, info) => {
    setCurrentPiontInfo(info)
    const position = {}
    e.clientY < 300 ? (position["bottom"] = "-1.5em") : (position["top"] = "-1.5em")
    setOverlayStyle(position)
  })
  return (
    <div className="line-list" style={{ justifyContent: textAlign.current }}>
      {actualShowData?.map((i) => {
        return (
          <div
            key={i.pointName + i.stationCode}
            className="line-list-item"
            onMouseLeave={(e) => mouseLeaveRef.current(e, i)}
            onMouseEnter={(e) => mouseEnterRef.current(e, i)}
          >
            {currentPiontInfo?.pointName === i.pointName && currentPiontInfo?.stationCode === i.stationCode ? (
              <span className="tooltip-name" style={overlayStyle}>
                {i.pointDesc}
              </span>
            ) : (
              ""
            )}
            {/* <Tooltip title={i.pointDesc} className="tooltip-item"> */}
            <div
              className={classnames("wai-icon", {
                offline: i.handcartValue === "true" && i.handcartDesc,
                grey: !i.handcartValue && i.handcartDesc,
                noBackground: !i.handcartDesc,
              })}
              // className={classnames("wai-icon", { offline: i.handcartValue === "true", grey: !i.handcartValue })}
              onClick={() => clickIcon(i)}
            >
              <span className={classnames("icon", { offline: i.value === "true", grey: !i.value, shang: i.dodge })} />
            </div>
            {/* <span className={classnames("icon", { offline: i.value === "true" })} /> */}
            <span className="line-item-name">{getLastNumber(i.pointDesc)}</span>
            {/* </Tooltip> */}
          </div>
        )
      })}
      {/* <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="30%"
        title="确认备注"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={AlarmConfirmModel}
        componentProps={{ buttonClick: btnClkRef }}
      /> */}
    </div>
  )
}
