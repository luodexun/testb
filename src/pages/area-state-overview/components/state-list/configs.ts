/*
 * @Author: chenmeifeng
 * @Date: 2024-01-11 15:50:48
 * @LastEditors: xiongman
 * @LastEditTime: 2024-03-19 16:28:35
 * @Description:
 */

export const wtStateList = [
  {
    name: "正常发电",
    key: "normal",
    color: "#26CC26",
    bgcolor: "rgba(38,204,38,0.38)",
    childrenColor: "rgba(38,204,38,0.3)",
    children: [{ name: "正常运行", key: "normalRun", code: "1" }],
  },
  {
    name: "限功率",
    key: "limitPower",
    color: "#B932FB",
    bgcolor: "rgba(38,204,38,0.38)",
    childrenColor: "rgba(185,50,251,0.3)",
    children: [
      { name: "电网限功率", key: "elecLimit", code: "2" },
      { name: "主控限功率", key: "controlLimit", code: "3" },
      { name: "手动限功率", key: "handLimit", code: "4" },
      { name: "结冰限功率", key: "4", code: "5" },
    ],
  },
  {
    name: "待机",
    key: "Standby",
    color: "#4BD4FF",
    bgcolor: "rgba(38,204,38,0.38)",
    childrenColor: "rgba(75,212,255,0.3)",
    children: [
      { name: "小风待机", key: "1", code: "6" },
      { name: "大风切出", key: "2", code: "7" },
      { name: "温度低待机", key: "3", code: "8" },
      { name: "温度高切出", key: "4", code: "9" },
      { name: "技术性待机", key: "5", code: "10" },
    ],
  },
  {
    name: "主动停机",
    key: "halt",
    color: "#FF8800",
    bgcolor: "rgba(38,204,38,0.38)",
    childrenColor: "rgba(255,136,0,0.3)",
    children: [
      { name: "检修停机", key: "1", code: "11" },
      { name: "其他停机", key: "2", code: "12" },
    ],
  },
  {
    name: "故障停机",
    key: "fault",
    color: "#FF0000",
    bgcolor: "rgba(38,204,38,0.38)",
    childrenColor: "rgba(255,29,29,0.3)",
    children: [{ name: "故障停机", key: "1", code: "13" }],
  },
  {
    name: "无通讯",
    key: "ucomloss",
    color: "#D9D9D9",
    bgcolor: "rgba(38,204,38,0.38)",
    childrenColor: "rgba(217,217,217,0.3)",
    children: [{ name: "无通讯", key: "1", code: "14" }],
  },
]

// 旧标准
// export const wtStateList = [
//   {
//     name: "正常发电",
//     key: "normal",
//     color: "#26CC26",
//     bgcolor: "rgba(38,204,38,0.38)",
//     childrenColor: "rgba(38,204,38,0.3)",
//     children: [{ name: "正常运行", key: "normalRun", code: "1" }],
//   },
//   {
//     name: "限功率",
//     key: "limitPower",
//     color: "#FF8800",
//     bgcolor: "rgba(38,204,38,0.38)",
//     childrenColor: "rgba(255,136,0,0.3)",
//     children: [
//       { name: "电网限功率运行", key: "elecLimit", code: "2" },
//       { name: "主控限功率运行", key: "controlLimit", code: "3" },
//       { name: "手动限功率运行", key: "handLimit", code: "4" },
//     ],
//   },
//   {
//     name: "待机",
//     key: "Standby",
//     color: "#4BD4FF",
//     bgcolor: "rgba(38,204,38,0.38)",
//     childrenColor: "rgba(75,212,255,0.3)",
//     children: [
//       { name: "小风待机", key: "1", code: "5" },
//       { name: "技术待命", key: "2", code: "6" },
//     ],
//   },
//   {
//     name: "停机",
//     key: "halt",
//     color: "#FF0000",
//     bgcolor: "rgba(38,204,38,0.38)",
//     childrenColor: "rgba(255,29,29,0.3)",
//     children: [
//       { name: "电网限功率停机", key: "1", code: "7" },
//       { name: "远程停机", key: "2", code: "8" },
//       { name: "天气停机", key: "3", code: "9" },
//       { name: "就地停机", key: "4", code: "10" },
//       { name: "风机故障停机", key: "5", code: "11" },
//       { name: "维护停机", key: "6", code: "12" },
//       { name: "电网故障停机", key: "7", code: "13" },
//     ],
//   },
//   {
//     name: "通讯中断",
//     key: "comloss",
//     color: "#D9D9D9",
//     bgcolor: "rgba(38,204,38,0.38)",
//     childrenColor: "rgba(217,217,217,0.3)",
//     children: [{ name: "通讯中断", key: "1", code: "14" }],
//   },
//   {
//     name: "未知状态",
//     key: "unknown",
//     color: "#B932FB",
//     bgcolor: "rgba(38,204,38,0.38)",
//     childrenColor: "rgba(185,50,251,0.3)",
//     children: [{ name: "未知状态", key: "1", code: "15" }],
//   },
// ]
