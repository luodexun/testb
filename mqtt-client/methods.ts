/*
 * @Author: xiongman
 * @Date: 2024-02-28 15:04:33
 * @LastEditors: xiongman
 * @LastEditTime: 2024-02-28 15:04:33
 * @Description:
 */

export function specialTopic(msgTopic: string) {
  if (msgTopic.startsWith("/alarm/")) return "/alarm/#"
  return msgTopic
}
