/*
 *@Author: chenmeifeng
 *@Date: 2023-10-23 15:36:32
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-10 17:24:15
 *@Description: 模块描述
 */

import "./addPlan.less"

import { numberVal, onTransDataPaste, parseNum, uDate, vDate } from "@utils/util-funs.tsx"
import { Button, InputNumber } from "antd"
import { forwardRef, useEffect, useRef, useState } from "react"

import CustomForm from "@/components/custom-form"
import { IFormInst } from "@/components/custom-form/types.ts"
import { day4Y } from "@/configs/time-constant"
import { DEFAULT_HEADERS, EDIT_ITEMS, MONTHMAP, QUANTITY_ADD, stationList } from "@/pages/plan-quantity/configs"

import { getReportPowerSchDataDetail, sortByKey } from "../methods"
import { IDataProps, IRpPowerData, IRpPowerSchForm } from "../types"

const OperateStep = forwardRef<undefined, IDataProps>((props) => {
  const { type, buttonClick, data } = props

  //表格数据
  const [tableData, setData] = useState([])
  // 总计
  const [total, setTotal] = useState<number>(0)

  const [activeTotal, setactiveTotal] = useState<number>(0)

  const [completeTotal, setCompleteTotal] = useState<number>(0)
  const formRef = useRef<IFormInst | null>(null)

  const [schData, setSchData] = useState({ stationId: null, year: null })

  const [btnClick, setBtn] = useState<boolean>(false)
  const timeoutRef = useRef(null)
  //输入框改变事件
  function onChange(value, i) {
    const newValue = value ? value : 0
    setData((prevData) => {
      prevData[i].productionPlan = newValue
      return [...prevData]
    })
  }

  const btnClkRef = useRef((type: "ok" | "close") => {
    if (type === "ok") {
      setBtn(true)
      return
    }
    buttonClick?.("close")
  })

  const getInitQuantityData = async (info) => {
    const newData = await getReportPowerSchDataDetail(info)
    const sortData = sortByKey(info?.child, "month")
    const allData = sortData?.map((e) => {
      const oneInfo = (newData || []).find((a) => e.month === a.month)
      const dailyProduction = Number(numberVal(oneInfo?.dailyProduction || 0))
      const productionPlan = Number(numberVal(oneInfo?.productionPlan || 0))

      const planCompletion =
        dailyProduction && productionPlan ? parseNum((dailyProduction * 100) / productionPlan) || 0 : 0

      return {
        ...e,
        dailyProduction: dailyProduction,
        productionPlan,
        planCompletion,
      }
    })
    setData(allData)
  }

  useEffect(() => {
    const data = []
    if (schData.stationId && type === "新增") {
      // 新增也要调接口显示相应数据
      for (let i = 0; i < 12; i++) {
        data.push({
          month: i + 1,
          actualPower: 0,
          productionPlan: 0,
          planCompletion: 0,
        })
      }
      const date = new Date()
      setData(data)
      const params = {
        stationId: schData.stationId,
        year: schData.year ? uDate(schData.year, day4Y) : date.getFullYear(),
        child: data,
      }
      getInitQuantityData(params)
    }
  }, [schData, type])

  useEffect(() => {
    const total = tableData.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.productionPlan
    }, 0)
    const activeTotal = tableData.reduce((accumulator, currentValue) => {
      return accumulator + currentValue?.dailyProduction || 0
    }, 0)

    const completion = parseNum((activeTotal * 100) / total) || 0
    setTotal(total)
    setactiveTotal(activeTotal)
    setCompleteTotal(completion)
  }, [tableData])

  useEffect(() => {
    if (btnClick) {
      const formData = formRef.current?.getFormValues()
      buttonClick?.("ok", formData as IRpPowerSchForm, tableData as IRpPowerData[])
      setBtn(false)
    }
  }, [btnClick, tableData, buttonClick])

  useEffect(() => {
    const getData = async () => {
      const formInst = formRef.current?.getInst()
      if (type === "编辑") {
        const item = stationList?.find((e) => e.id === (data as any).stationId)
        formInst?.setFieldsValue({
          stationId: item?.shortName || "",
          year: (data as any).year,
          id: (data as any).stationId,
        })
        getInitQuantityData(data)
      } else {
        formInst?.setFieldsValue({
          year: vDate("", day4Y),
        })
      }
    }
    getData()
  }, [type, data])
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  const onSchValueChgRef = async () => {
    const params = formRef.current?.getFormValues()
    if (params.stationId) {
      setSchData(params)
    }
  }

  const handlePaste = async (event, idx) => {
    // 处理粘贴事件的逻辑
    const transData = onTransDataPaste(event)
    timeoutRef.current = setTimeout(async () => {
      handleSaveAllRow(idx, transData)
    }, 0)
  }
  const handleSaveAllRow = (curIdx, pastedData) => {
    const data = [...tableData]
    let cur = curIdx
    pastedData.forEach((item) => {
      if (cur > data.length - 1) return
      data[cur]["productionPlan"] = parseInt(item) || item
      cur++
    })
    setData(data)
  }
  return (
    <div className="add-plan-wrap">
      <CustomForm
        ref={formRef}
        itemOptions={type === "编辑" ? EDIT_ITEMS : QUANTITY_ADD}
        formOptions={{
          onValuesChange: onSchValueChgRef,
        }}
      />
      <div className="table-warp">
        <div className="table-header">
          {DEFAULT_HEADERS.map((e) => (
            <span className="item" key={e} children={e} />
          ))}
        </div>
        <div className="table-box">
          {tableData?.map((e, i) => {
            return (
              <div className="row-warp" key={e.month}>
                <span className="item">{MONTHMAP[e.month - 1]}</span>
                <span className="item">{e.dailyProduction || 0}</span>
                <span className="item">
                  <InputNumber
                    min={0}
                    value={e.productionPlan}
                    onPaste={(e) => handlePaste(e, i)}
                    onChange={(value) => onChange(value, i)}
                  />
                </span>
                <span className="item">{e.planCompletion || 0}%</span>
              </div>
            )
          })}
          <div className="row-warp">
            <span className="item">总计</span>
            <span className="item">{activeTotal}</span>
            <span className="item">{total}</span>
            <span className="item">{completeTotal}%</span>
          </div>
        </div>
      </div>
      <div className="confirm-bottom">
        <Button onClick={btnClkRef.current.bind(null, "ok")}>保存</Button>
        <Button onClick={btnClkRef.current.bind(null, "close")}>取消</Button>
      </div>
    </div>
  )
})

export default OperateStep
