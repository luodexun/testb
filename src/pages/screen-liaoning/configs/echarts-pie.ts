import { EChartsOption } from "echarts"
import brandImg from "@/assets/liaoning-screen/elec.png"
export const getPieChart = (params) => {
  const { series } = params || {}
  const option: EChartsOption = {
    // tooltip: {
    //   trigger: "item",
    // },
    graphic: [
      {
        type: "image",
        left: "center",
        top: "center",
        z: -10,
        bounding: "all",
        rotation: 0, //旋转
        // scale: [1.0, 1.0], //缩放
        style: {
          image: brandImg,
          width: 21,
          height: 21,
        },
      },
    ],
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["60%", "80%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: series,
      },
    ],
  }
  return option
}
