/*
 * @Author: chenmeifeng
 * @Date: 2024-04-07 13:53:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-03 16:07:55
 * @Description: 五防规则
 */
import "./index.less"

import { CloseOutlined, MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Select, Space, TreeSelect } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { DefaultOptionType } from "rc-tree-select/lib/TreeSelect"
import { getDvsMeasurePointsData } from "@/utils/device-funs"

import {
  commonDealRule,
  commonDealRuleDetail,
  delFiveRule,
  editFiveRule,
  getRuleListInfo,
  getSysPiontList,
} from "../../methods/five-rule"
import { IPointInfo } from "../../types"
import { ILoginInfo } from "@/types/i-auth"
import { StorageUserInfo } from "@/configs/storage-cfg"
import { getStorage, getUserInfo, showMsg } from "@/utils/util-funs"
export interface IFiveRulePerateRef {}
export interface ISvgFiveRuleMdlProps {
  pointInfo: IPointInfo
  changeClk?: (e: any) => void
}
interface IRuleInfo {
  rulePoint: string
  ruleType: number
  id: number
}
interface IRuleMap {
  [num: string]: IRuleInfo[]
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
function filterTreeNode(inputValue: string, treeNode: DefaultOptionType) {
  // 根据输入值匹配树节点
  return `${treeNode.title}`.toLowerCase().includes(inputValue.toLowerCase())
}
const lyCompany = process.env.VITE_FIVE_COMPANY === "1"
const FiveRule = forwardRef<IFiveRulePerateRef, ISvgFiveRuleMdlProps>((props, ref) => {
  const { pointInfo, changeClk } = props
  const [curKey, setCurKey] = useState(1) // 当前是和规则1，分规则2

  const [pointList, setPointList] = useState([])
  const editType = useRef("edit")

  const [testheRuleList, settestHeRuleList] = useState<IRuleMap>({})
  const [testfenRuleList, settestFenRuleList] = useState<IRuleMap>({})
  const heRuleApiData = useRef(null)
  const fenRuleApiData = useRef(null)
  const startDataLength = useRef(null)
  const [curCondition, setCurCondition] = useState("1")
  const [userRoleId, setUserRoleId] = useState(null)
  const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)

  const isCanOperate = useMemo(() => {
    return userRoleId !== 1 && userRoleId !== 2
  }, [userRoleId])

  // 实际展示的列表项，根据curKey判断
  const actualRuleList = useMemo(() => {
    if (curKey === 1) {
      return testheRuleList[curCondition]
    }
    return testfenRuleList[curCondition]
  }, [testheRuleList, testfenRuleList, curKey, curCondition])

  // 实际展示的条件数组，根据curKey判断
  const devideOrCloseCondition = useMemo(() => {
    return curKey === 1 ? testheRuleList : testfenRuleList
  }, [curKey, testheRuleList, testfenRuleList])

  // 实际设置的数据，根据curKey判断
  const currentTypeSet = useMemo(() => {
    if (curKey === 1) return settestHeRuleList
    return settestFenRuleList
  }, [curKey, settestHeRuleList, settestFenRuleList])
  const changeTab = useRef((key) => {
    setCurKey(key)
    setCurCondition("1") // 初始化条件选项，默认第一个
  })
  // 测点下拉框
  const getPiontList = async () => {
    const ctrlPointInfo = await getDvsMeasurePointsData({ pointTypes: "1", deviceId: pointInfo?.deviceId })
    const pionts = getSysPiontList(ctrlPointInfo)
    setPointList(pionts)
  }

  const getRuleInfo = async () => {
    const { controlPointName, stationInfo, deviceCode } = pointInfo
    const params = {
      pointName: controlPointName, //控制测点名，传测点前缀为ON/OFF/CB第一个冒号后的测点
      stationCode: stationInfo?.stationCode, //场站编码
      deviceCode,
    }
    const result = await getRuleListInfo(params)
    return result
  }
  const getRuleList = async () => {
    // const { controlPointName, stationInfo, deviceCode } = pointInfo
    // const params = {
    //   pointName: controlPointName, //控制测点名，传测点前缀为ON/OFF/CB第一个冒号后的测点
    //   stationCode: stationInfo?.stationCode, //场站编码
    //   deviceCode,
    // }
    // const result = await getRuleListInfo(params)
    const result = await getRuleInfo()
    const { data } = result
    editType.current = "edit"
    if (!data?.length) {
      editType.current = "add"
    }
    fenRuleApiData.current = data?.find((i) => i.controlType === 0) // 分
    heRuleApiData.current = data?.find((i) => i.controlType === 1) // 和
    startDataLength.current = data
    const heData = commonDealRuleDetail(1, data)
    const fenData = commonDealRuleDetail(0, data)
    settestFenRuleList(fenData)
    settestHeRuleList(heData)
  }
  const changeCondition = useRef((id) => {
    setCurCondition(id)
  })
  const addCondition = () => {
    if (userInfoLocal.roleId !== 1 && userInfoLocal.roleId !== 2) return
    const curRule = curKey === 1 ? settestHeRuleList : settestFenRuleList
    curRule((prev) => {
      prev[Date.now()] = []
      return { ...prev }
    })
  }
  const addRule = () => {
    const info = [{ id: Date.now(), rulePoint: "", ruleType: 1 }]
    const data = curKey === 1 ? testheRuleList : testfenRuleList
    currentTypeSet({
      ...data,
      [curCondition]: data[curCondition].concat(info),
    })
  }
  const removeRule = (id) => {
    currentTypeSet((prev) => {
      prev[curCondition] = prev[curCondition].filter((i) => i.id !== id)
      return { ...prev }
    })
  }
  const changeSelect = (e, key, id) => {
    currentTypeSet((prev) => {
      const info = prev[curCondition]?.find((i) => i.id === id) || null
      info[key] = e
      return { ...prev }
    })
  }

  // 新增/修改 五防规则
  const comfirmRule = async () => {
    if (userRoleId !== 1 && userRoleId !== 2) return showMsg("当前用户不是系统管理员或集控管理员，禁止操作")
    let heFlag = false
    Object.values(testheRuleList).forEach((i) => {
      const unkownPoint = i.filter((j) => !j.rulePoint)
      if (unkownPoint?.length) heFlag = true
    })
    let fenFlag = false
    Object.values(testfenRuleList).forEach((i) => {
      const unkownPoint = i.filter((j) => !j.rulePoint)
      if (unkownPoint?.length) fenFlag = true
    })
    if (heFlag || fenFlag) return showMsg("测点选择框不能为空")

    const heData = commonDealParams(1, testheRuleList)
    const fenData = commonDealParams(0, testfenRuleList)
    const params = [heData, fenData]

    // 删除五防规则
    const ids = [] // 删除规则的id集合
    let curEditRuleState = editType.current
    if (editType.current === "edit") {
      if (fenRuleApiData.current?.ruleInfo && !fenData?.ruleInfo) {
        ids.push(fenRuleApiData.current.id)
      }
      if (heRuleApiData.current?.ruleInfo && !heData?.ruleInfo) {
        ids.push(heRuleApiData.current.id)
      }
      if (ids?.length) await delFiveRule(ids)
      if (ids?.length) {
        const { data } = await getRuleInfo()
        if (!data?.length) curEditRuleState = "add"
      }
    }

    const dataParams = params.filter((i) => i.ruleInfo) || []
    if (!dataParams?.length) return changeClk("")

    // 如果一开始查询的时候没有存在controlType:1这种情况，要调用新增规则接口
    if (dataParams?.length && startDataLength.current?.length) {
      const existTypeList = dataParams.map((i) => i.controlType)
      const startDataTypeList = startDataLength.current.map((i) => i.controlType)
      let unExistRule = []
      existTypeList.forEach((i) => {
        if (!startDataTypeList?.includes(i)) unExistRule.push(i)
      })
      if (unExistRule?.length) {
        const unExistRuleInfo = dataParams?.filter((i) => i.controlType === unExistRule[0])
        await editFiveRule("add", unExistRuleInfo)
        curEditRuleState = "edit"
      }
    }
    await editFiveRule(curEditRuleState, dataParams)
    changeClk("")
  }
  const commonDealParams = (type, data: IRuleMap) => {
    const ruleInfo = Object.keys(data).reduce((prev, cur, idx) => {
      const oneCondition = data[cur].map((i) => `${i.rulePoint}:${i.ruleType}`)?.join(",")
      if (oneCondition) {
        return (prev ? prev + ";" : "") + oneCondition
      }
      return prev
    }, "")
    const { controlPointName, stationInfo, deviceCode } = pointInfo
    const params = {
      controlType: type, //合位控制传1，分位控制传0
      pointName: controlPointName, //控制测点名，传测点前缀为ON/OFF/CB第一个冒号后的测点
      ruleInfo, //多条规则逗号分隔
      stationCode: stationInfo?.stationCode, //场站编码
      deviceCode,
    }
    return params
  }

  // 取消
  const cancel = useRef(() => {
    changeClk("")
  })
  const getRole = async () => {
    const { roleId } = await getUserInfo()
    setUserRoleId(roleId)
  }
  useEffect(() => {
    getPiontList()
    getRuleList()
    getRole()
  }, [])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="sfive-rule">
      <p className="sfive-rule-title">五防规则</p>
      <CloseOutlined
        className="sfive-icon-close"
        style={{ cursor: "pointer" }}
        onClick={() => {
          changeClk?.("")
        }}
      />

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
        <div>
          {/* 金凤五防存在 */}
          {!lyCompany ? (
            <div className="condition">
              {Object.keys(devideOrCloseCondition)?.map((condition, cdIndx) => {
                return (
                  <div className="condition-item" key={condition}>
                    {cdIndx === 0 ? "" : "或"}
                    <span
                      className={`condition-name ${condition === curCondition ? "active" : ""}`}
                      onClick={changeCondition.current.bind(null, condition)}
                    >
                      条件{cdIndx + 1}
                    </span>
                  </div>
                )
              })}
              <PlusCircleOutlined onClick={addCondition} style={{ width: "2em", height: "2em" }} />
            </div>
          ) : (
            ""
          )}
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
                  dropdownStyle={{ width: 700, overflow: "auto", zIndex: 999999 }}
                  placeholder="请选择测点"
                  filterTreeNode={filterTreeNode}
                  allowClear
                  disabled={isCanOperate}
                  onChange={(e) => changeSelect(e, "rulePoint", i.id)}
                  treeData={pointList}
                />
                <span>等于</span>
                <Select
                  options={ruleInfo}
                  value={i.ruleType}
                  style={{ width: "30%" }}
                  dropdownStyle={{ zIndex: 999999 }}
                  disabled={isCanOperate}
                  onChange={(e) => changeSelect(e, "ruleType", i.id)}
                ></Select>
                <MinusCircleOutlined style={{ fontSize: "2.5em", color: "#3E70EE" }} onClick={() => removeRule(i.id)} />
              </div>
            )
          })}
          <Button
            type="primary"
            disabled={isCanOperate}
            icon={<PlusCircleOutlined />}
            className="rule-add-btn"
            onClick={addRule}
          >
            添加规则
          </Button>
        </div>
      </div>
      <div className="sfive-rule-bottom">
        <Space size="large">
          <Button disabled={isCanOperate} onClick={comfirmRule}>
            确认
          </Button>
          <Button disabled={isCanOperate} onClick={cancel.current}>
            取消
          </Button>
        </Space>
      </div>
    </div>
  )
})
export default FiveRule
