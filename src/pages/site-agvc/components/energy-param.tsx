/*
 * @Author: chenmeifeng
 * @Date: 2023-10-13 10:35:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-09-10 15:55:51
 * @Description:
 */

import "./energy-param.less"

import { TEnergyType } from "@pages/site-agvc/types"
import { useMemo } from "react"

import MetricTag from "@/components/metric-tag"
import PointTextTags from "@/components/trend-line-by-dvs/text-tags"
import { IAgvcMQDataMap } from "@/types/i-agvc"
import { IDeviceData } from "@/types/i-device"
import { judgeNull } from "@/utils/util-funs"

import { getAGVCParam } from "../configs"

interface IProps {
  type: TEnergyType
  dvsInfo: IDeviceData
  data: IAgvcMQDataMap[string]
}
// const data = {
//   AGCActivePowerOrderBySchedule: 10000,
//   additionalActivePowerOfSubStation: 234,
//   decreaseActivePowerOfSubStation: 987654,
//   additionalReactivePowerOfSubStation: 2234,
//   decreaseReactivePowerOfSubStation: 200000,
//   realTimeTotalActivePowerOfSubStation: 1203,
// }
export default function EnergyParam(props: IProps) {
  const { type, dvsInfo, data } = props

  const paramList = useMemo(() => getAGVCParam(type), [type])
  // const actualData = useMemo(() => {
  //   if (!data) return null
  //   return {
  //     ...data,
  //     realTimeTotalActivePowerOfSubStation: parseNum(data.realTimeTotalActivePowerOfSubStation / 1000),
  //     AGCActivePowerOrderBySchedule: parseNum(data.AGCActivePowerOrderBySchedule / 1000),
  //     additionalActivePowerOfSubStation: parseNum(data.additionalActivePowerOfSubStation / 1000),
  //     decreaseActivePowerOfSubStation: parseNum(data.decreaseActivePowerOfSubStation / 1000),
  //     additionalReactivePowerOfSubStation: parseNum(data.additionalReactivePowerOfSubStation / 1000),
  //     decreaseReactivePowerOfSubStation: parseNum(data.decreaseReactivePowerOfSubStation / 1000),
  //   }
  // }, [data])
  return (
    <div className="l-full energy-param-wrap">
      {paramList.map(({ title, unit, field, subField, caculate, valColor, valueFun }) => {
        const value = data?.[field]
        const theVal = valueFun
          ? value || value === false
            ? valueFun(value)
            : "-"
          : judgeNull(value, caculate, 2, "-")
        let color = valueFun ? "green" : "var(--white-color)"
        color = valueFun && value ? "red" : color
        color = valColor ? valColor(theVal) : color
        return (
          // <MetricTag
          //   key={field}
          //   title={title}
          //   value={theVal ?? "-"}
          //   unit={unit as string}
          //   color={color}
          //   notEvo={true}
          //   className="index-info-tag"
          // />
          <PointTextTags
            key={field}
            record={dvsInfo}
            valkey={subField}
            title={title}
            text={theVal}
            unit={unit}
            color={color}
          />
        )
      })}
    </div>
  )
}
