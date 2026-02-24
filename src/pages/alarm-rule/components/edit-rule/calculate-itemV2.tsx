/*
 * @Author: chenmeifeng
 * @Date: 2024-09-09 10:37:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-31 16:18:29
 * @Description: 自定义计算规则
 */
import "./calculate-item.less"
import SelectOrdinary from "@/components/select-ordinary"
import RuleQuotaInput from "./quota-inputV2"
import { CAL_OPTION, RELATION_CAL_OPTION, YAOXIN_OPTION } from "../../configs/form"
import { Button, Input, InputNumber, Tooltip } from "antd"
import { useContext, useEffect, useRef, useState } from "react"
import { IRuleQuotaInfo } from "../../types"
import PiontContext from "../../configs/use-point-check"
import { queryLastedVals } from "../../methods/table"
interface IProps {
  value?: Array<IRuleQuotaInfo>
  defaultValue?: Array<number>
  onChange?: (val: any) => void
}
export default function CalculateItem(props: IProps) {
  const { value = [], onChange } = props
  const [allPionts, setAllPoint] = useState([])
  const isFirst = useRef(true)
  const [allPiontLastedVal, setAllPiontLastedVal] = useState([])
  const { curCheckPoint, cursorInfo, curDevice, exitPointList, chooseDeviceLs } = useContext(PiontContext)
  useEffect(() => {
    // 监听选择测点变化，选择测点后根据鼠标在上一个输入框停留位置，添加测点名称到输入框中
    if (curCheckPoint && cursorInfo) {
      changePoint()
    }
  }, [curCheckPoint])
  const changePoint = async () => {
    const lists = JSON.parse(JSON.stringify(value))
    const { id, key } = cursorInfo?.currentInfo
    const list = lists.find((i) => i.id === id)

    list[key] = curCheckPoint.pointName
    await searchAllPtsLast(lists, chooseDeviceLs)
    onChange?.(lists)
  }
  const addItem = () => {
    const list = value.concat([{ id: Date.now(), operator: "", pointName: "", value: "", symbol: "||" }])
    onChange?.(list)
  }
  const inputChange = async (info, key, id) => {
    const lists = JSON.parse(JSON.stringify(value))
    const list = lists.find((i) => i.id === id)
    list[key] = info

    if (key === "pointName") {
      // 查询当前测点最近值
      await searchAllPtsLast(lists, chooseDeviceLs)
    }
    onChange?.(lists)
  }
  // 查询当前测点最近值
  const searchAllPtsLast = async (lists, deviceLs) => {
    const res = await queryLastedVals(lists, deviceLs)
    setAllPiontLastedVal(res)
  }
  useEffect(() => {
    if (isFirst.current && value?.length) {
      isFirst.current = false
      searchAllPtsLast(value, [curDevice])
    }
  }, [value])
  return (
    <div className="arule-cclt">
      {value?.map((i, idx) => {
        const currentType = allPiontLastedVal?.find((item) => item.pointName === i.pointName)
        return (
          <div key={i.id} className="arule-cclt-item">
            <div className="arule-cclt-item--quota">
              <RuleQuotaInput
                value={i.pointName}
                info={{ id: i.id, key: "pointName" }}
                points={exitPointList}
                onChange={(e) => inputChange(e, "pointName", i.id)}
              />
              <SelectOrdinary
                value={i.operator}
                options={
                  currentType?.dataType !== "BOOLEAN" ? CAL_OPTION : CAL_OPTION.filter((opt) => opt.value === "=")
                }
                onChange={(e) => inputChange(e, "operator", i.id)}
                style={{ width: "10%", margin: "0 2em" }}
              />
              {currentType?.dataType === "BOOLEAN" ? (
                <SelectOrdinary
                  value={i.value}
                  options={YAOXIN_OPTION}
                  onChange={(e) => inputChange(e, "value", i.id)}
                  style={{ width: "10%", margin: "0 2em" }}
                />
              ) : (
                <Tooltip placement="top" title={`最新值：${currentType?.pointValue || "无"}`}>
                  <InputNumber value={i.value} onChange={(e) => inputChange(e, "value", i.id)} />
                </Tooltip>
              )}
            </div>
            {idx + 1 !== value.length ? (
              <SelectOrdinary
                value={i.symbol}
                options={RELATION_CAL_OPTION}
                onChange={(e) => inputChange(e, "symbol", i.id)}
                style={{ width: "10%", marginTop: "1em" }}
              />
            ) : (
              ""
            )}
          </div>
        )
      })}
      <Button type="dashed" onClick={addItem} block>
        + 规则
      </Button>
    </div>
  )
}
