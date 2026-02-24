/*
 * @Author: chenmeifeng
 * @Date: 2024-02-20 13:50:31
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-15 16:50:40
 * @Description:
 */
const testjson = {
  companyInfo: {
    title: "公司简介",
    content:
      "华润电力广西公司是华润电力下属核心区域公司，是华润电力唯一覆盖火电、风电、光伏、生物质、电化学储能、分布式能源、配售电、综合能源服务等领域的平台化区域公司，业务遍及全广西，旗下两台百万千瓦火电机组是贺州华润循环经济产业示范区（国家级循环经济示范区）的龙头企业，是国家高新技术企业、国家重点研发计划《电力企业社会责任实施指南》标准研制单位、广西优秀企业、广西百强企业。",
  },
  siteInfo: {
    siteList: [
      {
        id: 1,
        value: "110.0758,22.422",
        name: "杨村",
        type: "WT",
        tooltipContent: {
          num: 43,
          capacity: 8.6,
          power: 4671.05,
        },
      },
      {
        id: 2,
        value: "109.8434,22.0316",
        name: "隆润",
        type: "WT",
        tooltipContent: {
          num: 41,
          capacity: 9.02,
          power: 6264.32,
        },
      },
      {
        id: 3,
        value: "109.508,22.3042",
        name: "福绵",
        type: "WT",
        tooltipContent: {
          num: 34,
          capacity: 8.4,
          power: 5301.70,
        },
      },
      {
        id: 4,
        value: "108.319572,22.839652",
        name: "界牌",
        type: "WT",
        tooltipContent: {
          num: 8,
          capacity: 2,
          power: 1168.13,
        },
      },
      {
        id: 5,
        value: "107.132499,23.60313",
        name: "润佳",
        type: "WT",
        tooltipContent: {
          num: 25,
          capacity: 10,
          power: 2861.8,
        },
      },
      {
        id: 6,
        value: "109.7057,23.873302",
        name: "润南",
        type: "WT",
        tooltipContent: {
          num: 20,
          capacity: 5,
          power: 3416.35,
        },
      },
      {
        id: 7,
        value: "111.27011,23.70266",
        name: "润堡",
        type: "WT",
        tooltipContent: {
          num: 31,
          capacity: 10,
          power: 4948.30,
        },
      },
      {
        id: 8,
        value: "110.5002,22.592915",
        name: "新润",
        type: "WT",
        tooltipContent: {
          num: 13,
          capacity: 7,
          power: 2715.36,
        },
      },
      {
        id: 9,
        value: "108.214188,23.431784",
        name: "俞霖光伏",
        type: "PVINV",
        tooltipContent: {
          num: 56,
          capacity: 16.97,
          power: 2825.3,
        },
      },
      {
        id: 10,
        value: "111.03486166,23.16743",
        name: "润泽",
        type: "WT",
        tooltipContent: {
          num: 1,
          capacity: 0.556,
          power: 1.14,
        },
      },
      {
        id: 11,
        value: "109.2630,23.3238",
        name: "沐恩",
        type: "WT",
        tooltipContent: {
          num: 12,
          capacity: 5,
          power: 2255.47,
        },
      },
      {
        id: 12,
        value: "111.38432,24.74332",
        name: "牛霄岭光伏",
        type: "PVINV",
        tooltipContent: {
          num: 146,
          capacity: 3.285,
          power: 461.11,
        },
      },
      {
        id: 13,
        value: "110.3919,23.2624",
        name: "春笋储能",
        type: "ESPCS",
        tooltipContent: {
          num: 32,
          capacity: "10.1/20.2 台",
          power: 1079.76,
        },
      },
      {
        id: 14,
        value: "110.8034,24.1061",
        name: "鸿润",
        type: "WT",
        tooltipContent: {
          num: 18,
          capacity: 8,
          power: 4243.91,
        },
      },
      {
        id: 15,
        value: "111.35479,24.30530",
        name: "贺州火电",
        type: "FIRE",
        tooltipContent: {
          num: 2,
          capacity: 209,
          power: 156000,
        },
      },
    ],
    tooltipContent: [
      { id: 1, key: "num", name: "装机台数", unit: "台" },
      { id: 2, key: "capacity", name: "装机容量", unit: "万kW" },
      { id: 3, key: "power", name: "总发电量", unit: "万kWh" },
    ],
  },
  quotaList: [
    { id: 1, type: "5", name: "电站数量", value: 15, unit: "个" },
    { id: 2, type: "3", name: "年发电量", value: 196846.43, unit: "万kWh" },
    { id: 3, type: "4", name: "火电机组", value: 2, unit: "台" },
    { id: 4, type: "3", name: "火电并网容量", value: 209, unit: "万kW" },
    { id: 5, type: "2", name: "火电年累利用小时", value: 746, unit: "h" },
    { id: 6, type: "4", name: "风机台数", value: 245, unit: "台" },
    { id: 7, type: "4", name: "逆变器台数", value: 202, unit: "台" },
    { id: 8, type: "4", name: "储能单元", value: 32, unit: "台" },
    { id: 9, type: "3", name: "新能源并网容量", value: 100.11, unit: "万kW" },
    { id: 10, type: "2", name: "风电年累利用小时", value: 560, unit: "h" },
    { id: 11, type: "2", name: "光伏年累利用小时", value: 162, unit: "h" },
    { id: 12, type: "1", name: "年减排CO₂", value: 408464, unit: "吨" },
  ],
  quotaType: [
    { value: "1", label: "减排量" },
    { value: "2", label: "时长" },
    { value: "3", label: "电量" },
    { value: "4", label: "台数" },
    { value: "5", label: "数量" },
  ],
}
const changeJson = (key, json) => {
  testjson[key] = json
}
const screenList = [
  { label: "大屏1", key: "gxscreen" },
  { label: "大屏2", key: "gxscreen2" },
]
export { changeJson, screenList, testjson }
