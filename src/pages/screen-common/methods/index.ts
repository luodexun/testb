export const getMapName = async (screen) => {
  let kuangName = ""
  let mapName = ""
  let kuangMap = null
  let provinceMap = null
  let otherMap = {}
  switch (screen) {
    case "sxscreen":
      kuangName = "山西框"
      mapName = "山西"
      kuangMap = await import(`@/assets/shanxi-screen/kuang.json`).then((module) => module.default)
      provinceMap = await import(`@/assets/shanxi-screen/map.json`).then((module) => module.default)
      break
    case "gdscreen":
      kuangName = "广东框"
      mapName = "广东"
      kuangMap = await import(`@/assets/guangdong-screen/map.json`).then((module) => module.default)
      provinceMap = await import(`@/assets/guangdong-screen/json/kuang.json`).then((module) => module.default)
      otherMap = {
        潮南: await import(`@/assets/guangdong-screen/json/chaonan.json`).then((module) => module.default),
        恵来: await import(`@/assets/guangdong-screen/json/huilai.json`).then((module) => module.default),
        清远: await import(`@/assets/guangdong-screen/json/qingyuan.json`).then((module) => module.default),
        粤北: await import(`@/assets/guangdong-screen/json/yuebei.json`).then((module) => module.default),
        粤中: await import(`@/assets/guangdong-screen/json/yuezhong.json`).then((module) => module.default),
        粤西: await import(`@/assets/guangdong-screen/json/yuexi.json`).then((module) => module.default),
        湛江: await import(`@/assets/guangdong-screen/json/zhanjiang.json`).then((module) => module.default),
      }
      //   echarts.registerMap("潮南", chaonan as any)
      // echarts.registerMap("恵来", huilai as any)
      // echarts.registerMap("清远", qingyuan as any)
      // echarts.registerMap("粤北", yuebei as any)
      // echarts.registerMap("粤中", yuezhong as any)
      // echarts.registerMap("粤西", yuexi as any)
      // echarts.registerMap("湛江", zhanjiang as any)
      break
    case "gxscreen":
      kuangName = "广西框"
      mapName = "广西"
      kuangMap = await import(`@/assets/guangxi-srceen/kuang.json`).then((module) => module.default)
      provinceMap = await import(`@/assets/guangxi-srceen/map.json`).then((module) => module.default)
      break
    // default:
    //   kuangName = "山西框"
    //   mapName = "山西"
  }
  return { kuangName, mapName, kuangMap, provinceMap, otherMap }
}
