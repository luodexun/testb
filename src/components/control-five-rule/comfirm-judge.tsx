/*
 * @Author: chenmeifeng
 * @Date: 2024-08-19 14:47:15
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-28 10:40:08
 * @Description:
 */
import { Button, Space } from "antd"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { fiveHeFenValid } from "../device-control/methods"
import CustomModal from "../custom-modal"
import Authentication from "../device-control/authSingle"
import { IFormValidError } from "@/types/i-antd"
import { doBaseServer } from "@/api/serve-funs"
import { getFormData } from "@/utils/file-funs"
import { showMsg, validResErr } from "@/utils/util-funs"
import { sm3 } from "sm-crypto"
export interface IFiveJudgeRefs {}
export interface IFiveJudgeProps {
  buttonClick?: (value: string) => void
  controlParam: {
    controlPointName?: string
    pointName: string
    controlType: any
    stationCode?: string
    deviceCode?: string
  }
}
const ComfirmJudge = forwardRef<IFiveJudgeRefs, IFiveJudgeProps>((props, ref) => {
  const { buttonClick, controlParam } = props
  const modalRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const operateBtn = async (type) => {
    if (type === "ok") {
      const { pointName, controlType, stationCode, deviceCode } = controlParam
      const params = {
        pointName,
        controlType: controlType ? 0 : 1,
        stationCode,
        deviceCode,
      }
      setLoading(true)
      const flag = await fiveHeFenValid(params)
      setLoading(false)
      if (!flag) {
        return buttonClick?.("cancel")
      }
      buttonClick?.("next")
    } else {
      setOpenModal(true)
    }
  }
  const operate = useRef(async () => {
    const verify = modalRef.current?.getChildrenRef()
    const validInfo = await verify?.getData()
    // 表单校验出错的返回值中有 errorFields 字段信息，无错时值是表单数据对象
    if (validInfo.errorFields) return
    const params = getFormData({ name: validInfo?.name, pwd: sm3(validInfo?.pwd), service: "control" })
    const res = await doBaseServer("singlePasswordSafeLogin", params)
    if (validResErr(res)) return showMsg("校验失败")
    buttonClick?.("next")
  })
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))
  return (
    <div className="dv-ctrl-box">
      <p>是否进行五防校验</p>
      <Space size={"large"}>
        <Button disabled={loading} loading={loading} size={"large"} onClick={() => operateBtn("ok")}>
          {loading ? "正在校验" : "是"}
        </Button>
        <Button size={"large"} onClick={() => operateBtn("cancel")}>
          否
        </Button>
      </Space>
      <CustomModal
        ref={modalRef}
        width="30%"
        title="设备控制"
        destroyOnClose
        open={openModal}
        onOk={operate.current}
        onCancel={() => setOpenModal(false)}
        Component={Authentication}
        componentProps={{ loading, data: controlParam }}
      />
    </div>
  )
})
export default ComfirmJudge
