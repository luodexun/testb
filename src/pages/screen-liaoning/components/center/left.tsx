import HbScreenContext from "@/contexts/hubei-screen-context"
import { useContext, useRef } from "react"
import { mapLeftQuota } from "../../configs"
import CommonQuotaBox from "../common-quota-box"
import { parseNum } from "@/utils/util-funs"

export default function JsCenterLeft() {
  const provinceName = useRef("江苏区域")

  const { quotaInfo } = useContext(HbScreenContext)

  return (
    <div className="js-cleft">
      <span className="js-cleft-name">{provinceName.current}</span>
      <div className="js-cleft-right">
        {mapLeftQuota?.map((i) => {
          return (
            <div key={i.key} className="center-lquota-item">
              <CommonQuotaBox {...i} value={parseNum(quotaInfo?.[i.key]) || "-"} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
