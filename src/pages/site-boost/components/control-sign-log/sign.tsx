/*
 * @Author: chenmeifeng
 * @Date: 2024-12-05 17:03:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-08-07 15:28:57
 * @Description:
 */
import "./sign.less"
import { Button, Space } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst, ISearchFormProps } from "@/components/custom-form/types"
import { SIGN_FORM } from "./configs"
import { onChgSignForm, signsDevice } from "./methods"
import { AtomConfigMap } from "@/store/atom-config"
import { useAtomValue } from "jotai"
import { IDeviceSignal } from "@/types/i-config"
import { StorageUserInfo } from "@/configs/storage-cfg"
import { ILoginInfo } from "@/types/i-auth"
import { getStorage } from "@/utils/util-funs"

export interface IPerateRef {}
export interface IOperateProps {
  stationId: number
  lineCode?: number
  buttonClick?: (type: "ok" | "close", data?: any) => void
  selectRowInfo?: any
}

const AddModal = forwardRef<IPerateRef, IOperateProps>((props, ref) => {
  const { stationId, lineCode, buttonClick, selectRowInfo } = props
  const formRef = useRef<IFormInst | null>(null)
  //组件数据集合
  const [formList, setFormItemConfig] = useState({})
  const currentId = useRef<number>()
  const { deviceSignal } = useAtomValue(AtomConfigMap).list
  const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)

  const syzzzSignal = useMemo(() => {
    if (!deviceSignal) return []
    const signs = deviceSignal?.filter((i: any) => i.signState.startsWith("4"))
    const res = signs?.map((i: any) => {
      return {
        label: i.signDesc,
        value: i.signState,
      }
    })
    return res
  }, [deviceSignal])

  useEffect(() => {
    const formIns = formRef.current?.getInst()
    formIns.setFieldValue("stationId", stationId)
    setTimeout(() => {
      formIns.setFieldValue("lineCodeList", lineCode ? [lineCode] : [])
    }, 800)
  }, [lineCode, stationId])
  const allAsyncPromise = async () => {}

  const onFinish = async (formValue) => {
    const { stationId, lineCodeList, signState, remark } = formValue
    const time = new Date().getTime()
    const deviceId = formRef.current?.getInst()?.getFieldValue("deviceId")
    const params = {
      stationId,
      lineCodeList,
      signState: signState?.value,
      signDesc: signState?.label,
      remark,
      createBy: userInfoLocal?.loginName,
      createTime: time,
      deviceId,
    }
    const res = await signsDevice(params)
    if (!res) return
    buttonClick?.("ok", params)
  }
  const btnClkRef = useRef((type: "ok" | "close") => {
    if (type === "ok") {
      formRef.current?.submit?.()
      return
    }
    buttonClick?.("close")
  })
  const onSchValueChgRef = async (changedValue) => {
    const chgOptions = await onChgSignForm(changedValue, formRef.current)
    setFormItemConfig((prevState) => ({ ...prevState, ...chgOptions }))
  }
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    getInst: () => formRef.current?.getInst?.(),
    getFormValues: () => formRef.current?.getFieldsValue?.(),
  }))
  return (
    <div className="boost-sign-model">
      <span>挂牌</span>
      <CustomForm
        ref={formRef}
        formOptions={{ layout: "horizontal", onValuesChange: onSchValueChgRef }}
        itemOptionConfig={formList}
        itemOptions={SIGN_FORM(syzzzSignal)}
        onSearch={onFinish}
      />
      <div className="confirm-btn">
        <Space size="small" style={{ width: "100%", justifyContent: "end" }}>
          <Button size="small" onClick={btnClkRef.current.bind(null, "ok")}>
            保存
          </Button>
          <Button size="small" onClick={btnClkRef.current.bind(null, "close")}>
            取消
          </Button>
        </Space>
      </div>
    </div>
  )
})

export default AddModal
