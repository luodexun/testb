/*
 * @Author: chenmeifeng
 * @Date: 2024-04-07 13:53:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-12 14:42:07
 * @Description: 五防规则
 */
import "./index.less"

import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Select, Space, TreeSelect } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import { getDvsMeasurePointsData } from "@/utils/device-funs"

import { commonDealRule, editFiveRule, getRuleListInfo, getSysPiontList } from "../../methods/five-rule"
import { IPointInfo } from "../../types"
export interface IFiveRulePerateRef {}
export interface ISvgFiveRuleMdlProps {
  pointInfo: IPointInfo
  changeClk?: (e: any) => void
}
const tabList = [
  { key: 1, label: "合规则" },
  { key: 0, label: "分规则" },
]
const ruleInfo = [
  { value: 1, label: "合位" },
  { value: 0, label: "分位" },
]
const pointInfoList = [
  { key: "pointDesc", label: "遥信点名称" },
  { key: "controlPointDesc", label: "遥控点名称" },
  { key: "pointName", label: "遥信点编码" },
  { key: "controlPointName", label: "遥控点编码" },
  { key: "", label: "五防规则" },
]
const FiveRule = forwardRef<IFiveRulePerateRef, ISvgFiveRuleMdlProps>((props, ref) => {
  const { pointInfo, changeClk } = props
  const [curKey, setCurKey] = useState(1)
  const [heRuleList, setHeRuleList] = useState([])
  const [fenRuleList, setFenRuleList] = useState([])
  const [pointList, setPointList] = useState([])
  const editType = useRef("edit")

  const actualRuleList = useMemo(() => {
    if (curKey === 1) {
      return heRuleList
    }
    return fenRuleList
  }, [heRuleList, fenRuleList, curKey])
  const currentTypeSet = useMemo(() => {
    if (curKey === 1) return setHeRuleList
    return setFenRuleList
  }, [curKey, setHeRuleList, setFenRuleList])
  const changeTab = useRef((key) => {
    setCurKey(key)
  })
  // 测点下拉框
  const getPiontList = async () => {
    const ctrlPointInfo = await getDvsMeasurePointsData({ pointTypes: "1", deviceId: pointInfo?.deviceId })
    const pionts = getSysPiontList(ctrlPointInfo)
    setPointList(pionts)
  }

  const getRuleList = async () => {
    const params = {
      pointName: pointInfo?.controlPointName, //控制测点名，传测点前缀为ON/OFF/CB第一个冒号后的测点
      stationCode: pointInfo?.stationInfo?.stationCode, //场站编码
    }
    const result = await getRuleListInfo(params)
    const { data } = result
    editType.current = "edit"
    if (!data?.length) {
      editType.current = "add"
    }
    const heData = commonDealRule(1, data)
    const fenData = commonDealRule(0, data)
    setHeRuleList(heData)
    setFenRuleList(fenData)
  }

  const addRule = () => {
    currentTypeSet((prev) => {
      const info = [{ id: Date.now(), rulePoint: "", ruleType: 1 }]
      return prev.concat(info)
    })
  }
  const removeRule = (id) => {
    currentTypeSet((prev) => {
      const result = prev.filter((i) => i.id !== id)
      return result
    })
  }
  const changeSelect = (e, key, id) => {
    currentTypeSet((prev) => {
      const info = prev?.find((i) => i.id === id) || null
      info[key] = e
      return [...prev]
    })
  }

  // 新增/修改 五防规则
  const comfirmRule = async () => {
    const params = [commonDealParams(1, heRuleList), commonDealParams(0, fenRuleList)]

    await editFiveRule(editType.current, params)
    changeClk("")
  }
  const commonDealParams = (type, data) => {
    const ruleInfo = data?.map((i) => `${i.rulePoint}:${i.ruleType}`)?.join(",")
    const params = {
      controlType: type, //合位控制传1，分位控制传0
      pointName: pointInfo?.controlPointName, //控制测点名，传测点前缀为ON/OFF/CB第一个冒号后的测点
      ruleInfo, //多条规则逗号分隔
      stationCode: pointInfo?.stationInfo?.stationCode, //场站编码
    }
    return params
  }

  // 取消
  const cancel = useRef(() => {
    changeClk("")
  })

  useEffect(() => {
    getPiontList()
    getRuleList()
  }, [])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="sfive-rule">
      <div className="sfive-rule-tab">
        {tabList.map((i) => {
          return (
            <div
              className={`rule-tab-item ${curKey === i.key ? "active" : "unactive"}`}
              key={i.key}
              onClick={() => changeTab.current(i.key)}
            >
              {i.label}
            </div>
          )
        })}
      </div>
      <div className="sfive-rule-content">
        <div className="rule-content-dc">
          {pointInfoList.map((i) => {
            return (
              <div className="content-dc-item" key={i.label}>
                <span>{i.label}：</span>
                <span>{pointInfo[i.key] || ""}</span>
              </div>
            )
          })}
        </div>
        <div className="content-dc-rule">
          {actualRuleList?.map((i, index) => {
            return (
              <div className="rule-item" key={i.id}>
                <span className="rule-item-circel">{index + 1}</span>
                <TreeSelect
                  showSearch
                  style={{ width: "40%" }}
                  value={i.rulePoint}
                  dropdownStyle={{ maxHeight: 200, overflow: "auto" }}
                  placeholder="请选择测点"
                  allowClear
                  treeDefaultExpandAll
                  onChange={(e) => changeSelect(e, "rulePoint", i.id)}
                  treeData={pointList}
                />
                {/* <Select
                  options={pointList}
                  value={i.rulePoint}
                  style={{ width: "40%" }}
                  onChange={(e) => changeSelect(e, "rulePoint", i.id)}
                ></Select> */}
                <span>等于</span>
                <Select
                  options={ruleInfo}
                  value={i.ruleType}
                  style={{ width: "30%" }}
                  onChange={(e) => changeSelect(e, "ruleType", i.id)}
                ></Select>
                <MinusCircleOutlined style={{ fontSize: "2.5em", color: "#3E70EE" }} onClick={() => removeRule(i.id)} />
              </div>
            )
          })}
          <Button type="primary" icon={<PlusCircleOutlined />} className="rule-add-btn" onClick={addRule}>
            添加
          </Button>
        </div>
      </div>
      <div className="sfive-rule-bottom">
        <Space size="large">
          <Button onClick={comfirmRule}>确认</Button>
          <Button onClick={cancel.current}>取消</Button>
        </Space>
      </div>
    </div>
  )
})
export default FiveRule
