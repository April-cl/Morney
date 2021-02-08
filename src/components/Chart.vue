<template>
  <div id="main"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
import { EChartOption, ECharts } from "echarts";

@Component
export default class Chart extends Vue {
  @Prop() options: EChartOption;
  myChart?: ECharts;
  mounted() {
    if (this.options === undefined) {
      return console.log("options 为空");
    }
    this.myChart = echarts.init(document.getElementById("main"));
    this.myChart.setOption(this.options);
  }

  @Watch("options")
  onOptionsChange(newValue: EChartOption) {
    console.log(newValue);
    this.myChart.setOption(newValue);
  }
}
</script>

<style scoped>
#main {
  height: 400px;
}
</style>