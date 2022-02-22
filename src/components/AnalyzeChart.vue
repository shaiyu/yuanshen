<template>
  <div class="analyze-chart">
    <div
      class="echart"
      id="echart-line"
      :style="{ float: 'left', width: '100%', height: '230px' }"
    ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "analyzechart",
  props: {
    data: Array,
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {
    data() {
      this.init(this.formatterData);
    },
  },
  computed: {
    formatterData() {
      return this.data.map((s) => {
        return {
          name: s.name,
          value: s.count,
        };
      });
    },
  },
  methods: {
    init(data) {
      let getchart = echarts.init(document.getElementById("echart-line"));

      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "角色活动五星",
            type: "pie",
            data: data,
            label: {
              show: true,
            },
            roseType: "area",
          },
        ],
      };

      getchart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        getchart.resize();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.analyze-chart {
  width: 100%;
}
</style>