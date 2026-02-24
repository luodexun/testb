/*
 * @Author: chenmeifeng
 * @Date: 2024-07-16 16:45:13
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-07-17 17:29:06
 * @Description:
 */
import "./index.less"
import SXBoxHeader from "../box-header"
import SXElecTop from "./top"
import SXElecBottom from "./bottom"
import CommonCtBox from "../common-box"

export default function SXElec(props) {
  return (
    <CommonCtBox title="发电量">
      <div className="sx-elec">
        <div className="sx-elec-top">
          <SXElecTop />
        </div>
        <div className="sx-elec-bottom">
          <SXElecBottom />
        </div>
      </div>
    </CommonCtBox>
  )
}
