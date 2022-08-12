<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
        <div id="main" style="width: 600px; height: 400px"></div>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      option: {
        title: {
          text: "ECharts 入门示例",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    };
  },
  methods: {},
  created() {},
  async mounted() {
    const { data: res } = await this.$http.get(`reports/type/1`);
    if (res.meta.status !== 200) return this.$message.error("获取失败");
    var myChart = echarts.init(document.getElementById("main"));

    myChart.setOption(res.data);
  },
};
</script>

<style>
</style>