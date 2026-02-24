/*
 * @Author: chenmeifeng
 * @Date: 2024-12-27 17:30:19
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-12-31 10:09:25
 * @Description:
 */
import { mainComAtom } from "@/store/atom-screen-data"
import "./index.less"
import { useAtomValue } from "jotai"
import { QUOTA_LIST_ONE } from "../../configs"
import { judgeNull } from "@/utils/util-funs"
import NXCommonQuotaBox from "../common-quota"
import CpctRight from "./right"
export default function CapacityBox() {
  const quotaInfo = useAtomValue(mainComAtom)
  return (
    <div className="capacity-box">
      <i className="capacity-box-icon"></i>
      <div className="capacity-box-ct">
        {QUOTA_LIST_ONE?.map((i) => {
          return (
            <NXCommonQuotaBox
              key={i.key}
              horizontal={false}
              name={i.name}
              unit={i.unit}
              value={judgeNull(quotaInfo?.[i.key], 1, 2, "-")}
            />
          )
        })}
      </div>
      <div className="capacity-box-right">
        <CpctRight quotaInfo={quotaInfo} />
      </div>
    </div>
  )
}
