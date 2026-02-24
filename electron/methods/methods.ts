export function obj2Str(data: any) {
  if (typeof data === "string") return data
  return JSON.stringify(data ?? "null")
}
