import { doBaseServer } from "@/api/serve-funs"
import { validResErr } from "@/utils/util-funs"

export const updateMngStaticInfo = async (info) => {
  const params = {
    key: "site_quota",
    data: info,
  }
  const res = await doBaseServer("updateMngStatic", params)
}

export const getMngStaticInfo = async () => {
  const info = await doBaseServer("queryMngStatic", { key: "site_quota" })
  if (validResErr(info)) return false
  return info.data
}
