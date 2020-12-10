import content from '../shims-vue';
<template>
  <Layout class-prefix="layout">
    <NumberPad @update:value="onUpdateAmount" />
    <Types @update:value="onUpdateTypes" />
    <Notes @update:value="onUpdateNotes" />
    <Tags @update:value="onUpdateTags" :data-source.sync="tags" />
    {{record}}
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import NumberPad from "@/components/Money/NumberPad.vue";
import Types from "@/components/Money/Types.vue";
import Notes from "@/components/Money/Notes.vue";
import Tags from "@/components/Money/Tags.vue";
import { Component } from "vue-property-decorator";

type Record = {
  tags: string[];
  notes: string;
  types: string;
  amount: number;
};

@Component({
  components: { Tags, Notes, Types, NumberPad },
})
export default class Money extends Vue {
  tags: string[] = ["衣", "食", "住", "行"];

  record: Record = {
    tags: [],
    notes: "",
    types: "-",
    amount: 0,
  };

  onUpdateTags(value: string[]) {
    this.record.tags = value;
  }

  onUpdateNotes(value: string) {
    this.record.notes = value;
  }

  onUpdateTypes(value: string) {
    this.record.types = value;
  }

  onUpdateAmount(value: number) {
    this.record.amount = value;
  }
}
</script>

<style lang="scss">
.layout-content {
  display: flex;
  flex-direction: column-reverse;
}
</style>