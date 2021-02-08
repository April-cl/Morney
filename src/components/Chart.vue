<template>
  <div id="main"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as echarts from "echarts";
import { EChartOption } from "echarts";

@Component
export default class Chart extends Vue {
  @Prop() options: EChartOption;
  mounted() {
    if (this.options === undefined) {
      return console.log("options 为空");
    }
    const myChart = echarts.init(document.getElementById("main"));
    myChart.setOption(this.options);
  }
}
</script>

<style scoped>
#main {
  height: 400px;
}
</style>