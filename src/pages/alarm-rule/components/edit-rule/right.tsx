/*
 * @Author: chenmeifeng
 * @Date: 2024-08-29 11:16:02
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-07 09:49:21
 * @Description: 告警规则表单编辑
 */
import CustomForm from "@/components/custom-form"
import { IFormInst, TFormItemConfig } from "@/components/custom-form/types"
import { useContext, useEffect, useRef, useState } from "react"
import { TAlarmRuleEditField } from "../../types/form"
import { RULE_EDIT_ITEMS } from "../../configs/form"
import { Button, Space } from "antd"
import { getBelongForType, getStorage } from "@/utils/util-funs"
import { StorageAlarmLevels, StorageUserInfo } from "@/configs/storage-cfg"
import { editAlarmRule } from "../../methods/table"
import { IBatchStn2DvsTreeData } from "../../types"
import { ILoginInfo } from "@/types/i-auth"
import PiontContext from "../../configs/use-point-check"
import { IAlarmRuleLs, TEditType } from "../../types/table"

interface IProps {
  device: IAlarmRuleLs
  buttonClick: (type) => void
  editType: TEditType
}
export default function EditRuleForm(props: IProps) {
  const { buttonClick, device, editType } = props
  const formRef = useRef<IFormInst | null>(null)
  const [loading, setLoading] = useState(false)
  const [formItemConfig, setFormItemConfig] = useState<TFormItemConfig<TAlarmRuleEditField>>({})

  const userInfoLocal = getStorage<ILoginInfo>(StorageUserInfo)
  const { chooseDeviceLs } = useContext(PiontContext)

  const btnClkRef = useRef((type: "ok" | "close" | "reset") => {
    const setForm = formRef.current.getInst()
    if (type === "reset") return setForm.resetFields()
    if (type === "ok") {
      formRef.current?.submit()
      return
    }
    buttonClick?.(type)
  })

  const onFinish = async () => {
    // console.log(formRef.current?.getFormValues())
    const formData = formRef.current?.getFormValues()
    const time = new Date().getTime()
    const params = {
      ...formData,
      id: editType === "edit" ? device.id : null,
      createBy: editType === "add" ? userInfoLocal?.loginName : device.createBy,
      createTime: editType === "add" ? time : device.createTime,
      updateBy: editType === "edit" ? userInfoLocal?.loginName : null,
      updateTime: editType === "edit" ? time : null,
    }
    const res = await editAlarmRule(params, editType === "edit" ? [device] : chooseDeviceLs)
    if (res) buttonClick?.("ok")
  }
  const initData = async () => {
    let getAlarmLevelLs = getStorage(StorageAlarmLevels)
    getAlarmLevelLs = getAlarmLevelLs?.map((i) => {
      return {
        value: i.id,
        label: i.name,
      }
    })
    const dvsType = device?.deviceType || chooseDeviceLs?.[0]?.deviceType
    // debugger
    const getBelongSys = await getBelongForType(dvsType)
    setFormItemConfig((prevState) => ({
      ...prevState,
      alarmLevelId: { options: getAlarmLevelLs || [] },
      systemId: { options: getBelongSys || [] },
    }))
    const setForm = formRef.current.getInst()
    if (!device) {
      setForm.setFieldValue("lifeCycle", 60)
    }
    // 修改状态，回显数据
    if (device) {
      const { systemId, alarmLevelId, alarmDesc, calPeriod, lifeCycle, enableFlag, actionFlag, conditions } = device
      const alarmRule = conditions.map((i, idx) => {
        return {
          ...i,
          id: idx,
        }
      })
      setForm.setFieldsValue({
        alarmRule,
        systemId,
        alarmLevelId,
        alarmDesc,
        calPeriod,
        lifeCycle,
        enableFlag,
        actionFlag,
      })
    }
  }
  useEffect(() => {
    initData()
  }, [chooseDeviceLs, device])
  return (
    <div className="arule-form">
      <CustomForm
        ref={formRef}
        loading={loading}
        // formOptions={{ layout: "horizontal" }}
        itemOptionConfig={formItemConfig}
        itemOptions={RULE_EDIT_ITEMS}
        onSearch={onFinish}
      />
      <div className="confirm-bottom">
        <Space style={{ width: "100%", justifyContent: "end", marginTop: "1em" }}>
          <Button onClick={btnClkRef.current.bind(null, "ok")}>确认</Button>
          <Button onClick={btnClkRef.current.bind(null, "reset")}>重置</Button>
          <Button onClick={btnClkRef.current.bind(null, "close")}>取消</Button>
        </Space>
      </div>
    </div>
  )
}
