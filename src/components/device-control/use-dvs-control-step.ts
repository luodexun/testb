/*
 * @Author: xiongman
 * @Date: 2023-11-21 10:16:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-24 15:38:27
 * @Description:
 */

import { validControlOperateAuth, validSingellControlOperateAuth } from "@utils/control-funs.ts"
import { showMsg, validOperate } from "@utils/util-funs.tsx"
import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react"

import { ICustomModalRef } from "@/components/custom-modal"
import { STEP_KEY } from "@/components/device-control/configs.ts"
import { IOperateStepRef } from "@/components/device-control/operate-step.tsx"
import { IControlParamMap, IDualPsdSafeLoginForm } from "@/components/device-control/types.ts"
import { TDeviceType } from "@/types/i-config"

const { AUTH_VERIFY } = STEP_KEY

interface IParams {
  deviceType?: TDeviceType
  controlParamMapRef: MutableRefObject<IControlParamMap>
  modalRef: MutableRefObject<ICustomModalRef<IOperateStepRef>> | MutableRefObject<IOperateStepRef>
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setLoading: Dispatch<SetStateAction<boolean>>
}
export default function useDvsControlStep(params: IParams) {
  const { deviceType, controlParamMapRef, modalRef, setLoading, setOpenModal } = params

  const operateStepBtnClkRef = useRef(async (type: "ok" | "close", cStep: number, data: IDualPsdSafeLoginForm) => {
    if (type === "close") return setOpenModal(false)
    if (cStep === AUTH_VERIFY && !data) {
      return showMsg("未通过验证，不能执行操作！")
    }
    if (cStep === AUTH_VERIFY && data) {
      // 操作验证
      controlParamMapRef.current.authVerify = data
      setLoading(true)
      let exeResult
      if (deviceType === "AGVC" || deviceType === "SYZZZ") {
        exeResult = await validControlOperateAuth(controlParamMapRef.current)
      } else {
        exeResult = await validSingellControlOperateAuth(controlParamMapRef.current)
      }

      setLoading(false)
      const valid = await validOperate(exeResult)
      // if (!valid) showMsg("操作未执行成功", "warning")
      return valid
    }
    // 向下一步
    if ("getChildrenRef" in modalRef.current) {
      return modalRef.current?.getChildrenRef()?.setStep(cStep + 1)
    } else {
      modalRef.current?.setStep(cStep + 1)
    }
  })

  return { stepBtnClkRef: operateStepBtnClkRef }
}
