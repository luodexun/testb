/*
 * @Author: xiongman
 * @Date: 2023-08-24 11:42:36
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-24 11:42:36
 * @Description: 区域中心-指标总览-发电量完成情况
 */

import "./index.less"

import { AtomCenterInfoData } from "@store/atom-center-info.ts"
import { evoluateNum } from "@utils/util-funs.tsx"
import { useAtomValue } from "jotai"

import InfoCard from "@/components/info-card"
import { ICenterProductionData } from "@/types/i-monitor-info.ts"
import { IBaseProps } from "@/types/i-page.ts"

import StateTag from "./state-tag.tsx"

interface IDataList {
  key: "month" | "year"
  tags: { title: string; field: keyof ICenterProductionData }[]
  colors: string[]
}
const STATE_LIST: IDataList[] = [
  {
    key: "month",
    tags: [
      { title: "月发电", field: "monthlyProduction" },
      { title: "月计划", field: "monthlyProductionPlan" },
    ],
    colors: ["rgba(133,110,249,0.54)", "rgba(50,198,228,0.8)", "var(--fontcolor)"],
  },
  {
    key: "year",
    tags: [
      { title: "年发电", field: "yearlyProduction" },
      { title: "年计划", field: "yearlyProductionPlan" },
    ],
    colors: ["rgba(232,239,26,0.54)", "rgba(251,100,0,0.8)", "var(--fontcolor)"],
  },
]

interface IProps extends IBaseProps {}

export default function CompleteState(props: IProps) {
  const { title, className } = props
  const centerInfoData = useAtomValue(AtomCenterInfoData)

  return (
    <InfoCard title={title} className={`complete-state ${className ?? ""}`}>
      {STATE_LIST.map(({ key, tags, colors }) => {
        return (
          <StateTag
            key={key}
            tags={tags.map(({ title, field }) => ({ title, value: evoluateNum(centerInfoData?.[field], 1) ?? 0 }))}
            strokeColor={{ from: colors[0], to: colors[1] }}
            valueColor={colors[2] || colors[1]}
          />
        )
      })}
    </InfoCard>
  )
}
