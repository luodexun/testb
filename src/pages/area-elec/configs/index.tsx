/*
 * @Author: xiongman
 * @Date: 2023-09-06 12:12:46
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-25 16:06:34
 * @Description:
 */

import BreakerGroup from "@pages/area-elec/components/breaker-group.tsx"
import { IBreakerItem, TEleOverviewDataAct, TEleOverviewTableData } from "@pages/area-elec/types"
import { ColumnsType } from "antd/es/table"

import LineList from "../components/line-list"
import StatinNameText from "../components/station-name"
import { getElecColumnForDemand, toNumberStr } from "../methods"
// import TextList from "../components/text-list"

export const AREA_ELEC_COLUMNS_TEST: ColumnsType<TEleOverviewTableData> = [
  { dataIndex: "stationName", title: "场站", width: 200 },
  {
    dataIndex: "breakerList",
    title: "测点信息",
    render: (value: IBreakerItem[]) => <BreakerGroup breakerList={value} />,
  },
]

export const AREA_ELEC_COLUMNS = (city) => {
  const songchu_line = getElecColumnForDemand(city)?.["401"]
  const zhubian_high = getElecColumnForDemand(city)?.["402"]
  const mother_line = getElecColumnForDemand(city)?.["407"]
  const capacitance =
    city === "jsscreen"
      ? [
          {
            dataIndex: "411",
            title: "SVG",
            width: 70,
            align: "center",
            render: (_, record) => <LineList align="center" lineData={record.breakerList["411"]} />,
          },
        ]
      : [
          {
            dataIndex: "411",
            title: "SVG",
            width: 120,
            align: "center",
            render: (_, record) => <LineList lineData={record.breakerList["411"]} />,
          },
          {
            dataIndex: "412",
            title: "电容器",
            width: 150,
            align: "center",
            render: (_, record) => <LineList lineData={record.breakerList["412"]} />,
          },
        ]
  return [
    {
      dataIndex: "stationName",
      title: "场站",
      width: 80,
      align: "center",
      // render: (text, record) => (
      //   <Link to={`/site/${getStationMainId(record)}/${record.stationCode}/boost`}>
      //     <span style={{ color: "var(--deep-font-color)" }}>{text}</span>
      //   </Link>
      // ),
      render: (text, record) => <StatinNameText text={text} record={record} />,
    },
    {
      dataIndex: "401",
      title: "送出线路",
      width: 180,
      align: "center",
      children: songchu_line || [
        {
          dataIndex: "401",
          title: "Ia(A)",
          width: 70,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["401"]?.find(
              (i) => i.pointType === "2" && i.pointName === "CX_PhaseACurrent",
            )?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
        {
          dataIndex: "Uab",
          title: "U(kV)",
          width: 70,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["401"]?.find(
              (i) => i.pointType === "2" && i.pointName === "CX_ABLineVoltage",
            )?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
        {
          dataIndex: "P",
          title: "P(MW)",
          width: 70,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["401"]?.find(
              (i) => i.pointType === "2" && i.pointName === "CX_ActivePower",
            )?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
        {
          dataIndex: "Q",
          title: "Q(MVar)",
          width: 80,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["401"]?.find(
              (i) => i.pointType === "2" && i.pointName === "CX_ReactivePower",
            )?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
        {
          dataIndex: "Cos",
          title: "Cos",
          width: 50,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["401"]?.find((i) => i.pointType === "2" && i.pointName === "CX_PF")?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
        {
          dataIndex: "401",
          title: "遥信",
          width: city === "jsscreen" ? 70 : 50,
          align: "center",
          render: (_, record) => <LineList lineData={record.breakerList["401"]?.filter((i) => i.pointType === "1")} />,
        },
      ],
    },
    {
      dataIndex: "402",
      title: "主变高压侧",
      width: 180,
      align: "center",
      children: zhubian_high || [
        {
          dataIndex: "P",
          title: (
            <div>
              P<sub>Ⅰ主</sub>
              <div>(MW)</div>
            </div>
          ),
          width: 60,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["402"]?.find(
              (i) => i.pointType === "2" && i.pointName === "HV1_ActivePower",
            )?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
        {
          dataIndex: "P",
          title: (
            <div>
              P<sub>Ⅱ主</sub>
              <div>(MW)</div>
            </div>
          ),
          width: 60,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["402"]?.find(
              (i) => i.pointType === "2" && i.pointName === "HV2_ActivePower",
            )?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
        {
          dataIndex: "402",
          title: "遥信",
          align: "center",
          width: 70,
          render: (_, record) => <LineList lineData={record.breakerList["402"]?.filter((i) => i.pointType === "1")} />,
        },
      ],
    },
    {
      dataIndex: "404",
      title: "主变低压侧",
      width: 100,
      align: "center",
      render: (_, record) => <LineList lineData={record.breakerList["404"]} />,
    },
    {
      dataIndex: "407",
      title: "35kV母线",
      width: 150,
      align: "center",
      children: mother_line || [
        {
          dataIndex: "Uab1",
          title: (
            <div>
              U<sub>Ⅰ母</sub>
              <div>(kV)</div>
            </div>
          ),
          width: 60,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["407"]?.find(
              (i) => i.pointType === "2" && i.pointName === "BUS1_ABLineVoltage",
            )?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
        {
          dataIndex: "Uab2",
          title: (
            <div>
              U<sub>Ⅱ母</sub>
              <div>(kV)</div>
            </div>
          ),
          width: 60,
          align: "center",
          render: (_, record) => {
            const info = record.breakerList["407"]?.find(
              (i) => i.pointType === "2" && i.pointName === "BUS2_ABLineVoltage",
            )?.value
            return <span>{toNumberStr(info, 1)}</span>
          },
        },
      ],
    },
    {
      dataIndex: "408",
      title: "集电线路",
      width: city === "jsscreen" ? 200 : 300,
      align: "center",
      render: (_, record) => <LineList lineData={record.breakerList["408"]} />,
    },
    {
      dataIndex: "409",
      title: "站用变",
      width: 70,
      align: "center",
      render: (_, record) => (
        <LineList align={city === "jsscreen" ? "center" : "left"} lineData={record.breakerList["409"]} />
      ),
    },
    {
      dataIndex: "410",
      title: "接地变",
      width: 70,
      align: "center",
      render: (_, record) => (
        <LineList align={city === "jsscreen" ? "center" : "left"} lineData={record.breakerList["410"]} />
      ),
    },
    ...capacitance,
  ] as ColumnsType<TEleOverviewDataAct>
}
export const COLUMNS_FOR_AREA = {
  nxscreen: {
    // 主变高压侧
    402: [
      {
        title: "PI主",
        width: 60,
        unit: "MW",
        pointName: "HV1_ActivePower",
        pointType: "2",
        mainName: "P",
        subName: "I主",
      },
      {
        title: "PII主",
        width: 60,
        unit: "MW",
        pointName: "HV2_ActivePower",
        pointType: "2",
        mainName: "P",
        subName: "II主",
      },
      {
        title: "PIII主",
        width: 60,
        unit: "MW",
        pointName: "HV3_ActivePower",
        pointType: "2",
        mainName: "P",
        subName: "III主",
      },
      { title: "遥信", width: 70, pointName: "", pointType: "1" },
    ],
    // 35kV母线
    407: [
      {
        title: "ui母",
        width: 60,
        unit: "kV",
        pointName: "BUS1_ABLineVoltage",
        pointType: "2",
        mainName: "U",
        subName: "I母",
      },
      {
        title: "uii母",
        width: 60,
        unit: "kV",
        pointName: "BUS2_ABLineVoltage",
        pointType: "2",
        mainName: "U",
        subName: "II母",
      },
      {
        title: "uiii母",
        width: 60,
        unit: "kV",
        pointName: "BUS3_ABLineVoltage",
        pointType: "2",
        mainName: "U",
        subName: "III母",
      },
      {
        title: "uiiii母",
        width: 60,
        pointName: "BUS4_ABLineVoltage",
        unit: "kV",
        pointType: "2",
        mainName: "U",
        subName: "IIII母",
      },
    ],
  },
  hbscreen: {
    // 送出线路
    401: [
      { title: "Ia", width: 60, pointName: "CX_PhaseACurrent", pointType: "2" },
      { title: "U", width: 60, pointName: "CX_ABLineVoltage", pointType: "2" },
      {
        title: (
          <div>
            P<sub>集</sub>
          </div>
        ),
        width: 60,
        pointName: "TheoreticalPower",
        pointType: "2",
      },
      {
        title: (
          <div>
            P<sub>可</sub>
          </div>
        ),
        width: 60,
        pointName: "AvailablePower",
        pointType: "2",
      },
      {
        title: "P",
        width: 60,
        pointName: "CX_ActivePower",
        pointType: "2",
      },
      {
        title: "Q",
        width: 60,
        pointName: "CX_ReactivePower",
        pointType: "2",
      },
      { title: "遥信", width: 70, pointName: "", pointType: "1" },
    ],
    402: [
      {
        title: (
          <div>
            P<sub>Ⅰ主</sub>
          </div>
        ),
        width: 60,
        pointName: "HV1_ActivePower",
        pointType: "2",
      },
      {
        title: (
          <div>
            P<sub>Ⅱ主</sub>
          </div>
        ),
        width: 60,
        pointName: "HV2_ActivePower",
        pointType: "2",
      },
    ],
    407: [
      {
        title: (
          <div>
            U<sub>Ⅰ母</sub>
          </div>
        ),
        width: 60,
        pointName: "BUS1_ABLineVoltage",
        pointType: "2",
      },
      {
        title: (
          <div>
            U<sub>Ⅱ母</sub>
          </div>
        ),
        width: 60,
        pointName: "BUS2_ABLineVoltage",
        pointType: "2",
      },
    ],
  },
  jsscreen: {
    407: [
      {
        title: "ui母",
        width: 60,
        unit: "kV",
        pointName: "BUS1_ABLineVoltage",
        pointType: "2",
        mainName: "U",
        subName: "I母",
      },
    ],
  },
}

export const HN_AREA_ELEC_COLUMNS: ColumnsType<any> = [
  {
    dataIndex: "stationName",
    title: "场站",
    width: 80,
    align: "center",
    // render: (text, record) => (
    //   <Link to={`/site/${getStationMainId(record)}/${record.stationCode}/boost`}>
    //     <span style={{ color: "var(--deep-font-color)" }}>{text}</span>
    //   </Link>
    // ),
    render: (text, record) => <StatinNameText text={text} record={record} />,
  },
  {
    dataIndex: "P",
    title: "P(MW)",
    width: 50,
    align: "center",
    render: (_, record) => {
      const info = record.breakerList["401"]?.find(
        (i) => i.pointType === "2" && i.pointName === "CX_ActivePower",
      )?.value
      return <span>{toNumberStr(info, 0)}</span>
    },
  },
  {
    dataIndex: "Uab",
    title: "U(kV)",
    width: 50,
    align: "center",
    render: (_, record) => {
      const info = record.breakerList["401"]?.find(
        (i) => i.pointType === "2" && i.pointName === "CX_ABLineVoltage",
      )?.value
      return <span>{toNumberStr(info, 1)}</span>
    },
  },
  {
    dataIndex: "401",
    title: "Ia(A)",
    width: 50,
    align: "center",
    render: (_, record) => {
      const info = record.breakerList["401"]?.find(
        (i) => i.pointType === "2" && i.pointName === "CX_PhaseACurrent",
      )?.value
      return <span>{toNumberStr(info, 1)}</span>
    },
  },
  {
    dataIndex: "401",
    title: "送出线路",
    width: 70,
    align: "center",
    render: (_, record) => (
      <LineList align="center" lineData={record.breakerList["401"]?.filter((i) => i.pointType === "1")} />
    ),
  },
  {
    dataIndex: "4051",
    title: "#1油温",
    width: 50,
    align: "center",
    render: (_, record) => {
      const info = record.breakerList["405"]?.find(
        (i) => i.pointType === "2" && i.pointName === "HV1_Group1OilTemperatureOfMainTransformer",
      )?.value
      return <span>{toNumberStr(info, 1)}</span>
    },
  },
  {
    dataIndex: "4052",
    title: "#2油温",
    width: 50,
    align: "center",
    render: (_, record) => {
      const info = record.breakerList["405"]?.find(
        (i) => i.pointType === "2" && i.pointName === "HV2_Group1OilTemperatureOfMainTransformer",
      )?.value
      return <span>{toNumberStr(info, 1)}</span>
    },
  },
  {
    dataIndex: "402",
    title: "主变高",
    align: "center",
    width: 70,
    render: (_, record) => (
      <LineList align="center" lineData={record.breakerList["402"]?.filter((i) => i.pointType === "1")} />
    ),
  },
  {
    dataIndex: "404",
    title: "主变低",
    width: 70,
    align: "center",
    render: (_, record) => <LineList align="center" lineData={record.breakerList["404"]} />,
  },
  {
    dataIndex: "408",
    title: "集电线路",
    width: 380,
    align: "center",
    render: (_, record) => <LineList align="center" lineData={record.breakerList["408"]} />,
  },
  {
    dataIndex: "411",
    title: "SVG",
    width: 90,
    align: "center",
    render: (_, record) => <LineList align="center" lineData={record.breakerList["411"]} />,
  },
  {
    dataIndex: "410",
    title: "接地变",
    width: 70,
    align: "center",
    render: (_, record) => <LineList align="center" lineData={record.breakerList["410"]} />,
  },
  {
    dataIndex: "409",
    title: "站用变",
    width: 70,
    align: "center",
    render: (_, record) => <LineList align="center" lineData={record.breakerList["409"]} />,
  },
]
