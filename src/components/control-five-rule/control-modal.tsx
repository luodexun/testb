/*
 * @Author: chenmeifeng
 * @Date: 2024-08-19 14:37:42
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-05 15:40:08
 * @Description:
 */
import { useRef } from "react"
import CustomModal from "../custom-modal"
import ComfirmJudge, { IFiveJudgeProps, IFiveJudgeRefs } from "./comfirm-judge"
interface IProps {
  open: boolean
  controlParam: {
    pointName: string
    controlType: any
    stationCode?: string
    deviceCode?: string
  }
  setOpen: (value: string) => void
}
export default function JudgeFive(props: IProps) {
  const { open, controlParam, setOpen } = props
  const cfmModeRef = useRef(null)
  return (
    <CustomModal<IFiveJudgeProps, IFiveJudgeRefs>
      ref={cfmModeRef}
      width="30%"
      title="提示"
      destroyOnClose
      open={open}
      footer={null}
      onCancel={() => setOpen("cancel")}
      Component={ComfirmJudge}
      componentProps={{ controlParam: controlParam, buttonClick: setOpen }}
    />
  )
}
