import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export class TagHelper extends Vue {
    createTag() {
        const newTag = window.prompt("请输入标签名：");

        if (!newTag) {
            window.alert("标签名不能为空！");
        }
        this.$store.commit("createTag", newTag);
    }
}

export default TagHelper;