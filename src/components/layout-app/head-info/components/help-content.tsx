/*
 * @Author: chenmeifeng
 * @Date: 2023-11-20 16:06:30
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-30 10:57:25
 * @Description:
 */
import "./help-content.less"
import hh from "@/assets/header/hh.png"
import hl from "@/assets/header/hl.png"
import ll from "@/assets/header/ll.png"
import lh from "@/assets/header/lh.png"
import gg from "@/assets/header/gg.png"
import { Button, Table, Tabs } from "antd"
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react"

import {
  ES_TABLE_CONTENT_LIST,
  ES_VERSION_LIST,
  helpMenu,
  PV_TABLE_CONTENT_LIST,
  PV_VERSION_LIST,
  WT_TABLE_CONTENT_LIST,
  WT_VERSION_LIST,
  OV_HELP,
} from "./help-configs"
import AlarmAudioSetting from "@/components/alarm-audio-setting"
const imgList = { hh, hl, lh, ll, gg }
const ElecOvHlep = () => {
  return (
    <div className="help-ov-list">
      <p>通过外环和内心分别表示手车和断路器状态：</p>
      <div className="help-ov-list-item">
        {OV_HELP.map((i, idx) => {
          return (
            <p key={i.id} className="ov-i">
              {`(${idx + 1}) `}
              <img src={imgList[i.icon]} alt="" />
              <span className="ov-text">{i.text}</span>
            </p>
          )
        })}
      </div>
    </div>
  )
}
const Version = () => {
  return (
    <div className="help-version-list">
      <div className="help-version-time">2025-12-05</div>
      <div className="help-version-time">系统用户手册二维码（打开润工作扫码）:</div>
      <i className="help-img"></i>
    </div>
  )
}

const AUDIO_SRC = `${process.env.VITE_API_HOST}`
const AUDIO_SRC_PORT = `${process.env.VITE_API_PORT}`
const TestAudio = () => {
  const audioRef = useRef(null)
  const test = () => {
    // audioRef.current.src = `${AUDIO_SRC}:${AUDIO_SRC_PORT}/static/alarmAudio/WT.mp3`
    audioRef.current.src = `${AUDIO_SRC}/static/alarmAudio/WT.mp3`
    audioRef.current?.play()
  }
  return (
    <div className="help-version-list">
      <audio ref={audioRef} src="" />
      <Button size="small" onClick={test}>
        点击测试声音
      </Button>
    </div>
  )
}
const Seation = ({ type }) => {
  const tableColunms = useMemo(() => {
    return type === "wt" ? WT_TABLE_CONTENT_LIST : type === "pv" ? PV_TABLE_CONTENT_LIST : ES_TABLE_CONTENT_LIST
  }, [type])
  const dataSource = useMemo(() => {
    return type === "wt" ? WT_VERSION_LIST : type === "pv" ? PV_VERSION_LIST : ES_VERSION_LIST
  }, [type])
  return (
    <div className="help-version-list">
      <Table columns={tableColunms} rowKey="state" dataSource={dataSource} bordered pagination={false} />
    </div>
  )
}

const HelpContent = forwardRef<any, any>((props, ref) => {
  const { tabCurrentKey = "version" } = props
  const [activeKey, setactiveKey] = useState(tabCurrentKey)
  useImperativeHandle(ref, () => ({}))
  return (
    <div>
      <Tabs
        className="help-tabs"
        tabPosition="left"
        activeKey={activeKey}
        onTabClick={(key) => setactiveKey(key)}
        items={helpMenu.map((item) => {
          return {
            label: item.name,
            key: item.key,
            children:
              item.key === "version" ? (
                <Version />
              ) : item.key === "elec" ? (
                <ElecOvHlep />
              ) : item.key === "audio" ? (
                <TestAudio />
              ) : item.key === "alarm_setting" ? (
                <AlarmAudioSetting />
              ) : (
                <Seation type={item.type} />
              ),
          }
        })}
      />
    </div>
  )
})
export default HelpContent
