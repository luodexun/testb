/*
 * @Author: chenmeifeng
 * @Date: 2023-10-16 17:28:38
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2024-05-09 14:01:17
 * @Description:
 */
import "./common-search.less"

import React, { useEffect, useImperativeHandle, useState } from "react"

import { StorageOtherMsg } from "@/configs/storage-cfg"
import { getStorage, removeStorage } from "@/utils/util-funs"

import { ChooseParams } from "../config/types"
interface PropParams {
  options: PropOptionsParams[]
  ref?: any
  onclickItem?: any
  initChoose?: number
}
interface PropOptionsParams {
  title: string
  list: Array<any>
  key: string
}
const CommonCard = React.forwardRef((prop: PropParams, ref) => {
  const { options, onclickItem, initChoose } = prop
  const [activeItem, setActiveItem] = useState([])

  const [actualData, setActualData] = useState<ChooseParams[]>([]) // 获取勾选数据
  const changeChoose = (item, key) => {
    const list = activeItem.filter((i) => i.key === key && i.code === item.code)

    setActiveItem(
      !list.length
        ? [{ ...item, key }, ...activeItem]
        : activeItem.filter((i) => !(i.key === key && i.code == item.code)),
    )
  }

  // const isFirst = useRef(false)
  // useEffect(() => {
  //   if (!isFirst.current) {
  //     const initActiveData = options
  //       .map((i) =>
  //         i.list.map((j) => {
  //           return { ...j, key: i.key }
  //         }),
  //       )
  //       .reduce((prev, cur) => prev.concat(cur), [])
  //     // console.log(initActiveData, "initActiveData")

  //     setActiveItem(initActiveData)
  //   }
  //   isFirst.current = true
  // }, [])
  useEffect(() => {
    const getJumpInfo = getStorage(StorageOtherMsg)
    if (!getJumpInfo?.length) return
    setActiveItem(getJumpInfo)
    return () => {
      setTimeout(() => {
        removeStorage(StorageOtherMsg)
      }, 300)
    }
  }, [])
  useEffect(() => {
    let result = []
    if (activeItem.length) {
      options.forEach((i) => {
        result.push({ key: i.key, choose: activeItem.filter((item) => item.key === i.key) })
      })

      setActualData(result)
    } else {
      result = [
        ...options.map((i) => {
          return {
            key: i.key,
            choose: [],
          }
        }),
      ]
      setActualData(result)
    }
  }, [activeItem, setActiveItem])

  useEffect(() => {
    onclickItem()
  }, [actualData])

  const chooseAll = (info) => {
    const length = info.list.length
    const activeList = activeItem.filter((i) => i.key === info.key) // 当前组选中的集合
    const otherActiveList = activeItem.filter((i) => i.key !== info.key) // 其它组选中的集合
    const activeCode = activeList.map((i) => i.code) // 当前组已选中的code集合
    const unActiveList = info.list
      .filter((i) => !activeCode.includes(i.code))
      .map((i) => {
        return { ...i, key: info.key }
      }) // 当前组未选中的集合
    if (length !== activeList.length || !activeList.length) {
      // 全选
      setActiveItem(unActiveList.concat(activeItem))
    } else {
      // 全不选
      setActiveItem([...otherActiveList])
    }
  }

  useImperativeHandle(ref, () => ({
    actualData, // 实际勾选数组
  }))
  return (
    <div className="common-search">
      {options.map((item) => {
        return (
          <div className="alarm-card" key={item.key}>
            <div className="alarm-card-left" onClick={() => chooseAll(item)}>
              {item.title}
            </div>
            <div className="alarm-card-right">
              {item.list.map((i) => {
                return (
                  <div
                    key={i.code}
                    className={
                      activeItem.filter((j) => item.key === j.key && j.code === i.code).length
                        ? "alarm-card-right--box activeI"
                        : "alarm-card-right--box"
                    }
                    onClick={() => {
                      changeChoose(i, item.key)
                    }}
                  >
                    <span>{i.name}</span>
                    <span>{i.num}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
})
export default CommonCard
