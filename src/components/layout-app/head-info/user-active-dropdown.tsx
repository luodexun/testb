/*
 * @Author: xiongman
 * @Date: 2023-09-07 18:16:49
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2023-11-20 10:58:13
 * @Description:
 */

import { ConfigProvider, Dropdown, MenuProps } from "antd"
import { useAtomValue } from "jotai"
import { ReactNode, useMemo, useRef, useState } from "react"

import CustomModal from "@/components/custom-modal/index.tsx"
import UdPassword, { IPOperateProps, IPPerateRef } from "@/pages/setting-user/components/ud-password.tsx"
import { udPwMethods } from "@/pages/setting-user/methods/index.ts"
import { TModelFrAndTbInfo } from "@/pages/setting-user/types/index.ts"
import { userInfoAtom } from "@/store/atom-auth.ts"

import { USER_ACT_ITEMS } from "./configs.tsx"

interface IProps {
  children: ReactNode
  onClick?: MenuProps["onClick"]
}
export default function UserActiveDropdown(props: IProps) {
  const { onClick, children } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pwRef = useRef()
  const userInfo = useAtomValue(userInfoAtom)
  const saveChooseItem = useRef()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chooseItem = (e) => {
    if (e.key === "edit-psw") {
      saveChooseItem.current = e
      setIsModalOpen(true)
    }
    onClick(e)
  }
  const theMenu = useMemo(() => {
    return { items: USER_ACT_ITEMS, onClick: chooseItem }
  }, [chooseItem])

  // 修改密码
  const pwBtnClkRef = async (type: "ok" | "close", data?: TModelFrAndTbInfo) => {
    setIsModalOpen(false)
    onClick(saveChooseItem.current)
    // 执行
    // if (type === "ok") {
    //   const res = await udPwMethods(data)
    //   if (!res) return
    //   setIsModalOpen(false)
    // }
    // onClick(saveChooseItem.current)
    // if (type === "close") return setIsModalOpen(false)
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Dropdown: {
            colorBgElevated: "var(--primary-color)",
            controlItemBgHover: "var(--bg-active)",
            colorText: "var(--fontcolor)",
          },
        },
      }}
    >
      <Dropdown menu={theMenu} placement="bottomRight" trigger={["click"]} children={children} />
      <CustomModal<IPOperateProps, IPPerateRef>
        getContainer={false}
        ref={pwRef}
        title="修改密码"
        destroyOnClose
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setIsModalOpen(false)
          onClick(saveChooseItem.current)
        }}
        Component={UdPassword}
        componentProps={{ buttonClick: pwBtnClkRef, selectRowInfo: userInfo }}
      />
    </ConfigProvider>
  )
}
