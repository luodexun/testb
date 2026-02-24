/*
 * @Author: xiongman
 * @Date: 2023-02-01 11:20:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2026-01-06 16:05:38
 * @Description: 格式化指定单位的起止时间
 */

import { DatePicker } from "antd"
import { RangePickerProps } from "antd/es/date-picker/generatePicker"
import dayjs, { Dayjs } from "dayjs"
// import { RangePickerProps } from "antd/es/date-picker/generatePicker/interface"
// import dayjs from 'dayjs'
import advancedFormat from "dayjs/plugin/advancedFormat"
import customParseFormat from "dayjs/plugin/customParseFormat"
import localeData from "dayjs/plugin/localeData"
import weekday from "dayjs/plugin/weekday"
import weekOfYear from "dayjs/plugin/weekOfYear"
import weekYear from "dayjs/plugin/weekYear"
import { useMemo, useRef, useState } from "react"

import { TPresets } from "@/types/i-antd.ts"

import { defPresetsMap, getPresetsByNums } from "./configs.ts"

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
type TDateRangePicker = Omit<RangePickerProps<Dayjs>, "presets"> & {
  presets?: number[][]
}

type RangeValue = [Dayjs | null, Dayjs | null] | null

// 时间范围选框组件，格式化指定单位的起止时间
export default function RangeDatePicker(props: TDateRangePicker) {
  const { value, onChange, presets, picker = "date", ...otherProps } = props

  const [hackDate, setHackDate] = useState<RangeValue>(null)
  const onOpenChgRef = useRef((open: boolean) => {
    if (open) {
      setHackDate([null, null])
    } else {
      setHackDate(null)
    }
  })

  const rangePresets: TPresets | undefined = useMemo(() => {
    let tempPresets = presets
    if (!presets) tempPresets = defPresetsMap["date"]
    return getPresetsByNums("date", tempPresets)
  }, [presets])

  const presetList = useMemo(() => {
    const yesterDay = [dayjs().subtract(1, "day").startOf("day"), dayjs().subtract(1, "day").endOf("day")]
    const nowTime = [dayjs().startOf("day"), dayjs()]
    if (picker !== "date") return []
    return [
      ...rangePresets,
      {
        label: <span aria-label="此刻">此刻</span>,
        value: () => [dayjs().startOf("day"), dayjs()],
      },
      {
        label: <span aria-label="昨日">昨日</span>,
        value: () => [dayjs().subtract(1, "day").startOf("day"), dayjs().subtract(1, "day").endOf("day")],
      },
    ]
  }, [rangePresets, picker])

  return (
    <DatePicker.RangePicker
      value={hackDate || value}
      onChange={onChange}
      presets={presetList}
      picker={picker}
      {...(otherProps as any)}
      // onOpenChange={onOpenChgRef.current}
    />
  )
}
