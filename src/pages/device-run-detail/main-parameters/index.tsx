/*
 * @Author: xiongman
 * @Date: 2023-09-27 15:05:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-19 17:15:28
 * @Description: 主要运行参数
 */

import "./index.less"

import { IDvsRunStateInfo } from "@configs/dvs-state-info.ts"
import AtomRun4DvsData from "@store/atom-run-device.ts"
import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, useContext, useMemo, useState } from "react"

import InfoCard from "@/components/info-card"
import MetricTag from "@/components/metric-tag"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { pointInfoSetAtom } from "@/store/atom-point-modal.ts"
import { IBaseProps } from "@/types/i-page.ts"

import AttrTrendModal from "../components/attr-trend-modal.tsx"
import { DVS_MAIN_PARAMETER_MAP } from "./configs.tsx"

interface IProps extends IBaseProps {}
export default function MainParameters(props: IProps) {
  const { className } = props
  const { device } = useContext(DvsDetailContext)
  const run4Device = useAtomValue(AtomRun4DvsData)

  const [canOpen, setCanOpen] = useState(false)
  const [currentInfo, setCurrentInfo] = useState({})

  const setPiontList = useSetAtom(pointInfoSetAtom)
  const PARAM_LIST: IDvsRunStateInfo[][] = useMemo(() => {
    return DVS_MAIN_PARAMETER_MAP[device?.deviceType || "WT"]
  }, [device?.deviceType])

  const paramData = useMemo(() => {
    if (!device || !run4Device) return {}
    const { deviceCode, deviceType } = device
    return run4Device[deviceType]?.[deviceCode] || {}
  }, [device, run4Device])
  const openDialog = useCallback(
    (value) => {
      setPiontList({
        open: true,
        pointInfo: value,
      })
      setCurrentInfo(value)
      setCanOpen(true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [device],
  )
  const setCallBackModal = useCallback(
    (value) => {
      setCanOpen(value)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [device, setCanOpen],
  )
  return (
    <InfoCard title="主要运行参数" className={`main-parameters-wrap ${className}`}>
      {PARAM_LIST.map((params, index) => (
        <div key={index} className="param-col">
          {params.map(({ title, field, icon, unit, subField, actualShowSubField }) => (
            <div key={field} className="param-row">
              <i className={`iconfont ${icon}`} />
              {/*valueFun?.(data?.[field], data) ||*/}
              <MetricTag
                key={field}
                onClickValue={() => openDialog({ title, field, icon, unit, subField, actualShowSubField })}
                title={title}
                unit={unit as string}
                value={paramData?.[field] ?? "-"}
              />
            </div>
          ))}
        </div>
      ))}
      {/* <AttrTrendModal open={canOpen} setCanOpen={setCallBackModal} info={currentInfo} device={device} /> */}
    </InfoCard>
  )
}
