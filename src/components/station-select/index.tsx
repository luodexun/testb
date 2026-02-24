/*
 * @Author: xiongman
 * @Date: 2023-08-23 15:31:01
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-01-04 17:18:34
 * @Description: 场站选择组件
 */

import { CaretRightOutlined } from "@ant-design/icons"
import { AtomStation } from "@store/atom-station.ts"
import type { SelectProps } from "antd/lib"
import { useAtomValue } from "jotai"

import SelectWithAll from "@/components/select-with-all"

interface IProps extends Pick<SelectProps, "value" | "onChange"> {
  needFirst?: boolean
  needId?: boolean
  needAllInfo?: boolean
}

export default function StationSelect(props: IProps) {
  const { value, onChange, needFirst, needId, needAllInfo, ...selProps } = props
  const { stationList, stationOptions, stationOptions4Id } = useAtomValue(AtomStation)
  const getAllStationLs = stationList.map((i) => {
    return {
      value: i.stationCode,
      label: i.shortName,
      type: i.stationType,
    }
  })
  return (
    <SelectWithAll
      size="small"
      placeholder="选择场站"
      style={{ width: "10em" }}
      {...selProps}
      needFirst={needFirst}
      value={value}
      onChange={onChange}
      options={needAllInfo ? getAllStationLs : needId ? stationOptions4Id : stationOptions}
      suffixIcon={<CaretRightOutlined />}
    />
  )
}
