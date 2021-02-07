<template>
  <Layout>
    <Tabs class-prefix="type" :data-source="recordTypeList" :value.sync="type" />
    <div id="main"></div>
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
import * as echarts from "echarts";

@Component({
  components: { Tabs },
})
export default class Statistics extends Vue {
  mounted() {
    console.log("mounted");
    const myChart = echarts.init(document.getElementById("main"));
    myChart.setOption({
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
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
    });
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
#main {
  width: 600px;
  height: 400px;
}
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
}
</style>
