import dayjs, { Dayjs, OpUnitType } from "dayjs"

import { IPickerTypeProps, TDateLabel, TDateType, TPresetsMap } from "./types.ts"

const type2LabelMap: Record<TDateType, TDateLabel> = {
  date: "日",
  month: "月",
  year: "年",
  hour: "时",
}

export const defPresetsMap: TPresetsMap = {
  year: [
    [0, 0],
    [-1, 0],
  ],
  month: [
    [0, 0],
    [-1, 0],
    [-2, 0],
    [-3, 0],
  ],
  date: [
    [0, 0],
    [-6, 0],
    [-13, 0],
    [-29, 0],
    [-89, 0],
    // [0, 1],
    // [-7, 0],
    // [-14, 0],
    // [-30, 0],
    // [-90, 0],
  ],
  hour: [
    [0, 0],
    [-1, 0],
    [-2, 0],
    [-3, 0],
    [-6, 0],
    [-12, 0],
  ],
}

function dealPresetsLabel([sN, eN]: number[], dateType: TDateType) {
  let label: string = type2LabelMap[dateType]
  label = label === "日" ? "天" : label
  const num = eN - sN + 1
  if (sN > 0) {
    return `未来 ${num} ${label}`
  } else if (sN < 0) {
    return `最近 ${Math.abs(num)} ${label}`
  } else {
    return `当前 ${label}`
  }
}
const dateUnitMap: Record<TDateType, OpUnitType> = {
  date: "d",
  month: "month",
  year: "y",
  hour: "hour",
}
export function getPresetsByNums(dateType: TDateType, nums?: number[][]): IPickerTypeProps["presets"] {
  if (!Array.isArray(nums) || !nums?.length) return
  const unit = dateUnitMap[dateType] as "d" | "month" | "y" | "hour"
  return nums.map(([sN, eN]) => {
    const value: [Dayjs, Dayjs] = [dayjs().add(sN, unit).startOf("day"), dayjs().add(eN, unit).endOf("day")]
    return { label: dealPresetsLabel([sN, eN], dateType), value: () => value }
  })
}
