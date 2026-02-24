/*
 * @Author: xiongman
 * @Date: 2023-09-05 10:39:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-11 14:21:26
 * @Description: 区域中心-电气总览
 */
import "./index.less"

import { BulbOutlined, CheckOutlined, QuestionOutlined } from "@ant-design/icons"
// import { useRefresh } from "@hooks/use-refresh.ts"
// import { bacthPass } from "@pages/alarm-history/methods"
import { AREA_ELEC_COLUMNS, HN_AREA_ELEC_COLUMNS } from "@pages/area-elec/configs"
import { Space, Tooltip } from "antd"
import { ColumnsType } from "antd/es/table"
import { useAtomValue } from "jotai"
import { useEffect, useRef, useState } from "react"

import { doBaseServer } from "@/api/serve-funs"
import AlarmConfirmModel, { IOperateProps, IPerateRef } from "@/components/alarm-confirm-model"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import HelpContext from "@/components/layout-app/head-info/components/help"
import AreaElecContext from "@/contexts/area-elec-context"
import { AtomStation } from "@/store/atom-station"
import { bacthPass } from "@/utils/device-funs"
import { showMsg } from "@/utils/util-funs"

import { comfirmAlarmDeal, getEleOverviewData, getOtherData, getRealtimeAlarm } from "./methods"
import { TEleOverviewDataAct } from "./types"

// const testData = [
//   {
//     stationCode: "123",
//     stationName: "123",
//     breakerList: {
//       "401": [
//         {
//           id: 826,
//           modelId: 2,
//           pointName: "CBClosedPosition",
//           pointDesc: "35kV断路器2219合位",
//           pointType: "1",
//           systemId: 401,
//           systemName: "送出线路",
//           coefficient: 1,
//           unit: null,
//           maximum: 1,
//           minimum: 0,
//           value: "true",
//           handcartValue: "",
//           handcartDesc: "sdfg",
//           stationId: 4,
//           stationCode: "441882H01",
//           stationPriority: 4,
//           deviceCode: "441882H01SS11011120",
//           breakerFlag: 1,
//           breakerId: null,
//           electricalFlag: null,
//           tags: '{"breaker_flag": 1}',
//         },
//         {
//           id: 826,
//           modelId: 2,
//           pointName: "CBClosedPosition",
//           pointDesc: "35kV断路器2211合位",
//           pointType: "1",
//           systemId: 401,
//           systemName: "送出线路",
//           coefficient: 1,
//           unit: null,
//           maximum: 1,
//           minimum: 0,
//           value: "true",
//           handcartValue: null,
//           handcartDesc: null,
//           stationId: 4,
//           stationCode: "441882H01",
//           stationPriority: 4,
//           deviceCode: "441882H01SS11011120",
//           breakerFlag: 1,
//           breakerId: null,
//           electricalFlag: null,
//           tags: '{"breaker_flag": 1}',
//         },
//         {
//           id: 828,
//           modelId: 2,
//           pointName: "CBClosedPosition_2213",
//           pointDesc: "断路器2213合位",
//           pointType: "1",
//           systemId: 401,
//           systemName: "送出线路",
//           coefficient: 1,
//           unit: null,
//           maximum: 1,
//           minimum: 0,
//           value: null,
//           handcartValue: null,
//           handcartDesc: null,
//           stationId: 4,
//           stationCode: "441882H01",
//           stationPriority: 4,
//           deviceCode: "441882H01SS11011120",
//           breakerFlag: 1,
//           breakerId: null,
//           electricalFlag: null,
//           tags: '{"breaker_flag": 1}',
//         },
//         {
//           id: 828,
//           modelId: 2,
//           pointName: "CBClosedPosition_2213",
//           pointDesc: "断路器2213合位",
//           pointType: "1",
//           systemId: 401,
//           systemName: "送出线路",
//           coefficient: 1,
//           unit: null,
//           maximum: 1,
//           minimum: 0,
//           value: null,
//           handcartValue: null,
//           handcartDesc: null,
//           stationId: 4,
//           stationCode: "441882H01",
//           stationPriority: 4,
//           deviceCode: "441882H01SS11011120",
//           breakerFlag: 1,
//           breakerId: null,
//           electricalFlag: null,
//           tags: '{"breaker_flag": 1}',
//         },
//         {
//           id: 999,
//           modelId: 2,
//           pointName: "CX_ABLineVoltage",
//           pointDesc: "Ia",
//           pointType: "2",
//           systemId: 401,
//           systemName: "送出线路",
//           coefficient: 1,
//           unit: "",
//           maximum: 1,
//           minimum: null,
//           value: 123,
//           handcartValue: null,
//           handcartDesc: null,
//           stationId: 4,
//           stationCode: "441882H01",
//           stationPriority: 4,
//           deviceCode: "441882H01SS11011120",
//           breakerFlag: null,
//           breakerId: null,
//           electricalFlag: 1,
//           tags: '{"electrical_flag": 1}',
//         },
//       ],
//     },
//   },
// ]
export default function AreaElec(props) {
  const { showTop = true } = props
  const [dataSource, setDataSource] = useState<TEleOverviewDataAct[]>([])
  // const [reload, setReload] = useRefresh(MS_SCEND_2)
  const [isHideMode, setIsHideMode] = useState(true)
  const [checkComfirm, setCheckComfirm] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [realtimeAlarm, setRealtimeAlarm] = useState([])
  const [stationSignRecord, setStationSignRecord] = useState([])
  const [currentPiontInfo, setCurrentPiontInfo] = useState(null)
  const [isClick, setIsClick] = useState(false)
  const modeRef = useRef(null)
  const canReflesh = useRef(true)
  const requestTimeout = useRef(null)
  const intevalTime = useRef(null)
  const { stationMap } = useAtomValue(AtomStation)
  const [column, setColums] = useState<ColumnsType<any>>(AREA_ELEC_COLUMNS(""))
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(true)
  const isFirst = useRef(true)
  // const alarmInfo = useAtomValue(alarmInfoAtom)

  useEffect(() => {
    ;(async function () {
      getColumns.current()
      getOtherRealtimeData()
    })()
  }, [])
  const initElec = async () => {
    requestTimeout.current ?? clearTimeout(requestTimeout.current)
    try {
      const res = await getEleOverviewData()
      setDataSource(res)
      // setReload(false)
    } catch (e) {
      // setReload(false)
      showMsg("升压站数据请求失败", "error", { duration: 10 * 60 * 1000 })
    } finally {
      requestTimeout.current = setTimeout(() => {
        initElec()
      }, 2000)
    }
  }
  const getOtherRealtimeData = async () => {
    getOtherData().then((res) => {
      const [realtimeAlarm, signRecords] = res
      if (!realtimeAlarm?.error && realtimeAlarm?.list) {
        setRealtimeAlarm(realtimeAlarm?.list)
      }
      if (!signRecords?.error) {
        setStationSignRecord(signRecords)
      }
      canReflesh.current = true
    })
  }
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      clearTimeout(requestTimeout.current)
      initElec()
    }
    intevalTime.current = setInterval(async () => {
      if (canReflesh) {
        canReflesh.current = false
        getOtherRealtimeData()
      }
    }, 15000)
    return () => {
      clearInterval(intevalTime.current)
      clearTimeout(requestTimeout.current)
    }
  }, [])
  // 确认告警弹框
  const comfirmAlarm = () => {
    const comfirmAlarmList = comfirmAlarmDeal(realtimeAlarm, dataSource)
    if (!comfirmAlarmList?.length) return showMsg("当前没有闪烁数据")
    setCheckComfirm((prev) => {
      return !prev
    })
  }
  // 显示/隐藏带有“备”的
  const hideOrShow = useRef(() => {
    setIsHideMode((prev) => {
      return !prev
    })
  })
  // 消闪/告警确认
  const btnClkRef = async (type, msg) => {
    if (type === "close") {
      setCheckComfirm(false)
      setIsClick(false)
      return
    }
    // 是否是单条确认
    if (isClick) {
      const alarmInfo = realtimeAlarm.filter((i) => i.alarmId === currentPiontInfo?.pointName)
      await bacthPass(alarmInfo, msg)
    } else {
      const comfirmAlarmList = comfirmAlarmDeal(realtimeAlarm, dataSource)
      if (!comfirmAlarmList?.length) return setCheckComfirm(false)
      await bacthPass(comfirmAlarmList, msg)
    }
    const res = await getRealtimeAlarm()
    if (res) {
      setRealtimeAlarm(res)
    }
    setCheckComfirm(false)
    setIsClick(false)
    setReload(true)
  }
  const getColumns = useRef(async () => {
    setLoading(true)
    const jump = await doBaseServer("queryMngStatic", { key: "screen" })
    const actualKey = jump?.data || process.env.REACT_APP_LARGE_SCREEN_ROOT
    const actualColumns = actualKey === "hnscreen" ? HN_AREA_ELEC_COLUMNS : AREA_ELEC_COLUMNS(actualKey)
    setColums(actualColumns)
    setLoading(false)
  })
  useEffect(() => {
    if (isClick) {
      setCheckComfirm(true)
    }
  }, [isClick])
  return (
    <div className="page-wrap area-elec-wrap">
      <AreaElecContext.Provider
        value={{
          isHideMode: isHideMode,
          currentPiontInfo,
          setCurrentPiontInfo,
          bianAlarmList: realtimeAlarm,
          setBianAlarmList: setRealtimeAlarm,
          dvsSignRecords: stationSignRecord,
          setIsClick,
        }}
      >
        {showTop ? (
          <div className="area-elec-btns">
            <Space>
              <Tooltip title="备" className="tooltip-item">
                <BulbOutlined
                  onClick={hideOrShow.current}
                  style={{ fontSize: "20px", color: !isHideMode ? "#08c" : "#fff" }}
                />
              </Tooltip>
              <Tooltip title="清闪" className="tooltip-item">
                <CheckOutlined
                  onClick={comfirmAlarm}
                  style={{ fontSize: "20px", color: checkComfirm ? "#08c" : "#fff" }}
                />
              </Tooltip>
              <Tooltip title="帮助说明" className="tooltip-item">
                <QuestionOutlined
                  onClick={() => {
                    setShowHelpModal(true)
                  }}
                  style={{ fontSize: "20px", color: "#fff" }}
                />
              </Tooltip>
            </Space>
          </div>
        ) : (
          ""
        )}

        <CustomTable
          rowKey="stationCode"
          limitHeight
          dataSource={dataSource}
          columns={column}
          pagination={false}
          loading={loading}
          bordered
        />
        <CustomModal<IOperateProps, IPerateRef>
          ref={modeRef}
          width="30%"
          title="确认备注"
          destroyOnClose
          open={checkComfirm}
          footer={null}
          onCancel={() => {
            setCheckComfirm(false)
            setIsClick(false)
          }}
          Component={AlarmConfirmModel}
          componentProps={{ buttonClick: btnClkRef }}
        />
        <HelpContext isShowModel={showHelpModal} onClickbtn={() => setShowHelpModal(false)} tabCurrentKey="elec" />
      </AreaElecContext.Provider>
    </div>
  )
}
