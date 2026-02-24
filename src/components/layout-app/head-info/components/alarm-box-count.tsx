/*
 * @Author: chenmeifeng
 * @Date: 2024-05-06 17:47:39
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-17 16:41:39
 * @Description: 告警弹框-显示数量盒子
 */
import "./alarm-box-count.less"

import Draggable from "draggable"
import { useAtomValue } from "jotai"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { doBaseServer } from "@/api/serve-funs"
import { StorageAlarmLevels, StorageOtherMsg } from "@/configs/storage-cfg"
import { alarmInfoAtom } from "@/store/atom-alarm"
import { getStorage, setStorage, validResErr } from "@/utils/util-funs"

export default function AlarmBoxCount() {
  const alarmDetailRef = useRef()
  const [alarmLvLs, setAlarmLvLs] = useState([])
  const alarmInfo = useAtomValue(alarmInfoAtom)
  const [curOneAlarmInfo, setCurOneAlarmInfo] = useState(null)
  const timeoutRef = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    if (alarmInfo?.alarmCounts) {
      // console.log(alarmInfo, "alarmInfo?.alarmCounts")
      const allCount = {
        ...alarmInfo?.alarmCounts?.alarmLevelCount,
        9999: alarmInfo?.alarmCounts?.total,
      }
      setCurOneAlarmInfo(allCount)
    }
  }, [alarmInfo])
  const getAlarmLevel = async () => {
    const storageLv = getStorage(StorageAlarmLevels)
    let lv = []
    if (storageLv?.length) {
      lv = storageLv?.filter((i) => i.id !== 3 && i.id !== 15)
    } else {
      const res = await doBaseServer("getAllAlarmLevel")
      if (validResErr(res)) return
      lv = res
      setStorage(res, StorageAlarmLevels)
    }
    const totalOne = [{ id: 9999, name: "全部" }]
    setAlarmLvLs([...totalOne.concat(lv)])
  }
  const toRealPage = useRef((item) => {
    if (item.id === 9999) {
      navigate("/alarm/realtime-two")
      return
    }
    const params = [
      {
        code: item?.id?.toString(),
        name: item?.name,
        dataIndex: item?.id?.toString(),
        key: "level",
        num: 0,
      },
    ]
    setStorage(JSON.stringify(params), StorageOtherMsg)
    navigate("/alarm/realtime-two")
  })
  useEffect(() => {
    getAlarmLevel()
    timeoutRef.current = setTimeout(() => {
      alarmDetailRef.current ? new Draggable(alarmDetailRef.current) : ""
    }, 100)
    return () => clearTimeout(timeoutRef.current)
  }, [])
  return (
    <div ref={alarmDetailRef} className="alm-ctbox">
      <div className="alm-ctbox-list">
        {alarmLvLs?.map((i) => {
          return (
            <div key={i?.id || 999} className={`alm-ctbox-item alarm-${i?.id}`}>
              <span onClick={toRealPage.current.bind(null, i)}>
                {i?.name}:{curOneAlarmInfo?.[i?.id] || 0}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
