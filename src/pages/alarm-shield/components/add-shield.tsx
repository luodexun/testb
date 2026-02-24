/*
 * @Author: chenmeifeng
 * @Date: 2024-03-05 14:17:45
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-04-01 14:03:17
 * @Description:
 */
export interface IOperateProps {}
export interface IPerateRef {}

import { Button, Flex } from "antd"
import { useAtomValue, useSetAtom } from "jotai"
import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types"
import TreeMenuContext from "@/components/layout-content/context"
import { getStn2DvsTypeInfoMap } from "@/pages/control-log/methods"
import { alarmCountInfoSetAtom } from "@/store/atom-alarm"
import { AtomConfigMap } from "@/store/atom-config"

import {
  SHIELD_ADD_FORM_ITEMS,
  SHIELD_ALARM_ITEMS,
  SHIELD_ALARM_TIME_CANCEL,
  SHIELD_DEVICE_ITEMS,
  SHIELD_DEVICETYPE_ITEMS,
  SHIELD_MODEL_ITEMS,
  SHIELD_SITE_ITEMS,
} from "../configs/shield-form"
import { addShieldForm, onSHIELDFormChange } from "../methods/shield-form"
import { TShieldForm } from "../types/shield-form"

export interface IPerateRef {}
export interface IOperateProps {
  buttonClick?: (type: "ok" | "close") => void
}

const AddShield = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { buttonClick } = props
  const formRef = useRef<IFormInst | null>(null)
  //组件数据集合
  const [formList, setFormItemConfig] = useState({})
  const [formItemMap, setFormItemMap] = useState(SHIELD_ADD_FORM_ITEMS)
  const { deviceTypeOfStationMap, deviceTypeMap } = useAtomValue(AtomConfigMap).map
  const dvsTypeInfoOfStnMapRef = useRef<ReturnType<typeof getStn2DvsTypeInfoMap>>({})
  const setGlobalValue = useSetAtom(alarmCountInfoSetAtom)
  const { setShieldRemindTime } = useContext(TreeMenuContext)
  useImperativeHandle(ref, () => ({}))
  useEffect(() => {
    dvsTypeInfoOfStnMapRef.current = getStn2DvsTypeInfoMap(deviceTypeOfStationMap, deviceTypeMap)
  }, [deviceTypeMap, deviceTypeOfStationMap])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const btnClkRef = useRef((type: "ok" | "close") => {
    // console.log(formRef.current.getInst()?.getFieldsValue())

    if (type === "ok") {
      formRef.current?.submit()
      return
    }
    buttonClick?.("close")
  })
  const onFinish = async (formValue: TShieldForm) => {
    const dealFun = await addShieldForm(formValue)
    setGlobalValue({
      // alarmInfo: {},
      call: (isErr: boolean) => {
        if (!isErr) return
      },
      // showMqttCount: false,
    })
    console.log(dealFun, formValue, "formValue")
    setShieldRemindTime(formValue?.cancelTime)
    buttonClick?.("ok")
  }
  const onSchValueChgRef = useRef(async (changeVal) => {
    if (changeVal?.["shieldType"]) {
      const val = changeVal["shieldType"]
      if (val === "1") {
        setFormItemMap(() => {
          return SHIELD_ADD_FORM_ITEMS.concat(SHIELD_SITE_ITEMS, SHIELD_ALARM_TIME_CANCEL)
        })
      } else if (val === "2") {
        setFormItemMap(() => {
          return SHIELD_ADD_FORM_ITEMS.concat(
            SHIELD_SITE_ITEMS,
            SHIELD_DEVICETYPE_ITEMS,
            SHIELD_MODEL_ITEMS,
            SHIELD_ALARM_TIME_CANCEL,
          )
        })
      } else if (val === "3") {
        setFormItemMap(() => {
          return SHIELD_ADD_FORM_ITEMS.concat(
            SHIELD_SITE_ITEMS,
            SHIELD_DEVICETYPE_ITEMS,
            SHIELD_MODEL_ITEMS,
            SHIELD_DEVICE_ITEMS,
            SHIELD_ALARM_TIME_CANCEL,
          )
        })
      } else if (val === "4") {
        setFormItemMap(() => {
          return SHIELD_ADD_FORM_ITEMS.concat(
            SHIELD_SITE_ITEMS,
            SHIELD_DEVICETYPE_ITEMS,
            SHIELD_MODEL_ITEMS,
            SHIELD_DEVICE_ITEMS,
            SHIELD_ALARM_ITEMS,
            SHIELD_ALARM_TIME_CANCEL,
          )
        })
      } else if (val === "5") {
        setFormItemMap(() => {
          return SHIELD_ADD_FORM_ITEMS.concat(
            SHIELD_SITE_ITEMS,
            SHIELD_DEVICETYPE_ITEMS,
            SHIELD_MODEL_ITEMS,
            SHIELD_ALARM_ITEMS,
            SHIELD_ALARM_TIME_CANCEL,
          )
        })
      }
      const formInst = formRef.current?.getInst()
      formInst?.setFieldsValue({ modelId: undefined, alarmId: undefined, deviceId: undefined })
      return
    }
    const forItemCfgData = await onSHIELDFormChange(
      changeVal,
      formRef.current,
      dvsTypeInfoOfStnMapRef.current,
      deviceTypeMap,
    )
    setFormItemConfig((prevState) => ({ ...prevState, ...(forItemCfgData || {}) }))
  })
  return (
    <div className="shield-model">
      <CustomForm
        ref={formRef}
        formOptions={{ layout: "horizontal", onValuesChange: onSchValueChgRef.current }}
        itemOptionConfig={formList}
        itemOptions={formItemMap}
        onSearch={onFinish}
      />
      <div className="confirm-btn">
        <Flex gap="small" wrap="wrap" justify="flex-end">
          <Button size="small" onClick={btnClkRef.current.bind(null, "ok")}>
            保存
          </Button>
          <Button size="small" onClick={btnClkRef.current.bind(null, "close")}>
            取消
          </Button>
        </Flex>
      </div>
    </div>
  )
})

export default AddShield
