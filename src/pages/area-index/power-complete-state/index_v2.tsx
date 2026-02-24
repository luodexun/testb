import "./index_v2.less"

import { useAtomValue } from "jotai"

import InfoCard from "@/components/info-card"
import PanelTag from "@/components/metric-tag/panel-tag"
import { IDvsRunStateInfo } from "@/configs/dvs-state-info"
import { UNIT } from "@/configs/text-constant"
import { AtomCenterInfoData } from "@/store/atom-center-info"
import { IBaseProps } from "@/types/i-page"
import { judgeNull } from "@/utils/util-funs"
const POWER_COMPLETE: IDvsRunStateInfo<any, string>[] = [
  { title: "月发电量", unit: UNIT.ELEC, field: "monthlyProduction" },
  { title: "月计划发电量", unit: UNIT.ELEC, field: "monthlyProductionPlan" },
  { title: "月完成率", unit: UNIT.PERCENT, field: "monthlyCompletionRate" },
  { title: "年发电量", unit: UNIT.ELEC, field: "yearlyProduction" },
  { title: "年计划发电量", unit: UNIT.ELEC, field: "yearlyProductionPlan" },
  { title: "年完成率", unit: UNIT.PERCENT, field: "yearlyCompletionRate" },
]
interface IProps extends IBaseProps {}
export default function CompleteState(props: IProps) {
  const { title, className } = props
  const centerInfoData = useAtomValue(AtomCenterInfoData)
  console.log("centerInfoData", centerInfoData)

  return (
    <InfoCard title={title} className={`complete-state ${className ?? ""}`}>
      {POWER_COMPLETE.map(({ field, ...others }) => (
        <PanelTag
          key={field}
          {...others}
          value={judgeNull(centerInfoData?.[field], 1, 2, "-")}
          className="metric-tag"
        />
      ))}
    </InfoCard>
  )
}
