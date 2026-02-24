/*
 * @Author: xiongman
 * @Date: 2024-01-18 14:43:05
 * @LastEditors: xiongman
 * @LastEditTime: 2024-01-18 14:43:05
 * @Description:
 */

import { MONITOR_CENTER_INFO_LIST } from "@configs/dvs-state-info.ts"
import { StorageComprehensive } from "@configs/storage-cfg.ts"
import CommonFakeForm from "@pages/zzz-page-fake/common-fake-form.tsx"

import { ICenterInfoData } from "@/types/i-monitor-info.ts"

const EXCLUD_INFO = ["capacity", "count", "rate"]
const INDEX_LIST = MONITOR_CENTER_INFO_LIST.filter((item) => !EXCLUD_INFO.includes(item.field))
export default function ComprehensiveFakeForm() {
  return <CommonFakeForm<ICenterInfoData> title="综合指标" storageInfo={StorageComprehensive} itemList={INDEX_LIST} />
}
