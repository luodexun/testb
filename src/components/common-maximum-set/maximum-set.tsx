import "./index.less"

import { Button, Select } from "antd"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import Draggable from "react-draggable"

import MinMaxInput from "@/components/min-max-input"
import { IDvsMeasurePointTreeData } from "@/types/i-device"
const options = [
  { label: "左边", value: "left" },
  { label: "右边", value: "right" },
]
interface IMaximum {
  [key: string]: {
    min: number
    max: number
    position?: "left" | "right"
  }
}
interface IProps {
  allChoosePoint: string[]
  allDataPiontData: IDvsMeasurePointTreeData[]
  series: any[]
  showBox: boolean
  onChange: (e: any) => void
}
interface IPerateRef {}
const MaximumSet = forwardRef<IPerateRef, IProps>((props: IProps, ref) => {
  const { allChoosePoint, allDataPiontData, series, showBox, onChange } = props
  const [ymaximumVal, setYmaximumVal] = useState<IMaximum>()
  const nodeRef = useRef(null)
  const changePosition = useRef((e, key) => {
    setYmaximumVal((prev) => {
      prev[key] = { ...prev?.[key], position: e }
      return { ...prev }
    })
  })
  const changeMaximum = useRef((key, e) => {
    setYmaximumVal((prev) => {
      prev[key] = { ...e, position: prev?.[key]?.position }
      return { ...prev }
    })
  })
  const getPointDesc = useCallback(
    (key) => {
      const title = allDataPiontData?.find((i) => i.value === key)?.title
      return title
    },
    [allDataPiontData],
  )
  // 设置坐标轴偏移量
  const getOffset = useRef((options = [], key) => {
    const idx = options?.findIndex((i) => i === key)
    const offset = 80
    return idx ? -(offset * idx) : 0
  })
  // 生成Y轴配置
  const generateYAxes = (data) => {
    // 左坐标轴数组
    const getPositionLeft = ymaximumVal
      ? Object.keys(ymaximumVal)?.filter((i) => ymaximumVal[i].position === "left")
      : []
    // 右坐标轴数组
    const getPositionRight = ymaximumVal
      ? Object.keys(ymaximumVal)?.filter((i) => ymaximumVal[i].position === "right")
      : []

    const yData =
      data?.map((y, index) => ({
        type: "value",
        name: y.name,
        key: y.key,
        min: ymaximumVal?.[y.key]?.min,
        max: ymaximumVal?.[y.key]?.max,
        position:
          index % 2 === 0 ? ymaximumVal?.[y.key]?.position || "left" : ymaximumVal?.[y.key]?.position || "right",
        alignTicks: true,
        offset:
          ymaximumVal?.[y.key]?.position === "left"
            ? getOffset.current(getPositionLeft, y.key)
            : getOffset.current(getPositionRight, y.key),
        // offset: index > 0 ? -(index % 2 === 0 ? (index / 2) * 40 : (Math.ceil(index / 2) - 1) * 40) : 0,
        axisLine: { show: true },
        splitLine: {
          show: false,
        },
        // nameRotate: 30,
        nameTextStyle: {
          align: ymaximumVal?.[y.key]?.position === "left" ? "left" : "right",
        },
        axisLabel: {
          margin: index % 2 === 0 ? 8 : 7,
          verticalAlign: "bottom",
          formatter: function (value) {
            return Math.round(value) // 或 parseInt(value)
          },
        },
      })) || []
    return yData
  }
  const setMaxmin = () => {
    const yAxis = generateYAxes(series)
    onChange?.(yAxis)
  }
  useEffect(() => {
    if (allChoosePoint?.length) {
      const keys = ymaximumVal ? Object.keys(ymaximumVal) : []
      const firstKey = allChoosePoint[0]
      if (!keys?.length) {
        const obj = {}
        allChoosePoint.forEach((i) => {
          obj[i] = { max: null, min: null, position: "left" }
        })
        setYmaximumVal(obj)
      } else {
        const obj = {}
        allChoosePoint.forEach((i) => {
          const exitKey = ymaximumVal?.[i]
          obj[i] = exitKey || { max: null, min: null, position: "left" }
        })
        setYmaximumVal(obj)
      }
    } else {
      setYmaximumVal(null)
    }
  }, [allChoosePoint])
  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    getYAxis: (data) => generateYAxes(data),
  }))
  return (
    <div>
      {showBox ? (
        <Draggable nodeRef={nodeRef} cancel=".ymx-item">
          <div className="attr-trend-ymx" ref={nodeRef}>
            {allChoosePoint?.map((i) => {
              return (
                <div key={i} className="ymx-item">
                  <span>{getPointDesc(i)}：</span>
                  <Select
                    options={options}
                    value={ymaximumVal?.[i]?.position}
                    onChange={(e) => changePosition.current(e, i)}
                    style={{ width: "5em" }}
                  ></Select>
                  <MinMaxInput value={ymaximumVal?.[i]} onChange={changeMaximum.current.bind(null, i)} />
                </div>
              )
            })}
            <Button type="primary" size="small" onClick={setMaxmin}>
              设置
            </Button>
          </div>
        </Draggable>
      ) : (
        ""
      )}
    </div>
  )
})
export default MaximumSet
