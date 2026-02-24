/*
 * @Author: chenmeifeng
 * @Date: 2024-04-07 13:53:12
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-26 10:12:41
 * @Description: 五防规则
 */
import "./edit.less"

import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Button, Select, Space, TreeSelect } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
// import { DefaultOptionType } from "rc-tree-select/lib/TreeSelect"
import { getDvsMeasurePointsData, queryDevicesByParams } from "@/utils/device-funs"

import { commonDealRuleDetail, delFiveRule, editFiveRule, getRuleListInfo, getSysPiontList } from "../methods/edit"
import { IRuleInfo } from "../types"
import { ILoginInfo } from "@/types/i-auth"
import { StorageUserInfo } from "@/configs/storage-cfg"
import { getStorage, getUserInfo, showMsg } from "@/utils/util-funs"
import { editColumns } from "../configs/model"
import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"
export interface IFiveRulePerateRef {}
export interface ISvgFiveRuleMdlProps {
  pointInfo: IRuleInfo
  editType: string
  controlType: number
  changeClk?: (e: any) => void
}
interface IRuleInfos {
  rulePoint: string
  ruleType: number
  id: number
}
interface IRuleMap {
  [num: string]: IRuleInfos[]
}
const tabList = [
  { key: 1, label: "合规则" },
  { key: 0, label: "分规则" },
]
const ruleInfo = [
  { value: 1, label: "合位" },
  { value: 0, label: "分位" },
]

function filterTreeNode(inputValue: string, treeNode) {
  // 根据输入值匹配树节点
  return `${treeNode.title}`.toLowerCase().includes(inputValue.toLowerCase())
}
const lyCompany = process.env.VITE_FIVE_COMPANY === "1"
const FiveRule = forwardRef<IFiveRulePerateRef, ISvgFiveRuleMdlProps>((props, ref) => {
  const { pointInfo, editType, controlType = 1, changeClk } = props
  const [curKey, setCurKey] = useState(controlType) // 当前是和规则1，分规则0

  const [currentRuleBasicInfo, setCurrentRuleBasicInfo] = useState({
    pointName: "",
    stationCode: "",
    deviceId: null,
    deviceCode: "",
    controlType: 1,
    id: null,
  })
  const [pointList, setPointList] = useState([])
  const formRef = useRef<IFormInst | null>(null)
  const [formItemConfigs, setFormItemConfigs] = useState({})
  // const editType = useRef("edit")

  const [testheRuleList, settestHeRuleList] = useState<IRuleMap>({})
  const [testfenRuleList, settestFenRuleList] = useState<IRuleMap>({})
  const heRuleApiData = useRef(null)
  const fenRuleApiData = useRef(null)
  const startDataLength = useRef(null)
  const [curCondition, setCurCondition] = useState("1")
  const currentCondition = useRef(null)
  const [userRoleId, setUserRoleId] = useState(null)
  const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)

  const isCanOperate = useMemo(() => {
    return false
    // return userRoleId !== 1 && userRoleId !== 2
  }, [userRoleId])

  const actualTabs = useMemo(() => {
    if (editType === "add") return tabList
    if (controlType === 1) return tabList.filter((i) => i.key === 1)
    return tabList.filter((i) => i.key === 0)
  }, [controlType, editType])

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
  const changeTab = (key) => {
    setCurKey(key)
    const crtList = key === 1 ? testheRuleList : testfenRuleList
    const fisrtCondition = Object.keys(crtList)?.[0]
    setCurCondition(fisrtCondition) // 初始化条件选项，默认第一个
    currentCondition.current = fisrtCondition
  }
  // 测点下拉框
  const getPiontList = async () => {
    const ctrlPointInfo = await getDvsMeasurePointsData({ pointTypes: "1", deviceId: currentRuleBasicInfo?.deviceId })
    const pionts = getSysPiontList(ctrlPointInfo)
    setPointList(pionts)
  }

  const getRuleInfo = async () => {
    const { pointName, stationCode, deviceCode } = pointInfo
    const params = {
      pointName: pointName, //控制测点名，传测点前缀为ON/OFF/CB第一个冒号后的测点
      stationCode: stationCode, //场站编码
      deviceCode,
    }
    const result = await getRuleListInfo(params)
    return result
  }
  const getRuleList = async () => {
    if (pointInfo && pointInfo.controlType === 0) {
      fenRuleApiData.current = pointInfo
      const fenData = commonDealRuleDetail(0, [pointInfo])
      settestFenRuleList(fenData)
    } else if (pointInfo && pointInfo.controlType === 1) {
      heRuleApiData.current = pointInfo
      const heData = commonDealRuleDetail(1, [pointInfo])
      settestHeRuleList(heData)
    }
  }
  const changeCondition = useRef((id) => {
    setCurCondition(id)
    currentCondition.current = id
  })
  const addCondition = () => {
    // if (userInfoLocal.roleId !== 1 && userInfoLocal.roleId !== 2) return
    const curRule = curKey === 1 ? settestHeRuleList : settestFenRuleList
    const date = Date.now()
    curRule((prev) => {
      prev[date] = []
      return { ...prev }
    })
    setCurCondition(date.toString())
    currentCondition.current = date.toString()
  }
  const timer = useRef(null)
  const addRule = () => {
    timer.current && clearTimeout(timer.current)
    const info = [{ id: Date.now(), rulePoint: "", ruleType: 1 }]
    const data = curKey === 1 ? testheRuleList : testfenRuleList
    if (!Object.keys(data)?.length) {
      addCondition()
      const datas = curKey === 1 ? testheRuleList : testfenRuleList
      timer.current = setTimeout(() => {
        currentTypeSet({
          ...data,
          [currentCondition.current]: datas[currentCondition.current].concat(info),
        })
      }, 1000)
      return
    }
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
    // if (userRoleId !== 1 && userRoleId !== 2) return showMsg("当前用户不是系统管理员或集控管理员，禁止操作")
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
    let curEditRuleState = editType
    if (editType === "edit") {
      if (fenRuleApiData.current?.ruleInfo && !fenData?.ruleInfo) {
        ids.push(fenRuleApiData.current.id)
      }
      if (heRuleApiData.current?.ruleInfo && !heData?.ruleInfo) {
        ids.push(heRuleApiData.current.id)
      }
      if (ids?.length) await delFiveRule(ids)
      // if (ids?.length) {
      //   const { data } = await getRuleInfo()
      //   if (!data?.length) curEditRuleState = "add"
      // }
    }

    const dataParams = params.filter((i) => i.ruleInfo) || []
    if (!dataParams?.length) return changeClk?.("")

    // 如果一开始查询的时候没有存在controlType:1这种情况，要调用新增规则接口
    // if (dataParams?.length && startDataLength.current?.length) {
    //   const existTypeList = dataParams.map((i) => i.controlType)
    //   const startDataTypeList = startDataLength.current.map((i) => i.controlType)
    //   let unExistRule = []
    //   existTypeList.forEach((i) => {
    //     if (!startDataTypeList?.includes(i)) unExistRule.push(i)
    //   })
    //   if (unExistRule?.length) {
    //     const unExistRuleInfo = dataParams?.filter((i) => i.controlType === unExistRule[0])
    //     await editFiveRule("add", unExistRuleInfo)
    //     curEditRuleState = "edit"
    //   }
    // }
    await editFiveRule(curEditRuleState, dataParams)
    changeClk?.("ok")
  }
  const commonDealParams = (type, data: IRuleMap) => {
    const ruleInfo = Object.keys(data).reduce((prev, cur) => {
      const oneCondition = data[cur].map((i) => `${i.rulePoint}:${i.ruleType}`)?.join(",")
      if (oneCondition) {
        return (prev ? prev + ";" : "") + oneCondition
      }
      return prev
    }, "")
    const { pointName, stationCode, deviceCode, id } = currentRuleBasicInfo
    const params = {
      controlType: type, //合位控制传1，分位控制传0
      pointName: pointName, //控制测点名，传测点前缀为ON/OFF/CB第一个冒号后的测点
      ruleInfo, //多条规则逗号分隔
      stationCode: stationCode, //场站编码
      deviceCode,
      id: id,
    }
    return params
  }
  const formChange = async (changedValue) => {
    if (changedValue.stationCode) {
      const resData = await queryDevicesByParams({ stationCode: changedValue.stationCode, deviceType: "SYZZZ" })
      const dvsId = resData?.[0]?.deviceId
      const dvsCode = resData?.[0]?.deviceCode
      setCurrentRuleBasicInfo((prev) => {
        return { ...prev, stationCode: changedValue.stationCode, deviceId: dvsId, deviceCode: dvsCode }
      })
      // getYKPoints(dvsId)
    } else if (changedValue.pointName) {
      setCurrentRuleBasicInfo((prev) => {
        return { ...prev, pointName: changedValue.pointName }
      })
    } else if (changedValue.controlType) {
      setCurrentRuleBasicInfo((prev) => {
        return { ...prev, controlType: changedValue.controlType }
      })
    }
  }
  const getYKPoints = async (dvsId) => {
    const res = await getDvsMeasurePointsData({ pointTypes: "3,4", deviceId: dvsId })
    const pointLs = res?.map((i) => {
      return {
        label: i.pointDesc,
        value: i.pointName,
      }
    })
    setFormItemConfigs((prev) => {
      return { ...prev, pointName: { options: pointLs } }
    })
  }
  // 取消
  const cancel = useRef(() => {
    changeClk?.("")
  })
  const getRole = async () => {
    const { roleId } = await getUserInfo()
    setUserRoleId(roleId)
  }
  useEffect(() => {
    if (!pointInfo) return
    const { deviceCode, deviceId, stationCode, pointName, controlType, id } = pointInfo
    setCurrentRuleBasicInfo({
      deviceCode,
      deviceId,
      stationCode,
      pointName,
      controlType,
      id,
    })
    const formInst = formRef.current?.getInst?.()
    formInst.setFieldsValue({ stationCode: stationCode, pointName: pointName, controlType: controlType })
    getRuleList()
    // getRole()
  }, [pointInfo])
  useEffect(() => {
    if (currentRuleBasicInfo?.deviceId) {
      getPiontList()
      getYKPoints(currentRuleBasicInfo?.deviceId)
    }
  }, [currentRuleBasicInfo.deviceId])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="sfive-rule">
      <CustomForm
        ref={formRef}
        formOptions={{ layout: "horizontal", onValuesChange: formChange }}
        itemOptionConfig={formItemConfigs}
        itemOptions={editColumns(editType === "edit")}
      />
      <div className="sfive-rule-tab">
        {actualTabs.map((i) => {
          return (
            <div
              className={`rule-tab-item ${curKey === i.key ? "active" : "unactive"}`}
              key={i.key}
              onClick={() => changeTab(i.key)}
            >
              {i.label}
            </div>
          )
        })}
      </div>
      <div className="sfive-rule-content">
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
