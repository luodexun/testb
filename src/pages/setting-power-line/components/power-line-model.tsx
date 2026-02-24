/*
 * @Author: chenmeifeng
 * @Date: 2023-10-19 14:04:16
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-04-23 15:27:25
 * @Description: 风、光新增编辑弹框
 */
import "./power-line-model.less"

import { Button } from "antd"
import { useAtomValue } from "jotai"
import React, { forwardRef, MutableRefObject, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { StorageStnDvsType } from "@/configs/storage-cfg"
import { AtomStation } from "@/store/atom-station"
import { IStnDvsType4LocalStorage } from "@/types/i-device.ts"
import { getStorage, keepTwoDecimalFull } from "@/utils/util-funs"

import { POWER_MODEL_FORM, POWER_MODEL_PV_FORM } from "../configs"
import { calculateTbData, calItAndStep, compareByKey, editDisableList, getCurDeviceModel } from "../methods"
import { ICurvePiontList, IPowerData, IPwLineMdSchForm, TModelFrAndTbInfo, TPowerAddOrEditFormField } from "../types"
import EditTable from "./edit-table"
import { TDeviceType } from "@/types/i-config"

export interface IPerateRef {
  setConfirmMsg: (step: string) => void
}
export interface IPwrLineMdlProps {
  data?: TModelFrAndTbInfo
  deviceType: TDeviceType
  buttonClick?: (type: "ok" | "close", data?: TModelFrAndTbInfo) => void
  editType?: string
  loading?: boolean
  selectRowInfo?: IPowerData
}
const PwLnModel = forwardRef<IPerateRef, IPwrLineMdlProps>((props, ref) => {
  const { buttonClick, deviceType, editType, selectRowInfo } = props
  const [confirmMsg, setConfirmMsg] = useState("")
  //搜索组件数据集合
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TPowerAddOrEditFormField>>({})
  const formRef = useRef<IFormInst | null>(null)
  const { stationOptions4Id } = useAtomValue(AtomStation)
  const childRef: MutableRefObject<any> = useRef(null)
  const [dataSource, setDataSource] = useState<ICurvePiontList[]>([])
  const currentId = useRef(0)
  const currentCurveId = useRef(0)

  const formInst = formRef.current?.getInst()

  const actualDvsType = useMemo(() => {
    return selectRowInfo ? selectRowInfo.deviceType : deviceType
  }, [deviceType, selectRowInfo])

  // 判断哪个场站下有WT/PVINV这个设备类型
  const hasWTDvTypeStation = useMemo(() => {
    const hasWTDvTypeStation =
      getStorage<IStnDvsType4LocalStorage[]>(StorageStnDvsType)?.filter((i) => i.deviceTypes.includes(actualDvsType)) ||
      []
    return hasWTDvTypeStation.map((i) => {
      return {
        label: stationOptions4Id.find((item) => item.value === i.stationId)?.label || "1",
        value: stationOptions4Id.find((item) => item.value === i.stationId)?.value || "2",
      }
    })
  }, [stationOptions4Id, actualDvsType])

  const deviceTypeDifferentKey = useMemo(() => {
    return actualDvsType === "WT" ? "beanWindSpeed" : "irradiance"
  }, [actualDvsType])

  const deviceTypeOfTable = useMemo(() => {
    return actualDvsType === "WT" ? "mngWtPowercurvePointList" : "mngPvPowercurvePointList"
  }, [actualDvsType])

  useEffect(() => {
    const formInsts = formRef.current?.getInst()
    if (selectRowInfo) {
      const {
        id,
        stationId,
        modelId,
        deviceType: dvsType,
        standardAirDensity,
        actualAirDensity,
        actualTemperature,
        standardTemperature,
      } = selectRowInfo
      console.log(selectRowInfo, "selectRowInfo")

      let mngWtPowercurvePointLists: ICurvePiontList[] = selectRowInfo[deviceTypeOfTable].sort(
        compareByKey(deviceTypeDifferentKey),
      )
      mngWtPowercurvePointLists = mngWtPowercurvePointLists.map((i) => {
        return {
          ...i,
          [deviceTypeDifferentKey]: keepTwoDecimalFull(i[deviceTypeDifferentKey]),
          standardActivePower: keepTwoDecimalFull(i.standardActivePower),
          actualActivePower: keepTwoDecimalFull(i.actualActivePower),
        }
      })
      setDataSource([...mngWtPowercurvePointLists])
      if(!mngWtPowercurvePointLists.length) {
        editType === "edit" && setDataSource([...calculateTbData(2, 25, 0.5, selectRowInfo.id, deviceTypeDifferentKey)])
      }

      // 编辑初始化
      console.log(deviceTypeDifferentKey, "deviceTypeDifferentKey")

      const { min, max, step } = calItAndStep(mngWtPowercurvePointLists, deviceTypeDifferentKey)

      currentId.current = id
      // currentCurveId.current = mngWtPowercurvePointLists?.length ? mngWtPowercurvePointLists[0].curveId : null
      formInsts?.setFieldsValue({
        interval: [min, max],
        step: step,
        stationId,
        modelId,
        standardAirDensity,
        actualAirDensity,
        standardTemperature,
        actualTemperature,
      })
      setFormItemConfig((prevState) => ({ ...prevState, interval: { value: [min, max] } }))
    } else {
      formInsts?.setFieldsValue({ step: 0.5, interval: [2, 25] })
      setDataSource([...calculateTbData(2, 25, 0.5, null, deviceTypeDifferentKey)]) // 资源区间上下限为[2,25], 风速步长默认0.5
    }
    setFormItemConfig((prevState) => ({ ...prevState, ...editDisableList(editType == "see") }))
    setFormItemConfig((prevState) => ({
      ...prevState,
      stationId: { options: hasWTDvTypeStation, disabled: editType !== "add" },
    }))
    allAsyncPromise(selectRowInfo?.stationId, actualDvsType).then((r) => r)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualDvsType, hasWTDvTypeStation])

  const allAsyncPromise = async (stationId: number, dvsType) => {
    const deviceMode = await getCurDeviceModel(stationId, dvsType)
    setFormItemConfig((prevState) => {
      return { ...prevState, modelId: { options: deviceMode || [], disabled: editType !== "add" } }
    })
  }

  const onFinish = (formValue: IPwLineMdSchForm) => {
    buttonClick?.("ok", {
      tableData: childRef.current?.dataSource,
      formList: { ...formValue, id: currentId.current },
      deviceType: actualDvsType,
    })
  }
  const btnClkRef = useRef((type: "ok" | "close") => {
    if (type === "ok") {
      formRef.current?.submit()
      return
    }
    buttonClick?.("close")
  })

  const onSchValueChgRef = async (changedValue: IPwLineMdSchForm) => {
    if (formInst && (changedValue.step || changedValue.interval)) {
      const { interval, step } = formRef.current.getFormValues() || { interval: [2, 25], step: 0.5 }
      const min = interval?.[0] || 0
      const max = interval?.[1] || 25
      if(editType === "edit") {
       setDataSource([...calculateTbData(Number(min), Number(max), Number(step), selectRowInfo.id, deviceTypeDifferentKey)])
      } else if(editType === "add") {
       setDataSource([...calculateTbData(Number(min), Number(max), Number(step), null, deviceTypeDifferentKey)])
      }
    } else if (formInst && changedValue.stationId) {
      await allAsyncPromise(changedValue.stationId, actualDvsType)
    }
  }
  const actualShowForm = useMemo(() => {
    return actualDvsType === "WT" ? POWER_MODEL_FORM : POWER_MODEL_PV_FORM
  }, [actualDvsType])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    confirmMsg: confirmMsg,
    setConfirmMsg,
  }))
  return (
    <div className="powerM">
      <CustomForm
        ref={formRef}
        itemOptionConfig={formItemConfig}
        itemOptions={actualShowForm}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
        onSearch={onFinish}
        loading={true}
      />
      <div className="powerM-content">
        <EditTable options={dataSource} ref={childRef} deviceType={actualDvsType} disabled={editType === "see"} />
      </div>
      {editType !== "see" ? (
        <div className="confirm-bottom">
          <Button onClick={btnClkRef.current.bind(null, "ok")}>保存</Button>
          <Button onClick={btnClkRef.current.bind(null, "close")}>取消</Button>
        </div>
      ) : null}
    </div>
  )
})

export default PwLnModel
