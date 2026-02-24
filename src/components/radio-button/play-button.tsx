/*
 * @Author: xiongman
 * @Date: 2023-11-10 18:23:04
 * @LastEditors: xiongman
 * @LastEditTime: 2023-11-10 18:23:04
 * @Description: 播放组件
 */

import "./play-button.less"

import { PauseCircleOutlined, PlayCircleOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons"
import { Button, ButtonProps } from "antd"

interface IProps extends Omit<ButtonProps, "type" | "shap" | "icon" | "onClick"> {
  status?: boolean
  onClick?: (type: "prev" | "play" | "next") => void
}

export default function PlayButton(props: IProps) {
  const { status, onClick, ...btnProps } = props
  return (
    <div className="play-btn-wrap">
      <Button
        {...btnProps}
        type="text"
        shape="circle"
        icon={<StepBackwardOutlined title="上一步" />}
        onClick={() => onClick("prev")}
      />
      <Button
        {...btnProps}
        type="text"
        shape="circle"
        icon={status ? <PauseCircleOutlined title="暂停" /> : <PlayCircleOutlined title="播放" />}
        onClick={() => onClick("play")}
      />
      <Button
        {...btnProps}
        type="text"
        shape="circle"
        icon={<StepForwardOutlined title="下一步" />}
        onClick={() => onClick("next")}
      />
    </div>
  )
}
