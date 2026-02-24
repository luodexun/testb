/*
 * @Author: chenmeifeng
 * @Date: 2024-07-23 10:34:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-07-09 09:53:11
 * @Description: 社会贡献
 */
import "./index.less"
import LNCommonBox from "../common-box"
import { SOCIAL_CONTRIBUTION } from "../../configs"
import LNCommonQuotaBox from "../common-quota"
import { judgeNull } from "@/utils/util-funs"
import { useEffect, useState } from "react"
import { mainComAtom } from "@/store/atom-screen-data"
import { useAtomValue } from "jotai"

export default function SocialCtbtn() {
  const [quotaInfo, setQuotaInfo] = useState({
    saveStandar: 0,
    reduce: 0,
    CO2: 0,
  })
  const mainCpnInfo = useAtomValue(mainComAtom)

  useEffect(() => {
    if (!mainCpnInfo) return
    setQuotaInfo((prev) => {
      prev.saveStandar = (mainCpnInfo.yearlyProduction * 10000 * 300.7) / (1000 * 1000) // 吨
      prev.CO2 = (mainCpnInfo.yearlyProduction * 10000 * 824) / (1000 * 1000) // （2022年，全国单位火电发电量二氧化碳排放约824克/千瓦时）
      prev.reduce = (prev.CO2 / 365) * 1000 //根据二氧化碳减排量乘以系数计算（1公顷森林一年可以吸收约365吨二氧化碳，1公顷面积大概可以居住1000颗成年的森林树木,1公顷=15亩)
      return { ...prev }
    })
  }, [mainCpnInfo])
  return (
    <LNCommonBox title="社会贡献">
      <div className="nx-sc-ctbtn">
        {SOCIAL_CONTRIBUTION?.map((i) => {
          return (
            <div key={i.key} className="ctbtn-item">
              <i className={`i-${i.icon}`}></i>
              <LNCommonQuotaBox name={i.name} unit={i.unit} value={judgeNull(quotaInfo?.[i.key], 1, i.decimal, "-")} />
            </div>
          )
        })}
      </div>
    </LNCommonBox>
  )
}
