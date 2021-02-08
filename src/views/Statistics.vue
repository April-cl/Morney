<template>
  <Layout>
    <Tabs class-prefix="type" :data-source="recordTypeList" :value.sync="type" />
    <div class="chart-wrapper">
      <Chart class="chart" :options="chartOptions" />
    </div>
    <ol v-if="groupedList.length > 0">
      <li v-for="(group, index) in groupedList" :key="index">
        <h3 class="title">
          {{beautify(group.title)}}
          <span>￥{{group.total}}</span>
        </h3>
        <ol>
          <li v-for="item in group.items" :key="item.id" class="record">
            <span>{{tagString(item.tags)}}</span>
            <span class="notes">{{item.notes}}</span>
            <span>￥{{item.amount}}</span>
          </li>
        </ol>
      </li>
    </ol>
    <div v-else class="noResult">目前没有记录</div>
  </Layout>
</template>

<script lang="ts">
import Tabs from "@/components/Tabs.vue";
import Vue from "vue";
import { Component } from "vue-property-decorator";
import recordTypeList from "@/constants/recordTypeList";
import dayjs from "dayjs";
import clone from "@/lib/clone.ts";
import Chart from "@/components/Chart.vue";
import _ from "lodash";

@Component({
  components: { Tabs, Chart },
})
export default class Statistics extends Vue {
  mounted() {
    const chartWrapper = document.getElementsByClassName("chart-wrapper")[0];
    chartWrapper.scrollLeft = chartWrapper.scrollWidth;
  }
  beautify(string: string) {
    const day = dayjs(string);
    const now = dayjs();
    if (day.isSame(now, "day")) {
      return "今天";
    } else if (day.isSame(now.subtract(1, "day"), "day")) {
      return "昨天";
    } else if (day.isSame(now, "year")) {
      return day.format("M月D日");
    } else {
      return day.format("YYYY年M月D日");
    }
  }
  get recordList() {
    return (this.$store.state as RootState).recordList;
  }
  get groupedList() {
    const { recordList } = this;
    const newList = clone(recordList)
      .filter((r) => r.type === this.type)
      .sort(
        (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
    if (newList.length === 0) {
      return [];
    }
    type Result = { title: string; total?: number; items: RecordItem[] }[];
    const result: Result = [
      {
        title: dayjs(newList[0].createdAt).format("YYYY-MM-DD"),
        items: [newList[0]],
      },
    ];
    for (let i = 1; i < newList.length; i++) {
      const current = newList[i];
      const last = result[result.length - 1];
      if (dayjs(last.title).isSame(dayjs(current.createdAt), "day")) {
        last.items.push(current);
      } else {
        result.push({
          title: dayjs(current.createdAt).format("YYYY-MM-DD"),
          items: [current],
        });
      }
    }
    result.map((group) => {
      group.total = group.items.reduce((sum, item) => {
        return sum + item.amount;
      }, 0);
    });
    return result;
  }
  get keyValueList() {
    const today = new Date();
    const array = [];
    for (let i = 0; i <= 29; i++) {
      const dateString = dayjs(today).subtract(i, "day").format("YYYY-MM-DD");
      const found = _.find(this.groupedList, { title: dateString });
      array.push({
        key: dateString,
        value: found ? found.total : 0,
      });
    }
    array.sort((a, b) => {
      if (b.key > a.key) {
        return -1;
      } else {
        return 1;
      }
    });
    return array;
  }
  get chartOptions() {
    const keys = this.keyValueList.map((item) => item.key);
    const values = this.keyValueList.map((item) => item.value);
    return {
      grid: {
        left: 0,
        right: 0,
      },
      xAxis: {
        data: keys,
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: "#666" } },
      },
      yAxis: {},
      series: [
        {
          symbol: "circle",
          symbolSize: 14,
          itemStyle: {
            color: "#666",
            borderColor: "#666",
          },
          type: "line",
          data: values,
        },
      ],
      tooltip: {
        show: true,
        formatter: "{c}",
      },
    };
  }
  tagString(tags: Tag[]) {
    return tags.length === 0 ? "无" : tags.map((t) => t.name).join(",");
  }
  beforeCreate() {
    this.$store.commit("fetchRecords");
  }
  type = "-";
  interval = "day";
  recordTypeList = recordTypeList;
}
</script>

<style lang="scss" scoped>
%item {
  padding: 8px 16px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.title {
  @extend %item;
}
.record {
  background: white;
  @extend %item;
}
.notes {
  margin-right: auto;
  margin-left: 16px;
  color: #999;
}

.noResult {
  padding: 16px;
  text-align: center;
}

::v-deep {
  .type-tabs-item {
    background: white;
    &.selected {
      background: #c4c4c4;
      &::after {
        display: none;
      }
    }
  }
  .interval-tabs-item {
    height: 48px;
  }
  .chart {
    width: 430%;
    &-wrapper {
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>
