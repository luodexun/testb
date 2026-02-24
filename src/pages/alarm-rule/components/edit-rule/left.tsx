/*
 * @Author: chenmeifeng
 * @Date: 2024-08-28 16:38:00
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-10-23 14:26:53
 * @Description: 告警规则-测点选择
 */
import usePageSearch from "@/hooks/use-page-search"
import { IDvsMeasurePointData } from "@/types/i-device"
import { getDvsMeasurePointsData } from "@/utils/device-funs"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { initPiontLs } from "../../methods/table"
import { IPointSch } from "../../types/table"
import { Checkbox, Pagination } from "antd"
import PiontContext from "../../configs/use-point-check"

const CheckboxGroup = Checkbox.Group
interface IProps {
  deviceId: number
}
const test = [
  {
    id: 59198,
    modelId: 6,
    pointName: "Turstatus",
    pointDesc: "风机状态",
    pointType: "2",
    systemId: 101,
    coefficient: 1,
    unit: "",
    maximum: 100000,
    minimum: -100000,
    tags: {},
  },
]
const pageProps = {
  pageSize: 28,
  showTotal: true,
  showSizeChanger: false,
  showQuickJumper: false,
}
export default function EditRulePoint(props: IProps) {
  const { deviceId } = props
  const [currentCheck, setCurrentCheck] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [total, setTotal] = useState(0)

  const { serCurCheckPoint, cursorInfo, exitPointList } = useContext(PiontContext)
  // 执行查询的钩子
  // const { dataSource, loading, pagination, onSearch } = usePageSearch<IPointSch, IDvsMeasurePointData>(
  //   { serveFun: initPiontLs },
  //   {
  //     formRef: null,
  //     needFirstSch: true,
  //     otherParams: { deviceId, pointDesc: "", exitPointList },
  //     paginationProps: pageProps,
  //   },
  // )

  const changed = (e) => {
    console.log(e, "sfsdf")
    // 光标没有在规则输入框时，选择无效
    if (!cursorInfo) return
    setCurrentCheck((prev) => {
      let res = []
      // 不支持反选
      if (prev?.length && prev.includes(e?.target.value)) {
        res = prev
      } else if (!prev.includes(e?.target.value)) {
        res = prev.concat([e.target?.value])
      }
      const pointDetail = dataSource?.find((i) => i.pointName === e.target?.value)
      serCurCheckPoint({ ...pointDetail })
      return [...res]
    })
  }
  const changeNum = (page, pageSize) => {
    const actualShowPt = exitPointList?.slice((page - 1) * pageSize, page * pageSize)
    setDataSource(actualShowPt)
  }

  useEffect(() => {
    if (!exitPointList?.length) return
    setTotal(exitPointList.length)
    setDataSource(exitPointList.slice(0, 28))
  }, [exitPointList])
  return (
    <div className="rule-point">
      <div className="rule-point-top">
        <CheckboxGroup value={currentCheck}>
          <div className="rule-point-ls">
            {dataSource?.map((i) => {
              return (
                <Checkbox key={i.pointName} value={i.pointName} onChange={changed}>
                  <span className="rule-point-val">{i.pointName}</span>
                  <span className="rule-point-name">{i.pointDesc}</span>
                </Checkbox>
              )
            })}
          </div>
        </CheckboxGroup>
      </div>
      {/* <Pagination {...pagination} /> */}
      <Pagination size="small" total={total} pageSize={28} showSizeChanger={false} onChange={changeNum} />
    </div>
  )
}
