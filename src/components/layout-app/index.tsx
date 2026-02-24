/*
 * @Author: xiongman
 * @Date: 2022-11-01 10:58:25
 * @LastEditors: xiongman
 * @LastEditTime: 2022-11-01 10:58:25
 * @Description: 页面根节点布局容器组件
 */

import "./index.less"

import { SCEND_20 } from "@configs/time-constant.ts"
import usePageResize from "@hooks/use-page-resize.ts"
import { userInfoAtom } from "@store/atom-auth.ts"
import { AtomPageCarousel, AtomPagePathList, AtomRouteReady, AtomUserOfMenuMap } from "@store/atom-menu.ts"
import { Layout } from "antd"
import { useAtom, useAtomValue } from "jotai"
import React, { ReactNode, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { BoxLoading } from "@/components/box-loading"
import { MENU_SPLIT_FLAG } from "@/router/variables.ts"
import ResponseListener from "@/utils/response-listener"

import LayoutContent from "../layout-content"
import HeadInfo from "./head-info"

interface IProps {
  children?: ReactNode
}
export default function LayoutApp(props: IProps) {
  const { children } = props
  const [routeReady, setRouteReady] = useAtom(AtomRouteReady)
  // 根据用户角色过滤后的树形菜单数据
  const menuList = useAtomValue(AtomUserOfMenuMap)
  const pagePathList = useAtomValue(AtomPagePathList)
  const userInfo = useAtomValue(userInfoAtom)
  const pageCarousel = useAtomValue(AtomPageCarousel)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const timeFlagRef = useRef(0)
  const routeIndexRef = useRef(0)

  useEffect(() => {
    // 跳过登录就注释
    const toLoginPage = () => navigate("/login")
    ResponseListener.addListener("toLoginPage", toLoginPage)
    return () => {
      ResponseListener.removeListener("toLoginPage", toLoginPage)
    }
  }, [navigate])

  const routeReadyRef = useRef(routeReady)
  routeReadyRef.current = routeReady
  const resizeRef = useRef(() => {
    if (!routeReadyRef.current) return
    setRouteReady(false)
    window.setTimeout(() => setRouteReady(true), 0)
  })
  usePageResize(resizeRef.current, 0)

  useEffect(() => {
    // 根路由、没登录、路由数据没处理好
    if (pathname !== "/" || !userInfo?.token || !routeReady) return
    const firstMenuPath = menuList.find(({ path }) => path === MENU_SPLIT_FLAG)?.children?.[0]?.path
    if (!firstMenuPath) return
    navigate(firstMenuPath)
  }, [menuList, navigate, routeReady, pathname, userInfo?.token])

  useEffect(() => {
    window.clearTimeout(timeFlagRef.current)
    if (!pageCarousel.isCarousel || !pagePathList?.length) return () => {}
    const maxPageIndex = pagePathList.length
    ;(function doPageCarousel() {
      window.clearTimeout(timeFlagRef.current)
      if (!pageCarousel.isCarousel) return
      if (routeIndexRef.current >= maxPageIndex) {
        routeIndexRef.current = 0
        return
      }
      const thePagePath = pagePathList[routeIndexRef.current]
      if (!thePagePath) return
      navigate(thePagePath)
      routeIndexRef.current += 1
      const timeOut = Math.floor((pageCarousel.waitTime ?? SCEND_20) * 1000)
      timeFlagRef.current = window.setTimeout(() => {
        doPageCarousel()
      }, timeOut)
    })()
    return () => window.clearTimeout(timeFlagRef.current)
  }, [navigate, pageCarousel, pagePathList])

  return (
    <Layout className="app-layout none-select">
      <Layout.Header children={<HeadInfo />} />
      {routeReady ? children ?? <LayoutContent /> : <BoxLoading />}
    </Layout>
  )
}
