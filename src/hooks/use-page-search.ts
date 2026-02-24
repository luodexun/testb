/*
 * @Author: xiongman
 * @Date: 2023-03-30 15:20:35
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-03-10 16:25:22
 * @Description: 页面查询的钩子方法
 */

import usePagination, { IPageInfoInit } from "@hooks/use-pagination"
import { commonSearch, TSearchFuns } from "@utils/table-funs"
import { MutableRefObject, useEffect, useRef, useState } from "react"

import { IFormInst } from "@/components/custom-form/types.ts"

interface ISearchCfg<TForm = any, TData = any> {
  formRef?: MutableRefObject<IFormInst<TForm> | null>
  needSchParams?: boolean
  needFirstSch?: boolean
  otherParams?: any
  formParamFun?: (formData: TForm) => TForm
  paginationProps?: IPageInfoInit
  beforeSch?: () => void
  dealRecords?: (records: TData[]) => TData[]
}
export default function usePageSearch<TForm = any, TData = any>(
  funs: TSearchFuns<TForm, TData>,
  config?: ISearchCfg<TForm, TData>,
) {
  const {
    formRef,
    otherParams,
    needSchParams = true,
    needFirstSch = true,
    formParamFun,
    paginationProps,
    beforeSch,
    dealRecords,
  } = config || {}

  const [dataSource, setDataSource] = useState<TData[]>([])
  const [loading, setLoading] = useState(false)
  const [pageInfo, setTotal, pagination, setPageInfo] = usePagination(paginationProps)
  const needFirstSchRef = useRef(needFirstSch)
  const throlFlag = useRef(false)
  const timeoutRef = useRef(null)
  const onSearchRef = useRef(() => {
    if (throlFlag.current) return
    throlFlag.current = true
    const timeout = needFirstSchRef.current ? 0 : 110
    timeoutRef.current = window.setTimeout(() => {
      // 表单提交查询，查询时分页信息重置到第一页，防止页码与总页树不匹配造成查不出数据
      setPageInfo((prevState) => ({ ...prevState, current: 1 }))
      window.setTimeout(() => (throlFlag.current = false), 100)
    }, timeout)
  })

  const searchFunsRef = useRef<TSearchFuns<TForm, TData>>({
    setLoading,
    setDataSource,
    setTotal,
    ...funs,
  })

  if (dealRecords) searchFunsRef.current.dealRecords = dealRecords

  useEffect(() => {
    // 不需要首次查询
    if (!needFirstSchRef.current) {
      window.setTimeout(() => (needFirstSchRef.current = true), 80)
      return
    }
    // 没有获取到查询表单实例
    if (needSchParams && !formRef?.current && !otherParams) return
    let formData: TForm
    // 获取查询表单值
    if (needSchParams) {
      formData = formRef?.current!.getFormValues() || ({} as TForm)
    }
    if (formParamFun) {
      formData = formParamFun(formData || ({} as TForm)) as TForm
    }
    if (beforeSch) beforeSch()
    if (otherParams) formData = { ...formData, ...otherParams }
    // 初始查询，当分页信息变更时执行查询
    commonSearch<TForm, TData>(pageInfo, formData, searchFunsRef.current).then((r) => r)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef, pageInfo, searchFunsRef])
  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    onSearch: onSearchRef.current,
    dataSource,
    setDataSource,
    loading,
    setLoading,
    pageInfo,
    pagination,
    setPageInfo,
    setTotal,
  }
}
