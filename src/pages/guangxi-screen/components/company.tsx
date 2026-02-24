/*
 * @Author: chenmeifeng
 * @Date: 2024-03-18 15:37:34
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-03-25 11:06:47
 * @Description: 公司简介
 */
import "./company.less"
export default function CompanyDetail(props) {
  const { companyInfo } = props
  return (
    <div className="screen-company">
      <span className="company-title">{companyInfo?.title}</span>
      <span className="company-content">{companyInfo?.content}</span>
    </div>
  )
}
