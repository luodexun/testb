import HbScreenContext from "@/contexts/hubei-screen-context"
import { useContext } from "react"
import { mapRightQuota } from "../../configs"
import CommonQuotaBox from "../common-quota-box"
import { parseNum } from "@/utils/util-funs"
import "./right.less"
export default function JsCenterRight() {
  const { quotaInfo } = useContext(HbScreenContext)
  return (
    <div className="js-cright">
      {mapRightQuota?.map((i) => {
        return (
          <div key={i.key} className="js-cright-item">
            <CommonQuotaBox {...i} value={parseNum(quotaInfo?.[i.key]) || "-"} />
            <i className={`i-${i.icon}`}></i>
          </div>
        )
      })}
    </div>
  )
}
