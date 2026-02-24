/*
 * @Author: chenmeifeng
 * @Date: 2025-04-17 15:46:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-17 15:54:14
 * @Description:
 */
export const ALARM_AUDIO_SETTING = [
  {
    name: "发电设备",
    levelKey: "发电设备",
    children: [
      { name: "故障", levelKey: 1 },
      { name: "重要告警", levelKey: 2 },
      { name: "一般告警", levelKey: 4, disabled: true },
      { name: "提示", levelKey: 3, disabled: true },
    ],
  },
  {
    name: "综自设备",
    levelKey: "综自设备",
    children: [
      { name: "事故", levelKey: 11 },
      { name: "异常", levelKey: 12 },
      { name: "越限", levelKey: 13 },
      { name: "变位", levelKey: 14 },
      { name: "告知", levelKey: 15, disabled: true },
    ],
  },
]

export const ALARM_AUDIO_STHEADER = [
  { name: "设备类型", value: "type" },
  { name: "告警等级", value: "level" },
  { name: "警笛", value: "didi" },
  { name: "声音", value: "audio" },
  { name: "弹窗", value: "modal" },
]
