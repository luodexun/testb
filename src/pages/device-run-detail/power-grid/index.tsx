/*
 * @Author: xiongman
 * @Date: 2023-09-26 12:39:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-06-17 17:04:39
 * @Description: 涉网信息
 */

import "./index.less"

import AtomRun4DvsData from "@store/atom-run-device.ts"
import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, useContext, useMemo, useState } from "react"

import InfoCard from "@/components/info-card"
import MetricTag from "@/components/metric-tag"
import DvsDetailContext from "@/contexts/dvs-detail-context.ts"
import { pointInfoSetAtom } from "@/store/atom-point-modal.ts"
import { IBaseProps } from "@/types/i-page.ts"

import AttrTrendModal from "../components/attr-trend-modal.tsx"
import { GRID_INFO } from "./configs.ts"

interface IProps extends IBaseProps {}
export default function PowerGrid(props: IProps) {
  const { className } = props

  const [canOpen, setCanOpen] = useState(false)
  const [currentInfo, setCurrentInfo] = useState({})

  const { device } = useContext(DvsDetailContext)
  const run4Device = useAtomValue(AtomRun4DvsData)
  const setPiontList = useSetAtom(pointInfoSetAtom)

  const gridList = useMemo(() => {
    return GRID_INFO[device?.deviceType || "WT"]
  }, [device])
  const tagData = useMemo(() => {
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
    <InfoCard title="涉网信息" className={`power-grid-wrap ${className}`}>
      {gridList.map(({ title, color, children }) => {
        return (
          <div key={title} className="grid-item-box">
            {children.map((item, index) => {
              if (item.field) {
                return (
                  <MetricTag
                    key={item.title}
                    onClickValue={() => openDialog(item)}
                    value={tagData?.[item.field] ?? "-"}
                    unit={item.unit}
                    className={`metric-tag row-${index}`}
                    valueStyle={{ color: item.color || color }}
                  />
                )
              }
              return (
                <div
                  key={item.title}
                  className={`row-${index}`}
                  children={item.title}
                  style={{ color: item.color || color }}
                />
              )
            })}
          </div>
        )
      })}
      {/* <AttrTrendModal open={canOpen} setCanOpen={setCallBackModal} info={currentInfo} device={device} /> */}
    </InfoCard>
  )
}
