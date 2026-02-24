/*
 * @Author: chenmeifeng
 * @Date: 2024-12-27 16:25:18
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-02 11:22:04
 * @Description:
 */
import "./rate.less"
import { Progress } from "antd"

export default function CpctRate(props) {
  const { name, value } = props
  return (
    <div className="cpct-rate">
      <span className="cpct-rate-name">{name}</span>
      <div className="cpct-rate-progress">
        <Progress
          steps={10}
          percent={value}
          strokeColor="rgba(0, 255, 234, 1)"
          trailColor="rgba(0, 255, 234, .4)"
          size={[6, 24]}
        />
      </div>
    </div>
  )
}
