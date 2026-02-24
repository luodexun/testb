/*
 * @Author: xiongman
 * @Date: 2023-09-06 15:14:50
 * @LastEditors: xiongman
 * @LastEditTime: 2023-09-06 15:14:50
 * @Description:
 */

import "./breaker-group.less"

import { IBreakerItem } from "@pages/area-elec/types"
import classnames from "classnames"

interface IProps {
  breakerList?: IBreakerItem[]
}
export default function BreakerGroup(props: IProps) {
  const { breakerList } = props
  if (!breakerList?.length) return null
  return (
    <div className="breaker-group-wrap">
      {breakerList.map(({ systemId, systemName, list }) => {
        return (
          <div key={systemId} className="system-wrap">
            <div className="system-name">{systemName}</div>
            <div className="breaker-list-box">
              {list.map(({ stationCode, pointName, pointDesc, value }) => {
                return (
                  <span key={`${stationCode}_${pointName}`} className="item">
                    <span className={classnames("icon", { offline: value === "true" })} />
                    <span className="value">{pointDesc}</span>
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
