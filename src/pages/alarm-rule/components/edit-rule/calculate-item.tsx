/*
 * @Author: chenmeifeng
 * @Date: 2024-09-09 10:37:44
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-23 11:33:54
 * @Description: 自定义计算规则
 */
import "./calculate-item.less"
import SelectOrdinary from "@/components/select-ordinary"
import RuleQuotaInput from "./quota-inputV2"
import { CAL_OPTION, RELATION_CAL_OPTION } from "../../configs/form"
import { Button, Input, InputNumber } from "antd"
import { useContext, useEffect, useRef } from "react"
import { IRuleQuotaInfo } from "../../types"
import PiontContext from "../../configs/use-point-check"
interface IProps {
  value?: Array<IRuleQuotaInfo>
  defaultValue?: Array<number>
  onChange?: (val: any) => void
}
export default function CalculateItem(props: IProps) {
  const { value = [], onChange } = props
  const { curCheckPoint, cursorInfo, setCursorInfo } = useContext(PiontContext)
  useEffect(() => {
    // 监听选择测点变化，选择测点后根据鼠标在上一个输入框停留位置，添加测点名称到输入框中
    if (curCheckPoint && cursorInfo) {
      const lists = JSON.parse(JSON.stringify(value))
      const { position } = cursorInfo
      const { id, key } = cursorInfo?.currentInfo
      const list = lists.find((i) => i.id === id)
      // console.log(curCheckPoint, "测i的")

      list[key] = list[key].substring(0, position) + curCheckPoint.pointName + list[key].substring(position)

      onChange?.(lists)
      // 设置输入框光标位置
      setCursorInfo((prev) => {
        prev.nextCursorPistion = position + curCheckPoint.pointName?.length
        return {
          ...prev,
        }
      })
    }
  }, [curCheckPoint])
  const addItem = () => {
    const list = value.concat([{ id: Date.now(), operator: ">", pointName: "", value: "", symbol: "||" }])
    onChange?.(list)
  }
  const inputChange = (info, key, id) => {
    const lists = JSON.parse(JSON.stringify(value))
    const list = lists.find((i) => i.id === id)
    list[key] = info
    onChange?.(lists)
  }
  return (
    <div className="arule-cclt">
      {value?.map((i, idx) => {
        return (
          <div key={i.id} className="arule-cclt-item">
            <div className="arule-cclt-item--quota">
              <RuleQuotaInput
                value={i.pointName}
                info={{ id: i.id, key: "pointName" }}
                onChange={(e) => inputChange(e, "pointName", i.id)}
              />
              <SelectOrdinary
                value={i.operator}
                options={CAL_OPTION}
                onChange={(e) => inputChange(e, "operator", i.id)}
                style={{ width: "10%", margin: "0 2em" }}
              />
              <InputNumber value={i.value} onChange={(e) => inputChange(e, "value", i.id)} />
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
