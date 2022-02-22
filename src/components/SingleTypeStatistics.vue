<template>
  <div class="signle-type-statistics">
    <h2>
      {{ gachaTypeName }}-<span>总{{ stat.total }}抽</span>
    </h2>
    <h5>
      金卡数{{ stat.star5s.length }}, 平均出金{{ stat.star5AvgTimes }}, 概率{{
        stat.star5Rate
      }}
    </h5>
    <h3>已{{ stat.hold5Count }}抽未得5星,已{{ stat.hold4Count }}抽未得4星</h3>

    <div class="star5-gallery">
      <div class="star" v-for="star in stat.star5s" :key="star.id">
        {{ star.name }}/{{ star.times }}
      </div>
    </div>

    <div class="charts">
      <div
        class="echart"
        ref="rankTypeChart"
        :style="{ width: '30%', height: '230px' }"
      ></div>
      <div
        class="echart"
        ref="star4sStatisticsChart"
        :style="{ width: '70%', height: '230px' }"
      ></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { gachaTypes } from "../utils/dictionary";
import { getLocalStorageJson } from "../utils/util";
import analyzeChart from "@/components/AnalyzeChart";
import linq from "linq";
import * as echarts from "echarts";

/*
  count: "1"
gacha_type: "400"
id: "1644739560000139180"
item_id: ""
item_type: "武器"
lang: "zh-cn"
name: "鸦羽弓"
rank_type: "3"
time: "2022-02-13 16:49:02"
uid: "511585580"
  */
export default {
  name: "SingleTypeStatistics",
  props: {
    logs: Array,
    gachaType: Number,
  },
  components: { analyzeChart },
  data() {
    return {
      rankTypeChart: "",
      star4sStatisticsChart: "",
      isInitChart: false,
      temp: {
        source: [],
        total: 0,
        hold5Count: 0, //已x抽,未中5星
        hold4Count: 0, //已x抽,未中4星
        star5Rate: 0, //平均5星次数
        star5s: [], //5星
        star4sStatistics: [], //4星数量
        //roles:[], //所有角色
        rankTypesCount: [], //星级和数量
      },
    };
  },

  mounted() {},
  watch: {
    logs: {
      handler() {
        this.drawChart();
      },
    },
  },
  computed: {
    gachaTypeName() {
      return gachaTypes.find(this.gachaType);
    },
    stat() {
      let stat = this.analyzeData(this.logs);
      return stat;
    },
  },
  methods: {
    //逆序的log
    analyzeData(logs) {
      let total = logs.length;
      let rankTypesCount = linq
        .from(logs)
        .groupBy((s) => s.rank_type)
        .select((s) => {
          return {
            rankType: s.key(),
            name: s.key() + "星",
            value: s.count(),
          };
        })
        .toArray();

      //抽中的5星
      let star5Element = { times: 0 };
      let _star5s = [star5Element];
      //抽中的4星
      let star4Element = { times: 0 };
      let _star4s = [star4Element];
      for (let index = 0; index < total; index++) {
        const element = logs[index];

        if (element.rank_type == 5) {
          star5Element = element;
          star5Element.times = 1;
          _star5s.push(star5Element);
        } else {
          star5Element.times++;
        }

        if (element.rank_type == 4) {
          star4Element = element;
          star4Element.times = 1;
          _star4s.push(star4Element);
        } else {
          star4Element.times++;
        }
      }

      //改为顺序
      let star5s = _star5s.slice(1).reverse();
      let star4s = _star4s.slice(1).reverse();
      //最后一次抽中5星的索引
      let hold5Count = _star5s[0].times;
      //最后一次抽中4星的索引
      let hold4Count = _star4s[0].times;

      //每个星级的数量
      let star4sStatistics = linq
        .from(star4s)
        .groupBy((s) => s.name)
        .select((s) => {
          return {
            name: s.key(),
            value: s.count(),
          };
        })
        .toArray();

    let star5Rate = total == 0 ? 0: ((star5s.length / (total - hold5Count)) * 100);
      return {
        source: logs,
        total: total,
        hold5Count: hold5Count,
        hold4Count: hold4Count,
        star5AvgTimes: (linq.from(star5s).average((s) => s.times) || 0).toFixed(
          2
        ),
        star5Rate: (star5Rate || 0).toFixed(2) + "%",
        star5s: star5s,
        star4sStatistics,
        rankTypesCount,
      };
    },
    drawChart() {
      //等待dom显示后, 渲染图表
      this.$nextTick(() => {
        this.initChart();
        this.rankTypeChart.setOption(this.getRankTypeOption());
        this.star4sStatisticsChart.setOption(this.getStar4sStatisticsOption());
      });
    },
    getRankTypeOption() {
      let data = this.stat.rankTypesCount;
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
            name: "星数统计",
            type: "pie",
            data: data,
            label: {
              show: true,
              formatter: '{b}\n{c}次({d}%)',
            },
            roseType: "area",
          },
        ],
      };
      return option;
    },
    getStar4sStatisticsOption() {
      let data = this.stat.star4sStatistics;
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
            name: "星数统计",
            type: "pie",
            data: data,
            label: {
              show: true,
              formatter: '{b}\n{c}次({d}%)',
            },
            roseType: "area",
          },
        ],
      };
      return option;
    },
    initChart() {
      if (this.isInitChart) {
        return;
      }

      let rankTypeChart = echarts.init(this.$refs.rankTypeChart);
      this.rankTypeChart = rankTypeChart;

      let star4sStatisticsChart = echarts.init(
        this.$refs.star4sStatisticsChart
      );
      this.star4sStatisticsChart = star4sStatisticsChart;

      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        rankTypeChart.resize();
        star4sStatisticsChart.resize();
      });
    },
  },
};
</script>

<style lang="scss">
.signle-type-statistics {
  box-shadow: 0 2px 10px 0 #f1f1f1;
  border-radius: 5px;
  padding: 12px;
  background: #f8f8f8;

  .star5-gallery {
    display: flex;
    .star {
      padding: 3px;
      color: rgb(255, 174, 0);
    }
  }

  .charts {
    display: flex;
    .echart {
      flex-shrink: 0;
    }
  }
}
</style>