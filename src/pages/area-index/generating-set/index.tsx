/*
 * @Author: xiongman
 * @Date: 2023-08-24 10:14:52
 * @LastEditors: xiongman
 * @LastEditTime: 2023-08-24 10:14:52
 * @Description: 区域中心-指标总览-机组指标
 */

import "./index.less"

import { AtomCenterInfoData } from "@store/atom-center-info.ts"
import classnames from "classnames"
import { useAtomValue } from "jotai"

import InfoCard from "@/components/info-card"
import PanelTag from "@/components/metric-tag/panel-tag.tsx"
import { IBaseProps } from "@/types/i-page.ts"

import { SET_LIST } from "./configs.ts"

interface IProps extends IBaseProps {}

export default function GeneratingSet(props: IProps) {
  const { title, className } = props
  const centerInfoData = useAtomValue(AtomCenterInfoData)

  return (
    <InfoCard title={title} className={classnames("generation-set", className)}>
      {SET_LIST.map(({ field, ...others }) => (
        <PanelTag key={field} {...others} value={centerInfoData?.[field] ?? "-"} className="metric-tag" />
      ))}
    </InfoCard>
  )
}
