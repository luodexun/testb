import { Table } from "antd"
import { useMemo } from "react"
import { IRpPowerData, IRpPowerSchForm } from "../types"
import { judgeNull } from "@/utils/util-funs"
// 需要获取平均数的参数
const getAverageKeys = [
  "activePower",
  "timeAvailability",
  "productionAvailability",
  "productionEfficiency",
  "windSpeed",
]
// 百分比的参数， 需要乘100的数
const isRate = ["timeAvailability", "productionAvailability", "productionEfficiency"]
interface IProps {
  formData: IRpPowerSchForm
  dataSource: IRpPowerData[]
  existColumns: any[]
}
export default function TableSummary(props: IProps) {
  const { dataSource = [], formData, existColumns } = props
  const dvsTypeColumn = useMemo(() => {
    if (!formData) return null
    // const dvsTypeColumnKeys = DEFAULT_STATION_MAP[formData.deviceType]?.colums?.map((i) => i["dataIndex"])
    // const sortChooseKeys = dvsTypeColumnKeys?.filter((i) => formData.point?.includes(i)) // 排序过的指标key
    // // console.log(formData, "formData", sortChooseKeys)
    // // 当指标选择框长度大于1，展示选择后的指标
    // const keyArr = formData.point?.length
    //   ? sortChooseKeys
    //   : DEFAULT_STATION_MAP[formData.deviceType]?.colums?.map((i) => i["dataIndex"])
    const keyArr = existColumns?.map((i) => i["dataIndex"])
    const keyObj = keyArr?.reduce((prev, cur) => {
      prev[cur] = {
        total: null,
        average: null,
      }
      dataSource?.forEach((i, idx) => {
        prev[cur]["total"] += (i[cur] === "NaN" ? null : i[cur]) || null
        prev[cur]["average"] = (prev[cur]["total"] / (idx + 1)) * (isRate.includes(cur) ? 100 : 1)
      })
      return prev
    }, {})
    return keyObj
  }, [existColumns, dataSource])
  const startIndex = useMemo(() => {
    const arr = ["PERIOD", "LINE", "DEVICE_CODE", "MODEL"]
    if (arr.includes(formData?.groupByPath)) return 4
    return 3
  }, [dataSource])
  return (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0} colSpan={startIndex} align="center">
        总计
      </Table.Summary.Cell>
      {dvsTypeColumn &&
        Object.keys(dvsTypeColumn)?.map((i, idx) => {
          return (
            <Table.Summary.Cell key={i} index={idx + startIndex} align="center">
              <span>{judgeNull(dvsTypeColumn?.[i]?.[getAverageKeys.includes(i) ? "average" : "total"], 1, 2)}</span>
            </Table.Summary.Cell>
          )
        })}
    </Table.Summary.Row>
  )
}
