/*
 * @Author: xiongman
 * @Date: 2023-11-16 11:14:09
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-23 17:36:31
 * @Description: 设备挂牌展示组件
 */

import "./device-signal.less"

import classnames from "classnames"
import { useMemo } from "react"

import DeviceSignalPopover from "@/components/device-card/device-signal-popover.tsx"
import { IDvsSignalRecordInfo } from "@/types/i-monitor-info.ts"

export function SignalIcon(props: Pick<IProps, "signalList">) {
  const { signalList } = props
  if (!signalList?.length) return null

  const actualSignList = useMemo(() => {
    if (!signalList?.length) return []
    const sign = signalList.reduce((prev, cur) => {
      if (!prev[cur.signState]) {
        prev[cur.signState] = cur.remark
      } else {
        prev[cur.signState] = prev[cur.signState] + ";" + cur.remark
      }
      return { ...prev }
    }, {})
    const signMarkLs = Object.keys(sign)?.map((i) => {
      return {
        signState: i,
        remark: sign[i],
      }
    })
    return signMarkLs
  }, [signalList])
  return (
    <div className="signal-icon-box">
      {actualSignList.map(({ signState, remark }) => (
        <i key={signState} title={remark} className={classnames("signal-icon", `signal-${signState}`)} />
      ))}
    </div>
  )
}
interface IProps {
  signalList: IDvsSignalRecordInfo[]
}
export default function DeviceSignal(props: IProps) {
  const { signalList } = props

  // const displayList = useMemo(() => (signalList || []).slice(0, 1), [signalList])
  const displayList = useMemo(() => {
    const remark = signalList?.map((i) => i.remark)?.join(";")
    return signalList?.length
      ? [
          {
            signState: "common",
            remark: remark?.length > 200 ? remark?.slice(0, 200) + "..." : remark,
          },
        ]
      : []
  }, [signalList])

  return (
    <div className="device-signal-wrap">
      <SignalIcon signalList={displayList} />
      {/* {signalList.length > 1 ? <DeviceSignalPopover list={signalList} /> : null} */}
    </div>
  )
}
