import { EChartsOption } from "echarts"

export function modelPie(params) {
  const { series, sum } = params || { series: [], sum: 0 }
  const option: EChartsOption = {
    grid: { left: "3%", right: "3%", top: "8%", bottom: "8%", containLabel: true },
    backgroundColor: "RGBA(117, 119, 146, 0)",
    // dataZoom: baseDataZoom,
    //你的代码
    color: [
      "rgba(251, 210, 32, 1)",
      "rgba(172, 83, 47, 1)",
      "rgba(66, 100, 130, 1)",
      "rgba(16, 73, 185, 1)",
      "rgba(33, 144, 167, 1)",
      "rgba(135, 73, 225, 1)",
      "rgba(125, 193, 66, 1)",
      "rgba(251, 32, 163, 1)",
      "RGBA(15, 253, 253, 1)",
      "RGBA(69, 113, 255, 1)",
      "RGBA(69, 113, 255, 0.5)",
    ],
    legend: {
      type: "scroll",
      bottom: 20,
      left: "center",
      itemHeight: 15,
      textStyle: {
        color: "#FFFFFF",
        fontSize: "1.4em",
        opacity: 1,
        // rich: {
        //   name: {
        //     padding: [18, 0, 0, -40],
        //     align: "center",
        //   },
        // },
      },
      // formatter: function (name) {
      //   return `\n{name|${name}}`
      // },
    },
    // title: {
    //   text: `{a|${name || ""}}`,
    //   left: "center",
    //   top: "center",
    //   textStyle: {
    //     rich: {
    //       a: {
    //         fontSize: 25 * (screenWidth / 4513),
    //         color: "#fff",
    //       },
    //     },
    //   },
    // },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["30%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "rgba(2, 0, 77, 0.70)",
          borderWidth: 2,
        },

        emphasis: {
          label: {
            show: true,
            fontSize: 30,
            fontWeight: "bold",
          },
        },
        labelLine: {
          length: 20,
          length2: 60,
          // minTurnAngle: 140,
          lineStyle: {
            color: "rgba(75, 212, 255, 1)",
            width: 1,
          },
        },
        label: {
          show: true,
          position: "outside",
          alignTo: "labelLine",
          formatter: function (param) {
            const percent = (((param.value as number) / sum) * 100).toFixed(2)
            return "{a|" + param.name + "}\n{b|" + percent + "%}"
          },
          rich: {
            a: {
              padding: [0, 0, 5, 0],
              fontSize: "14px",
              align: "center",
              color: "#ffffff",
            },
            b: {
              fontSize: "14px",
              fontWeight: "bold",
              align: "center",
              color: "RGBA(22, 175, 250, 1)",
            },
          },
        },
        data: series,
      },
    ],
  }
  return option
}
