/*
 * @Author: xiongman
 * @Date: 2023-09-06 15:54:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-22 10:43:57
 * @Description:
 */
// AGVC个性化
import { Switch } from "antd"
import { ColumnsType } from "antd/es/table"
import { Link } from "react-router-dom"

import AGVC_ICON from "@/assets/device/icon.png"
import AGVC_ICON_RED from "@/assets/device/icon-red.png"
import MetricTag from "@/components/metric-tag"
import PointText from "@/components/trend-line-by-dvs/text"
import { IAgvcInfo } from "@/types/i-agvc.ts"
import { getStationMainId, judgeNull } from "@/utils/util-funs"

import { judgeIsXd } from "../methods"

function valuRender(value: number | boolean, unit: string, labelArr?: string[], colorArr = ["red", "green"]) {
  if (labelArr?.length) {
    const theVal = value ? 0 : 1 // true->0:投入\远方\闭锁\闭锁
    const isExit = value || value === false
    return <MetricTag value={isExit ? labelArr[theVal] : "-"} color={colorArr[theVal]} />
  }
  // return <MetricTag value={value || "-"} unit={unit} />
  return <MetricTag value={value || value === 0 ? value : "-"} unit={unit} />
}

// AGC 有功调节
export const AREA_AGVC_POWER_COLUMNS = (openCtl) => {
  const column: ColumnsType<any> = [
    // 隐藏限电图标改为列
    // {
    //   dataIndex: "type",
    //   width: "3em",
    //   align: "center",
    //   render: (_, record) => (
    //     <img alt="" src={judgeIsXd(record) ? AGVC_ICON_RED : AGVC_ICON} style={{ width: "1.2em", height: "1.2em" }} />
    //   ),
    // },
    {
      dataIndex: "stationName",
      title: "场站",
      align: "center",
      render: (text, record) => (
        <Link to={`/site/${getStationMainId(record)}/${record.stationCode}/agcv`}>
          <span style={{ color: "var(--deep-font-color)" }}>{text}</span>
        </Link>
      ),
    },
    {
      dataIndex: "deviceName",
      title: "设备",
      align: "center",
    },
    {
      dataIndex: "realTimeTotalActivePowerOfSubStation",
      title: "实际有功(MW)",
      align: "center",
      render: (value, record) => (
        <PointText text={value} record={record} valkey="RealTimeTotalActivePowerOfSubStation" />
      ),
    },
    {
      dataIndex: "AGCActivePowerOrderBySchedule",
      title: "调度有功(MW)",
      align: "center",
      render: (value, record) => (
        <PointText
          text={value}
          record={record}
          valkey="AGCActivePowerOrderBySchedule"
          click={() => openCtl("AGCActivePowerOrderSet", record, true)}
        />
      ),
    },
    // 河南特有
    // {
    //   dataIndex: "AGCLocalActivePowerSet",
    //   title: "本地有功(MW)",
    //   align: "center",
    //   render: (value, record) => <PointText text={value} record={record} valkey="AGCLocalActivePowerSet" />,
    // },
    {
      dataIndex: "TheoreticalPower",
      title: "理论有功(MW)",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="TotalTheorypower" />,
    },
    {
      dataIndex: "AvailablePower",
      title: "可用有功(MW)",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="TotalAvailablePower" />,
    },
    // 所有区域隐藏
    // {
    //   dataIndex: "additionalActivePowerOfSubStation",
    //   title: "可增上限(MW)",
    //   align: "center",
    //   render: (value, record) => <PointText text={value} record={record} valkey="AdditionalActivePowerOfSubStation" />,
    // },
    // {
    //   dataIndex: "decreaseActivePowerOfSubStation",
    //   title: "可减下限(MW)",
    //   align: "center",
    //   render: (value, record) => <PointText text={value} record={record} valkey="DecreaseActivePowerOfSubStation" />,
    // },
    {
      dataIndex: "activePowerAdjustRate",
      title: "有功调节率(%)",
      align: "center",
      // render: (value) => (
      //   <MetricTag value={judgeNull(value, 0.01, 2)} color={value > 1.05 ? "red" : ""} notEvo={true} />
      // ),
      render: (value, record) => (
        <PointText
          text={judgeNull(value, 0.01, 2)}
          record={record}
          color={value > 1.05 ? "red" : ""}
          valkey="activePowerAdjustRate"
        />
      ),
    },
    // 江苏隐藏
    {
      dataIndex: "loadRate",
      title: "有功负荷率(%)",
      align: "center",
      render: (value, record) => (
        <PointText text={judgeNull(value, 0.01, 2)} record={record} color={value > 0.9 ? "red" : ""} />
      ),
      // render: (value) => <MetricTag value={judgeNull(value, 0.01, 2)} color={value > 90 ? "red" : ""} notEvo={true} />,
    },
    {
      dataIndex: "scheduleToCapacityRate",
      title: "调度装机比(%)",
      align: "center",
      render: (value, record) => (
        <PointText text={judgeNull(value, 0.01, 2)} record={record} color={value < 0.1 ? "red" : ""} />
      ),
    },
    // // 广西特有
    // {
    //   dataIndex: "powerLimitDepth",
    //   title: "限电深度(%)",
    //   align: "center",
    //   render: (value, record) => (
    //     <PointText text={judgeNull(value, 0.01, 2)} record={record} color={value < 0.1 ? "red" : ""} />
    //   ),
    // },
    {
       dataIndex: "type",
       title: "限电状态",
      //  width: "3em",
      align: "center",
      render: (_, record) => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
          }}>
        <span style={{
          display: 'inline-block',
          width: '1.0em',
          height: '1.0em',
          borderRadius: '50%',
          backgroundColor: judgeIsXd(record) ? 'red' : 'green'
          }}/>
        </div>
      ),
    },
    {
      dataIndex: "AGCInput",
      title: "AGC状态",
      align: "center",
      width: 160,
      // render: (value) => valuRender(value, "", ["投入", "退出"]),
      render: (value, record) => (
        <div className="status-switch">
          <Switch
            defaultValue={record["AGCInput"] || false}
            value={record["AGCInput"] || false}
            onChange={() => openCtl("AGCInput", record, false)}
          />
          <span
            style={{ cursor: "pointer" }}
            className={`com ${value ? "com-act" : "com-unact"}`}
            onClick={() => openCtl("AGCInputSetEnable", record, false)}
          >
            {value ? "投入" : "退出"}
          </span>
        </div>
      ),
    },
    {
      dataIndex: "AGCRemoteOperation",
      title: "运行状态",
      width: 160,
      align: "center",
      // render: (value) => valuRender(value, "", ["远方", "就地"]),
      render: (value, record) => (
        <div className="status-switch">
          <Switch
            defaultValue={record["AGCRemoteOperation"] || false}
            value={record["AGCRemoteOperation"] || false}
            onChange={() => openCtl("AGCRemoteOperation", record, false)}
          />
          <span
            style={{ cursor: "pointer" }}
            className={`com ${value ? "com-act" : "com-unact"}`}
            onClick={() => openCtl("AGCLocalCtlEnable", record, false)}
          >
            {value ? "远方" : "就地"}
          </span>
        </div>
      ),
    },
    {
      dataIndex: "additionalActivePowerBlock",
      title: "增闭锁",
      width: 180,
      align: "center",
      // render: (value) => valuRender(value, "", ["闭锁", "未闭锁"]),
      render: (value) => (
        <div className="status-switch">
          <Switch disabled value={value} />
          <span className={`com ${value ? "com-act" : "com-unact"}`}>{value ? "闭锁" : "未闭锁"}</span>
        </div>
      ),
    },
    {
      dataIndex: "decreaseActivePowerBlock",
      title: "减闭锁",
      align: "center",
      width: 180,
      // render: (value) => valuRender(value, "", ["闭锁", "未闭锁"]),
      render: (value) => (
        <div className="status-switch">
          <Switch disabled value={value} />
          <span className={`com ${value ? "com-act" : "com-unact"}`}>{value ? "闭锁" : "未闭锁"}</span>
        </div>
      ),
    },
  ]
  return column
}

// AVC 无功调节
export const AREA_AGVC_REACTIVE_COLUMNS = (openCtl) => {
  const column: ColumnsType<IAgvcInfo> = [
    // 隐藏限电图标
    // {
    //   dataIndex: "type",
    //   width: "3em",
    //   align: "center",
    //   render: () => <img alt="" src={AGVC_ICON} style={{ width: "1.2em", height: "1.2em" }} />,
    // },
    {
      dataIndex: "stationName",
      title: "场站",
      align: "center",
      render: (text, record) => (
        <Link to={`/site/${getStationMainId(record)}/${record.stationCode}/agcv`}>
          <span style={{ color: "var(--deep-font-color)" }}>{text}</span>
        </Link>
      ),
    },
    {
      dataIndex: "deviceName",
      title: "设备",
      align: "center",
    },
    {
      dataIndex: "realTimeGirdVolt",
      title: "实际电压(kV)",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} valkey="RealTimeGirdVolt" />,
    },
    // 安徽隐藏    
    {
      dataIndex: "AVCVoltageOrderBySchedule",
      title: "调度电压(kV)",
      align: "center",
      render: (value, record) => (
        <PointText
          text={value}
          record={record}
          valkey="AVCVoltageOrderBySchedule"
          click={() => openCtl("AVCVoltagePowerOrderSet", record, true)}
        />
      ),
    },
    {
      dataIndex: "realTimeTotalReactivePowerOfSubStation",
      title: "实际无功(MVar)",
      align: "center",
      render: (value, record) => (
        <PointText text={value} record={record} valkey="RealTimeTotalReactivePowerOfSubStation" />
      ),
    },
    // 河南隐藏
    {
      dataIndex: "AVCReactivePowerOrderBySchedule",
      title: "调度无功(MVar)",
      align: "center",
      render: (value, record) => (
        <PointText
          text={value}
          record={record}
          valkey="AVCReactivePowerOrderBySchedule"
          click={() => openCtl("AVCReactivePowerOrderSet", record, true)}
        />
      ),
    },
    {
      dataIndex: "additionalReactivePowerOfSubStation",
      title: "可增上限(MVar)",
      align: "center",
      render: (value, record) => (
        <PointText text={value} record={record} valkey="AdditionalReactivePowerOfSubStation" />
      ),
    },
    {
      dataIndex: "decreaseReactivePowerOfSubStation",
      title: "可减下限(MVar)",
      align: "center",
      render: (value, record) => (
        <PointText text={value} record={record} valkey="DecreaseReactivePowerOfSubStation" />
      ),
    },
    {
      dataIndex: "voltRate",
      title: "电压调节率(%)",
      align: "center",
      render: (value, record) => <PointText text={value} record={record} />,
    },
    {
      dataIndex: "AVCInput",
      title: "AVC状态",
      align: "center",
      // render: (value) => valuRender(value, "", ["投入", "退出"]),
      width: 140,
      render: (value, record) => (
        <div className="status-switch">
          <Switch
            defaultValue={record["AVCInput"] || false}
            value={record["AVCInput"] || false}
            onChange={() => openCtl("AVCInput", record, false)}
          />
          <span
            style={{ cursor: "pointer" }}
            className={`com ${value ? "com-act" : "com-unact"}`}
            onClick={() => openCtl("AVCInputSetEnable", record, false)}
          >
            {value ? "投入" : "退出"}
          </span>
        </div>
      ),
    },
    {
      dataIndex: "AVCRemoteOperation",
      title: "运行状态",
      align: "center",
      width: 140,
      // render: (value) => valuRender(value, "", ["远方", "就地"]),
      render: (value, record) => (
        <div className="status-switch">
          <Switch
            defaultValue={record["AVCRemoteOperation"] || false}
            value={record["AVCRemoteOperation"] || false}
            onChange={() => openCtl("AVCRemoteOperation", record, false)}
          />
          <span
            style={{ cursor: "pointer" }}
            className={`com ${value ? "com-act" : "com-unact"}`}
            onClick={() => openCtl("AVCLocalCtlEnable", record, false)}
          >
            {value ? "远方" : "就地"}
          </span>
        </div>
      ),
    },
    {
      dataIndex: "additionalReactivePowerBlock",
      title: "增闭锁",
      align: "center",
      width: 160,
      // render: (value) => valuRender(value, "", ["闭锁", "未闭锁"]),
      render: (value) => (
        <div className="status-switch">
          <Switch disabled value={value} />
          <span className={`com ${value ? "com-act" : "com-unact"}`}>{value ? "闭锁" : "未闭锁"}</span>
        </div>
      ),
    },
    {
      dataIndex: "decreaseReactivePowerBlock",
      title: "减闭锁",
      align: "center",
      width: 160,
      // render: (value) => valuRender(value, "", ["闭锁", "未闭锁"]),
      render: (value) => (
        <div className="status-switch">
          <Switch disabled value={value} />
          <span className={`com ${value ? "com-act" : "com-unact"}`}>{value ? "闭锁" : "未闭锁"}</span>
        </div>
      ),
    },
  ]
  return column
}
