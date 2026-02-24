/*
 * @Author: chenmeifeng
 * @Date: 2024-02-01 17:33:24
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-12 13:41:57
 * @Description:
 */
import "./index.less"

import { useMemo, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal"
import { IPointInfo } from "@/pages/site-boost/types"

import { FIVE_RULE } from "../../methods"
import SvgHistoryLine, { ISvgLineMdlProps, ISvgLineRef } from "../history-line"
import SvgPointBox, { IPerateRef, ISvgPointMdlProps } from "../point-box"
import SvgResetDataBox, { ISvgPointAngMdlProps } from "../reset-list"
import AlarmConfirmModel, { IOperateProps, IPerateRef as AlarmIPerateRef } from "@/components/alarm-confirm-model"
import { bacthPass } from "@/utils/device-funs"
import { AlarmListData } from "@/types/i-alarm"
import { showMsg } from "@/utils/util-funs"
interface IProps {
  pointInfo?: IPointInfo
  alarmList?: Array<AlarmListData>
  hiddenBox: (key) => void
  refreshAlarm?: () => void
}
const list = [
  { name: "人工置数", key: "1", includes: ["CB", "ON", "OFF", "TP"] },
  { name: "历史曲线", key: "2", includes: ["CB", "ON", "OFF", "TP", "ARM"] },
  { name: "测点属性", key: "3", includes: ["CB", "ON", "OFF", "TP"] },
  { name: "五防规则", key: "4", includes: ["CB", "ON", "OFF"] },
  { name: "告警确认", key: "5", includes: ["CB", "ON", "OFF", "ARM"] },
]
export default function SvgContextmenuBox(props: IProps) {
  const { pointInfo, alarmList = [], hiddenBox, refreshAlarm } = props
  const [openModal, setOpenModal] = useState("")
  // const [activeItem, setActiveItem] = useState("1")
  const modalRef = useRef()

  const actualList = useMemo(() => {
    if (!pointInfo) return []
    const menu = list.filter((i) => i.includes?.includes(pointInfo.actType))
    return menu
  }, [pointInfo])

  const changeClk = (key) => {
    if (
      key === "5" &&
      !alarmList?.filter(
        (i) =>
          i.alarmId === pointInfo.pointName &&
          i.stationCode === pointInfo.stationInfo?.stationCode &&
          i.deviceId === pointInfo.deviceId,
      )?.length
    ) {
      // 当点击告警确认时，判断该点是否有告警未确认信息
      showMsg("当前点没有告警信息")
      return
    } else if (key === "4" && (pointInfo.controlPointName === "_" || !pointInfo.controlPointName)) {
      showMsg("当前点没绑控制点")
      return
    }
    setOpenModal(key)
    hiddenBox(key)
  }
  const btnClkRef = async (type: "ok" | "close", data: string) => {
    // 执行
    if (type === "ok") {
      const comfirmAlarms = alarmList?.filter(
        (i) =>
          i.alarmId === pointInfo.pointName &&
          i.stationCode === pointInfo.stationInfo?.stationCode &&
          i.deviceId === pointInfo.deviceId,
      )
      const res = await bacthPass(comfirmAlarms, data)
      if (res) {
        refreshAlarm?.()
        setOpenModal("")
      }
    }
    if (type === "close") return setOpenModal("")
  }
  return (
    <div className="svg-cxmenu">
      <div className="svg-cxmenu-list">
        {actualList.map((i) => {
          return (
            <div key={i.key} className="svg-cxmenu-item" onClick={(e) => changeClk(i.key)}>
              {i.name}
            </div>
          )
        })}
      </div>
      <CustomModal<ISvgLineMdlProps, ISvgLineRef>
        ref={modalRef}
        width="70%"
        title="历史曲线"
        destroyOnClose
        open={openModal === "2"}
        footer={null}
        onCancel={() => setOpenModal("")}
        Component={SvgHistoryLine}
        componentProps={{ pointInfo }}
      />
      <CustomModal<ISvgPointMdlProps, IPerateRef>
        ref={modalRef}
        width="30%"
        title="测点属性"
        destroyOnClose
        open={openModal === "3"}
        footer={null}
        onCancel={() => setOpenModal("")}
        Component={SvgPointBox}
        componentProps={{ pointInfo }}
      />
      <CustomModal<ISvgPointAngMdlProps, IPerateRef>
        ref={modalRef}
        width="40%"
        title="人工置数"
        destroyOnClose
        open={openModal === "1"}
        footer={null}
        onCancel={() => setOpenModal("")}
        Component={SvgResetDataBox}
        componentProps={{ pointInfo, changeClk: changeClk }}
      />
      <CustomModal<IOperateProps, AlarmIPerateRef>
        ref={modalRef}
        width="30%"
        title="确认备注"
        destroyOnClose
        open={openModal === "5"}
        footer={null}
        onCancel={() => setOpenModal("")}
        Component={AlarmConfirmModel}
        componentProps={{ buttonClick: btnClkRef }}
      />
      {/* <CustomModal<ISvgFiveRuleMdlProps, IFiveRulePerateRef>
        ref={modalRef}
        width="40%"
        title="五防规则"
        destroyOnClose
        open={openModal === "4"}
        footer={null}
        onCancel={() => setOpenModal("")}
        Component={FiveRule}
        componentProps={{ pointInfo, changeClk: changeClk.current }}
      /> */}
    </div>
  )
}
