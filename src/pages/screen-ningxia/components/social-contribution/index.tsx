/*
 * @Author: chenmeifeng
 * @Date: 2024-07-23 10:34:07
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-09-02 17:16:15
 * @Description: 社会贡献
 */
import "./index.less"
import NXCommonBox from "../common-box"
import { SOCIAL_CONTRIBUTION } from "../../configs"
import NXCommonQuotaBox from "../common-quota"
import { parseNum } from "@/utils/util-funs"
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
      prev.reduce = (prev.CO2 / 365) * 15 //根据二氧化碳减排量乘以系数计算（1公顷森林一年可以吸收约365吨二氧化碳，1公顷=15亩)
      return { ...prev }
    })
  }, [mainCpnInfo])
  return (
    <NXCommonBox title="社会贡献">
      <div className="nx-sc-ctbtn">
        {SOCIAL_CONTRIBUTION?.map((i) => {
          return (
            <div key={i.key} className="ctbtn-item">
              <i className={`i-${i.icon}`}></i>
              <NXCommonQuotaBox name={i.name} unit={i.unit} value={`${parseNum(quotaInfo?.[i.key], 3)}` || "-"} />
            </div>
          )
        })}
      </div>
    </NXCommonBox>
  )
}
