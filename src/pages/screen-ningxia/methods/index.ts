import { doBaseServer } from "@/api/serve-funs"
import { validOperate, validResErr } from "@/utils/util-funs"

export const getScreenStaticInfo = async () => {
  const res = await doBaseServer("queryMngStatic", { key: "ningxia" })
  if (validResErr(res)) return null
  return res
}

export const saveScreenVirtualData = async (json) => {
  const params = {
    key: "ningxia",
    data: JSON.stringify(json),
  }
  const res = await doBaseServer("updateMngStatic", params)
  const operate = validOperate(res)
  return operate
}
