/*
 * @Author: xiongman
 * @Date: 2023-10-17 10:35:37
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-11-13 10:04:53
 * @Description:
 */

import "./confirm-info.less"

import { forwardRef, useImperativeHandle } from "react"

import { CONFIRM_INFO_LIST } from "@/components/device-control/configs.ts"
import { IOperateInfo, IStepContentInst } from "@/components/device-control/types.ts"
import MetricTag from "@/components/metric-tag"

interface IProps {
  data?: IOperateInfo
}
const ConfirmInfo = forwardRef<IStepContentInst, IProps>((props, ref) => {
  const { data } = props
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({}))

  return (
    <div className="l-full confirm-info-wrap">
      {/* {CONFIRM_INFO_LIST.map(({ title, field, color }) => {
        return data?.[field] ? (
          <MetricTag
            key={field}
            title={`${title}：`}
            value={`${data?.[field]}` ?? "-"}
            notEvo={true}
            valueStyle={{ color }}
          />
        ) : null
      })} */}
      {CONFIRM_INFO_LIST.map(({ title, field, color }) => {
        return data?.[field] ? (
          <div className="ciw-item" key={field}>
            <span className="ciw-item-name">{`${title}：`}</span>
            <span className="ciw-item-value" style={{ color: color }}>
              {`${data?.[field]}` ?? "-"}
            </span>
          </div>
        ) : null
      })}
    </div>
  )
})
ConfirmInfo.displayName = "信息确认"
export default ConfirmInfo
