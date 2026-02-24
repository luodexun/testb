/*
 * @Author: chenmeifeng
 * @Date: 2024-10-22 14:34:10
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-23 17:25:05
 * @Description:
 */
import { Input, Select, SelectProps } from "antd"
import { useContext, useEffect, useRef, useState } from "react"
import PiontContext from "../../configs/use-point-check"
import { IDvsMeasurePointData } from "@/types/i-device"

interface IProps {
  value?: string
  info?: {
    id: number
    key: string
  }
  points?: Array<IDvsMeasurePointData>
  defaultValue?: Array<number>
  onChange?: (val: any) => void
}
export default function RuleQuotaInput(props: IProps) {
  const { value, info, points, onChange } = props

  const [data, setData] = useState<Array<IDvsMeasurePointData>>([])
  const [selectVals, setSelectVals] = useState<string>()

  const { setCursorInfo } = useContext(PiontContext)

  const handleSearch = (newValue: string) => {
    const exists = points?.filter((i) => i.pointDesc.indexOf(newValue) !== -1)
    setData(exists)
  }

  const handleChange = (newValue: string) => {
    setSelectVals(newValue)
    onChange?.(newValue)
  }
  const getCursorPosition = (e) => {
    setCursorInfo({ position: 0, currentInfo: info })
  }
  useEffect(() => {
    setData(points)
  }, [points])
  useEffect(() => {
    setSelectVals(value)
  }, [value])
  return (
    <div className="limit-power-lnnterval">
      <Select
        showSearch
        value={selectVals}
        defaultActiveFirstOption={false}
        suffixIcon={null}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        onBlur={getCursorPosition}
        notFoundContent={null}
        options={(data || []).map((d) => ({
          value: d.pointName,
          label: d.pointDesc + (d.unit ? ` (${d.unit})` : ""),
        }))}
      />
    </div>
  )
}
