/*
 * @Author: chenmeifeng
 * @Date: 2024-03-05 14:14:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-03 15:58:20
 * @Description:
 */
import "./index.less"

import { CloseOutlined } from "@ant-design/icons"
import { getStn2DvsTypeInfoMap } from "@pages/control-log/methods"
import { Input } from "antd"
import { useAtomValue } from "jotai"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { doNoParamServer } from "@/api/serve-funs"
import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import usePageSearch from "@/hooks/use-page-search"
import { userInfoAtom } from "@/store/atom-auth"
import { AtomConfigMap } from "@/store/atom-config"

// import { getAlarmLevelList, getAllBelongSystem, getBrakeLevelList } from "../alarm-history/methods"
import AddShield, { IOperateProps, IPerateRef } from "./components/add-shield"
import CancelShield from "./components/cancel-shield"
import { alarm_shied_columns, ALARM_SHIELD_FORM_ITEMS, ALARM_SHIELD_SCH_FORM_BTNS } from "./configs"
import { doExportReportPower, getAlarmShieldData, onAlarmShSchFormChange, saveRule } from "./methods"
import { IAlarmShieldData, IAlarmShieldParam } from "./types"
import { getUserInfo, showMsg } from "@/utils/util-funs"
export default function AlarmShield() {
  const modeRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  // const [columns, setColumns] = useState(ALARM_SHIELD_COLUMNS)
  // const isDetailState = useRef(false)
  const [isDetailState, setIsDetailState] = useState(false)
  const [isEditState, setIsEditState] = useState(false)
  const [btnCombination, setBtnCombination] = useState(ALARM_SHIELD_SCH_FORM_BTNS)
  const [optionMap, setOptionMap] = useState(null)
  const isFirst = useRef(true)
  const formRef = useRef<IFormInst | null>(null)
  //搜索组件数据集合
  const [formList, setFormItemConfig] = useState({})
  const [showSearch, setShowSearch] = useState(false)
  const [searchVal, setSearchVal] = useState("")
  const [userRoleId, setUserRoleId] = useState(null)
  const userInfo = useAtomValue(userInfoAtom)
  const { deviceTypeOfStationMap, deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const dvsTypeInfoOfStnMapRef = useRef<ReturnType<typeof getStn2DvsTypeInfoMap>>({})
  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch, setDataSource, setLoading } = usePageSearch<
    IAlarmShieldParam,
    IAlarmShieldData
  >(
    { serveFun: getAlarmShieldData },
    {
      formRef,
      // needFirstSch: false,
      // dealRecords: (records) => dealControlLogData(records, controlTypeMap, deviceTypeMap),
    },
  )

  const deviceTypeMapRef = useRef(deviceTypeMap)
  deviceTypeMapRef.current = deviceTypeMap
  const onSchValueChgRef = async (changedValue: IAlarmShieldParam) => {
    const dvsTypeInfoOfStnMap = dvsTypeInfoOfStnMapRef.current
    const deviceTypeMap = deviceTypeMapRef.current
    const forItemCfgData = await onAlarmShSchFormChange(
      changedValue,
      formRef.current,
      dvsTypeInfoOfStnMap,
      deviceTypeMap,
    )
    setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
  }
  const setTableData = useCallback(
    (info) => {
      const { value, curkey, record } = info
      const newData = [...dataSource]
      const index = newData.findIndex((item) => record.virtualId === item.virtualId)
      const item = newData[index]
      newData.splice(index, 1, {
        ...item,
        [curkey]: value,
      })
      setDataSource(newData)
    },
    [dataSource, setDataSource],
  )
  const colums = useMemo(() => {
    return alarm_shied_columns(isDetailState, isEditState, setTableData, optionMap)
  }, [isDetailState, isEditState, setTableData, optionMap])

  const getAllOptions = async () => {
    Promise.allSettled([
      doNoParamServer("getAllBrakeLevel"),
      doNoParamServer("getSubSystemTypeData"),
      doNoParamServer("getAllAlarmLevel"),
    ]).then((res: any) => {
      const brakeLevelOption =
        res?.[0]?.status === "fulfilled" && res?.[0]?.value?.length
          ? res?.[0]?.value.map((i) => {
              return {
                label: i.name,
                value: i.id,
              }
            })
          : []
      const beSysOption =
        res?.[1]?.status === "fulfilled" && res?.[1]?.value?.length
          ? res?.[1]?.value.map((i) => {
              return {
                label: i.name,
                value: i.id,
              }
            })
          : []
      const alarmLevelOption =
        res?.[2]?.status === "fulfilled" && res?.[2]?.value?.length
          ? res?.[2]?.value.map((i) => {
              return {
                label: i.name,
                value: i.id,
              }
            })
          : []
      // console.log(res, "res", beSysOption, alarmLevelOption, brakeLevelOption)
      setOptionMap({
        beSysOption: beSysOption,
        alarmLevelOption: alarmLevelOption,
        brakeLevelOption: brakeLevelOption,
      })
    })
  }
  const onFormAction = async (type) => {
    if (type === "add" || type === "edit") {
      const { roleId } = await getUserInfo()
      setUserRoleId(roleId)
      if (roleId !== 1 && roleId !== 2) return showMsg("当前用户不是系统管理员或集控管理员，禁止操作")
    }
    if (type === "add") {
      setIsModalOpen(true)
    } else if (type === "cancel") {
      setCancelOpen(true)
    } else if (type === "edit") {
      if (!dataSource?.length) return
      if (isEditState) {
        setLoading(true)
        const valid = await saveRule(dataSource)
        console.log(valid, "valid")
        setLoading(false)
        await onSearch()
      }
      setIsEditState((prev) => {
        return !prev
      })
    } else if (type === "detail") {
      setIsDetailState((prev) => {
        return !prev
      })
    } else if (type === "export") {
      const formIns = formRef.current.getInst()
      const formData = formIns.getFieldsValue()
      doExportReportPower(formData)
    } else if (type === "search") {
      setShowSearch(!showSearch)
    }
  }
  const closeModal = useRef((type) => {
    setIsModalOpen(false)
    setCancelOpen(false)
    if (type === "ok") {
      onSearch()
    }
  })
  const searchDevice = useCallback(
    (e) => {
      setShowSearch(false)
      setSearchVal(e)
      const list = dataSource.map((i) => {
        const isSeach = e ? i.alarmDesc?.indexOf(e) !== -1 : false
        return {
          ...i,
          isSeach,
        }
      })
      setDataSource([...list])
    },
    [dataSource],
  )
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      getAllOptions()
      // 判断是是否系统管理员,初始化按钮
      // if (userInfo?.roleId !== 1) {
      //   const groud = JSON.parse(JSON.stringify(ALARM_SHIELD_SCH_FORM_BTNS)) || []
      //   const idx = groud.findIndex((i) => i.name === "edit")
      //   groud.splice(idx, 1)
      //   setBtnCombination(groud)
      // }
    }
  }, [userInfo])
  useEffect(() => {
    if (userRoleId === 1 || userRoleId === 2) {
      const groud = JSON.parse(JSON.stringify(ALARM_SHIELD_SCH_FORM_BTNS))
      groud.forEach((i) => {
        if (i.name === "edit") {
          i.label = isEditState ? "保存" : "编辑"
        }
      })
      setBtnCombination(groud)
    }
  }, [isEditState, userRoleId])
  useEffect(() => {
    dvsTypeInfoOfStnMapRef.current = getStn2DvsTypeInfoMap(deviceTypeOfStationMap, deviceTypeMap)
  }, [deviceTypeMap, deviceTypeOfStationMap])
  return (
    <div className="l-full page-wrap alarm-shield">
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="30%"
        title="新增屏蔽"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={AddShield}
        componentProps={{ buttonClick: closeModal.current }}
      />
      <CustomModal<IOperateProps, IPerateRef>
        ref={modeRef}
        width="70%"
        title="屏蔽取消"
        destroyOnClose
        open={cancelOpen}
        footer={null}
        onCancel={() => setCancelOpen(false)}
        Component={CancelShield}
        componentProps={{ buttonClick: closeModal.current }}
      />
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formList}
        itemOptions={ALARM_SHIELD_FORM_ITEMS}
        buttons={btnCombination}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
        onSearch={onSearch}
        onAction={onFormAction}
      />
      <CustomTable
        rowKey="virtualId"
        limitHeight
        loading={loading}
        columns={colums}
        dataSource={dataSource}
        pagination={pagination}
      />
      {showSearch ? (
        <div className="float-search">
          <div className="float-search-title">
            <span>查找</span>
            <CloseOutlined onClick={() => setShowSearch(false)} />
          </div>
          <Input.Search
            enterButton={false}
            defaultValue={searchVal}
            onSearch={searchDevice}
            placeholder="请输入故障描述"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  )
}
