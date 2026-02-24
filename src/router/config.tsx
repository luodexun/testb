/*
 * @Author: chenmeifeng
 * @Date: 2024-01-18 19:03:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-06-23 15:57:19
 * @Description:
 */
import Error403 from "@pages/error-page/error403"
import Error404 from "@pages/error-page/error404"
import GuangxiScreen from "@pages/guangxi-screen"
import HubeiScreen3 from "@pages/hb-new-screen"
import JsScreen from "@/pages/screen-jiangsu"
// import HubeiScreen from "@pages/hubei-screen"
import LoginPage from "@pages/login"
import PageFake from "@pages/zzz-page-fake"
import { RouteObject } from "react-router"

import LayoutApp from "@/components/layout-app"
import AnhuiScreen from "@/pages/screen-anhui"
import GuangdongScreen from "@/pages/guangdong-screen"
import GuangxiScreenTwo from "@/pages/guangxi-screen/screen-two"
import HbScreenTwo from "@/pages/hubei-screen/screen-two"
import HbSrcTtRight from "@/pages/hubei-screen/screen-right"
import TemporaryScreen from "@/pages/screen-temporary"
import ShanxiScreen from "@/pages/screen-shanxi"
import YunnanScreen from "@/pages/screen-yunan"
import TestSpeak from "@/pages/testSpeak"
import Hb1SrcTtLeft from "@/pages/hb-new-screen/components/left"
import Hb1SrcTtRight from "@/pages/hb-new-screen/components/right"
import Hb1SrcTtCenter from "@/pages/hb-new-screen/components/center"
import HbSrcTtLeft from "@/pages/hubei-screen/screen-left"
import HbSrcTtCenter from "@/pages/hubei-screen/screen-center"
import HNscreen from "@/pages/screen-henan/index"
import HN2screen from "@/pages/screen-henan/screen-two"
import NingXiascreen from "@/pages/screen-ningxia"
import Liaoningscreen from "@/pages/screen-liaoning"
import CommonScreen from "@/pages/screen-common"
import Overview from "@pages/area-state-overview-v2"

/**
 * 路由配置
 */
const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <LayoutApp />,
    children: [],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/gxscreen",
    element: <GuangxiScreen />,
  },
  {
    path: "/gxscreen2",
    element: <GuangxiScreenTwo />,
  },
  {
    path: "/hbscreen",
    element: <HubeiScreen3 />,
  },
  {
    path: "/hb1left",
    element: <Hb1SrcTtLeft />,
  },
  {
    path: "/hb1right",
    element: <Hb1SrcTtRight />,
  },
  {
    path: "/hb1center",
    element: <Hb1SrcTtCenter />,
  },
  // {
  //   path: "/hbscreen3",
  //   element: <HubeiScreen3 />,
  // },
  {
    path: "/hbscreen2",
    element: <HbScreenTwo />,
  },
  {
    path: "/hb2left",
    element: <HbSrcTtLeft />,
  },
  {
    path: "/hb2center",
    element: <HbSrcTtCenter />,
  },
  {
    path: "/hb2right",
    element: <HbSrcTtRight />,
  },
  {
    path: "/gdscreen",
    element: <GuangdongScreen />,
  },
  {
    path: "/ahscreen",
    element: <AnhuiScreen />,
  },
  {
    path: "/jsscreen",
    element: <JsScreen />,
  },
  {
    path: "/sxscreen",
    element: <ShanxiScreen />,
  },
  {
    path: "/ynscreen",
    element: <YunnanScreen />,
  },
  {
    path: "/hnscreen",
    element: <HNscreen />,
  },
  {
    path: "/hn2screen",
    element: <HN2screen />,
  },
  {
    path: "/nxscreen",
    element: <NingXiascreen />,
  },
  {
    path: "/lnscreen",
    element: <Liaoningscreen />,
  },
  {
    path: "/cmscreen",
    element: <CommonScreen />,
  },
  {
    path: "/temporaryscn",
    element: <TemporaryScreen />,
  },
  {
    path: "/stateoverview",
    element: <Overview />,
  },
  { path: "/fake", element: <PageFake /> },
  {
    path: "/error403",
    element: <Error403 />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
]

export { routesConfig }
