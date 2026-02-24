/*
 * @Author: xiongman
 * @Date: 2024-01-18 14:28:50
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-01-03 17:14:32
 * @Description:
 */

import { getUserInfo } from "@/utils/util-funs"
import "./index.less"

import ComprehensiveFakeForm from "@pages/zzz-page-fake/comprehensive-fake-form.tsx"
import GenerateSetFakeForm from "@pages/zzz-page-fake/generate-set-fake-form.tsx"
import { userInfoAtom } from "@store/atom-auth.ts"
import { Button } from "antd"
import { useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PageFake() {
  const userInfo = useAtomValue(userInfoAtom)
  const navigate = useNavigate()
  const [userRoleId, setUserRoleId] = useState(null)
  const noPromise = useMemo(() => !userInfo?.token || (userRoleId !== 1 && userRoleId !== 2), [userRoleId, userInfo])

  const getRole = async () => {
    const res = await getUserInfo()
    if (res) setUserRoleId(res.roleId)
  }
  useEffect(() => {
    if (noPromise && userRoleId) {
      navigate("/no-promise")
    }
  }, [navigate, noPromise, userRoleId])
  useEffect(() => {
    getRole()
  }, [])
  function onBack() {
    window.setTimeout(() => navigate(-1), 100)
  }
  if (noPromise) return <div />
  return (
    <div className="page-wrap page-fake-wrap">
      <Button children="返回" onClick={onBack} />
      <div className="fake-form-box">
        <ComprehensiveFakeForm />
        <GenerateSetFakeForm />
      </div>
    </div>
  )
}
