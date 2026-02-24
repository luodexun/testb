/*
 * @Author: chenmeifeng
 * @Date: 2025-04-17 16:14:04
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-22 15:54:15
 * @Description: 告警声音\弹框配置
 */
import "./index.less"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ALARM_AUDIO_SETTING, ALARM_AUDIO_STHEADER } from "./config"
import { Button, Radio, Switch } from "antd"
import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"
interface IData {
  alarmLevelId: number
  alarmLevelName: string
  sound: number
  siren: number
  popup: number
}
export default function AlarmAudioSetting(props) {
  const [dataSource, setDataSource] = useState<IData[]>([])
  const [loading, setLoading] = useState(false)
  const [sharedFlag, setSharedFlag] = useState(1)
  const onChange = (val, chgType, level) => {
    setDataSource((prev) => {
      const info = prev.find((i) => i.alarmLevelId === level)
      info[chgType] = val
      return [...prev]
    })
  }
  const initData = async () => {
    const res = await doBaseServer("queryBroadcastConfig")
    const res1 = await doBaseServer("queryIsAlarm")
    if (validResErr(res)) return
    setDataSource(res)
    setSharedFlag(res1?.enable)
  }
  const getCheckVals = useCallback(
    (key, levelId) => {
      return dataSource.find((i) => i.alarmLevelId === levelId)?.[key]
    },
    [dataSource],
  )
  const confirm = async () => {
    setLoading(true)
    const data = dataSource?.map((i) => {
      return {
        alarmLevelId: i.alarmLevelId,
        alarmLevelName: i.alarmLevelName,
        popup: i.popup ? 1 : 0,
        siren: i.siren ? 1 : 0,
        sound: i.sound ? 1 : 0,
      }
    })
    await doBaseServer("updateBroadcastConfig", data)
    const params = {
      enable: sharedFlag,
    }
    await doBaseServer("updateIsAlarm", params)
    setLoading(false)
    initData()
  }
  const changeFlag = (e) => {
    setSharedFlag(e?.target?.value)
  }
  useEffect(() => {
    // effect logic
    initData()
  }, [])
  return (
    <div className="alarm-ad">
      <div>
        <div className="alarm-ad-header">
          {ALARM_AUDIO_STHEADER?.map((i) => {
            return (
              <span className="header-col" key={i.value}>
                {i.name}
              </span>
            )
          })}
        </div>
        <div className="alarm-ad-content">
          {ALARM_AUDIO_SETTING?.map((i) => {
            return (
              <div className="content-item" key={i.levelKey}>
                <div className="type">{i.name}</div>
                <div className="content-item-right">
                  {i.children?.map((child) => {
                    return (
                      <div className="item-row" key={child.levelKey}>
                        <span className="item">{child.name}</span>
                        <div className="item">
                          <Switch
                            checked={getCheckVals("siren", child.levelKey)}
                            onClick={(e) => onChange(e, "siren", child.levelKey)}
                            disabled={child.disabled}
                          />
                        </div>
                        <div className="item">
                          <Switch
                            checked={getCheckVals("sound", child.levelKey)}
                            onClick={(e) => onChange(e, "sound", child.levelKey)}
                            disabled={child.disabled}
                          />
                        </div>
                        <div className="item">
                          <Switch
                            checked={getCheckVals("popup", child.levelKey)}
                            onClick={(e) => onChange(e, "popup", child.levelKey)}
                            disabled={child.disabled}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <span>EAM挂牌关闭实时告警：</span>
        <Radio.Group
          value={sharedFlag}
          onChange={changeFlag}
          options={[
            { value: "1", label: "启用" },
            { value: "0", label: "停用" },
          ]}
        />
      </div>
      <div className="alarm-btn">
        <Button loading={loading} onClick={confirm}>
          确认修改
        </Button>
      </div>
    </div>
  )
}
