/*
 * @Author: chenmeifeng
 * @Date: 2024-04-28 11:28:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-10-28 13:49:01
 * @Description: 通讯中断列表
 */
import { useAtomValue } from "jotai"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import AlarmConfirmModel from "@/components/alarm-confirm-model"
import { IOperateProps as IComfirmProps, IPerateRef as IComfirmRefs } from "@/components/alarm-confirm-model"
import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"
import CustomModal from "@/components/custom-modal"
import CustomTable from "@/components/custom-table"
import { COMMON_DEVICE_TYPE } from "@/configs/dvs-control"
import { StorageStnDvsType } from "@/configs/storage-cfg"
import usePageSearch from "@/hooks/use-page-search"
import useTableSelection from "@/hooks/use-table-selection"
import { AtomConfigMap } from "@/store/atom-config"
import { AtomStation } from "@/store/atom-station"
import { TDeviceType } from "@/types/i-config"
import { IDvsStateDetail, IDvsStateSchForm, IStnDvsType4LocalStorage } from "@/types/i-device"
import { getStorage, showMsg } from "@/utils/util-funs"

import { COMLOSS_COLUMN, COMLOSS_COLUMN_FORM_ITEMS, COMLOSS_COLUMN_SCH_FORM_BTNS } from "../configs"
import { comfirmState, getAllComlossData } from "../methods"

export interface IOperateProps {
  // buttonClick: () => void
  comlossData: Array<IDvsStateDetail>
}
export interface IPerateRef {}
const rowSelectProps = {
  needInfo: true,
  getCheckboxProps: (record: IDvsStateDetail) => ({
    disabled: record.firstFlag !== 1, // Column configuration not to be checked
  }),
}
const ComlossList = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { comlossData } = props
  const [isCurSearch, setIsCurSearch] = useState(true)
  const formRef = useRef<IFormInst | null>(null)
  const modeRef = useRef(null)
  //搜索组件数据集合
  const [formList, setFormItemConfig] = useState({})
  const [deviceType, setDeviceType] = useState("SYZZZ")
  const currentChoose = useRef([])
  const deviceTypesOfSt = useRef(getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType))
  const { deviceTypeMap, deviceStdNewStateMap } = useAtomValue(AtomConfigMap).map

  const { stationList } = useAtomValue(AtomStation)
  const { rowSelection, selectedRows } = useTableSelection(rowSelectProps)

  // 执行查询的钩子
  const { dataSource, loading, pagination, onSearch } = usePageSearch<IDvsStateSchForm, IDvsStateDetail>(
    { serveFun: getAllComlossData },
    {
      formRef,
      needFirstSch: false,
    },
  )
  const comlossActualList = useMemo(() => {
    return isCurSearch ? dataSource : comlossData
  }, [isCurSearch, comlossData, dataSource])
  const onSchValueChgRef = useCallback(
    async (changeVal) => {
      const [chgedKey, chgedVal] = Object.entries(changeVal || {})?.[0] || []
      if (chgedKey === "stationCode") {
        // if (!deviceTypesOfSt) deviceTypesOfSt.current = getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)
        // const stationId = stationList?.find((e) => e.stationCode == chgedVal)?.id || null
        // const items = deviceTypesOfSt.current.find((e) => e.stationId == stationId)
        // const deviceTypeOptions = getIntersection(items?.deviceTypes || [], chgedVal)
        // formRef.current.getInst()?.setFieldsValue({ deviceType: undefined })
        // setFormItemConfig((prevState) => ({ ...prevState, deviceType: { options: deviceTypeOptions } }))
      } else if (chgedKey === "deviceType") {
        setDeviceType(chgedVal as any)
      }
    },
    [stationList],
  )

  const searchTable = useRef(() => {
    onSearch()
    setIsCurSearch(true)
  })
  const actionTable = (type: string, select) => {
    if (type === "ensure") {
      if (!selectedRows.length) {
        showMsg("请至少选择一条！")
        return // messageApi.open({ type: "warning", content: "请至少选择一条！" })
      }
      comfirmState(selectedRows)
    }
  }

  const getIntersection = (data = [], stationIds) => {
    if (!data.length) return []
    const newData = data
      .filter((item) => Object.prototype.hasOwnProperty.call(COMMON_DEVICE_TYPE, item))
      .map((item) => ({
        label: COMMON_DEVICE_TYPE[item],
        value: item,
        stationIds,
      }))

    return newData
  }
  const clickComfirm = (record: IDvsStateDetail, { key }) => {
    currentChoose.current = [record]
    if (key === "confirmBtn") {
      // 确认
      console.log("queren")
      comfirmState([record])
    }
  }
  const initData = () => {
    if (deviceTypeMap) {
      const dvsTypeList = Object.keys(deviceTypeMap)?.reduce((pre, item) => {
        pre.push({
          label: deviceTypeMap[item],
          value: item,
        })
        return pre
      }, [])
      setFormItemConfig((prevState) => ({ ...prevState, deviceType: { options: dvsTypeList } }))
      setDeviceType("SYZZZ")
      const formIns = formRef?.current?.getInst()
      formIns?.setFieldsValue({ deviceType, mainState: "100" })
      formIns?.submit()
    }
  }
  useEffect(() => {
    if (deviceType && deviceStdNewStateMap) {
      const stateList = deviceStdNewStateMap?.[deviceType]
        ?.filter((i) => i.stateType === "MAIN")
        ?.map((i) => {
          return {
            label: i.stateDesc,
            value: i.state,
          }
        })
      setFormItemConfig((prevState) => ({ ...prevState, mainState: { options: stateList } }))
    }
  }, [deviceType, deviceStdNewStateMap])
  useEffect(() => {
    initData()
  }, [deviceTypeMap])
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="comloss">
      <CustomForm
        ref={formRef}
        loading={loading}
        itemOptionConfig={formList}
        itemOptions={COMLOSS_COLUMN_FORM_ITEMS}
        buttons={COMLOSS_COLUMN_SCH_FORM_BTNS}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
        onSearch={searchTable.current}
        onAction={actionTable}
      />
      <CustomTable
        rowKey="id"
        limitHeight
        loading={loading}
        rowSelection={rowSelection}
        columns={COMLOSS_COLUMN({ onClick: clickComfirm })}
        dataSource={comlossActualList}
        pagination={pagination}
      />
      {/* <CustomModal<IComfirmProps, IComfirmRefs>
        ref={modeRef}
        width="30%"
        title="确认备注"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        Component={AlarmConfirmModel}
        componentProps={{ buttonClick: modelClick.current }}
      /> */}
    </div>
  )
})
export default ComlossList
