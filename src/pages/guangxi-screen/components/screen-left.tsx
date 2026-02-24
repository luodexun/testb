/*
 * @Author: chenmeifeng
 * @Date: 2024-03-25 09:37:59
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-25 14:09:38
 * @Description: 左侧内容
 */

import CompanyDetail from "./company"
import CompanyQuota from "./company-quota"
export default function SrceenLeft(props) {
  const { info } = props

  return (
    <div className="screen-left">
      <CompanyDetail companyInfo={info?.companyInfo} />
      <CompanyQuota list={info?.companyQuota} />
    </div>
  )
}
