<template>
  <div id="main" ref="wrapper"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import * as echarts from "echarts";
import { EChartsOption, ECharts } from "echarts";

@Component
export default class Chart extends Vue {
  @Prop() options?: EChartsOption;
  myChart?: ECharts;
  mounted() {
    if (this.options === undefined) {
      return console.log("options 为空");
    }
    this.myChart = echarts.init(this.$refs.wrapper as HTMLDivElement);
    this.myChart.setOption(this.options);
  }

  @Watch("options")
  onOptionsChange(newValue: EChartsOption) {
    this.myChart?.setOption(newValue);
  }
}
</script>

<style scoped>
#main {
  height: 400px;
}
</style>