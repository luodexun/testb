/*
 * @Author: xiongman
 * @Date: 2023-11-13 15:36:14
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-02-14 15:59:24
 * @Description:
 */
import "./index.less"

import { parseNum } from "@utils/util-funs.tsx"
import { Table } from "antd"
import { Reference } from "rc-table"
import { Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"

import { ICustomTabProps, ICustomTabRef } from "@/components/custom-table/interfaces"

function calcScrollHeight(tableRef: Reference, setScrollY: Dispatch<SetStateAction<string | undefined>>) {
  if (!tableRef?.nativeElement) return
  const tableDom = tableRef.nativeElement
  window.setTimeout(() => {
    const headerDom = tableDom.querySelector(".ant-table-header")
    const headHeight = headerDom?.clientHeight ?? 0
    const pageDom = tableDom.querySelector(".ant-pagination")
    const pageHeight = pageDom?.clientHeight ?? 0
    const pageMarginTop = pageHeight ? parseNum(Number.parseFloat(getComputedStyle(pageDom)?.marginTop)) : 0
    const wHeight = tableDom.parentElement.clientHeight
    const height = wHeight - headHeight - pageHeight - pageMarginTop - 8
    setScrollY(`${height}px`)
  }, 800)
}

const CustomTable = forwardRef<ICustomTabRef, ICustomTabProps>((props, ref) => {
  const { limitHeight, initHeight, scroll, ...tbProps } = props

  const [scrollY, setScrollY] = useState<string | undefined>()
  const tableRef = useRef<Reference>()

  // 向外暴露的接口
  useImperativeHandle(ref, () => ({
    tableWrap: tableRef.current.nativeElement,
  }))

  useEffect(() => {
    if (!limitHeight || !tableRef.current) return
    calcScrollHeight(tableRef.current!, setScrollY)
  }, [limitHeight, props.columns, props.dataSource])
  useEffect(() => {
    // 解决页面方法缩小table scroll高度不改变问题
    window.addEventListener("resize", () => {
      calcScrollHeight(tableRef.current!, setScrollY)
    })
    return () => {
      window.removeEventListener("resize", () => {
        calcScrollHeight(tableRef.current!, setScrollY)
      })
    }
  }, [])
  const scrollData = useMemo(() => {
    if (scrollY) return { ...(scroll || {}), y: scrollY }
    return scroll
  }, [scroll, scrollY])

  return (
    <div className="l-full custom-table-wrap">
      <Table ref={tableRef} scroll={scrollData} bordered {...tbProps} className="custom-table" />
    </div>
  )
})

export default CustomTable
