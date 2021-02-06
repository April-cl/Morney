import Vue from 'vue';
import { Component } from 'vue-property-decorator';

const map: { [key: string]: string } = {
    'tag name duplicated': '标签名重复'
}

@Component
export class TagHelper extends Vue {
    createTag() {
        const newTag = window.prompt("请输入标签名：");

        if (!newTag) {
            window.alert("标签名不能为空！");
            return
        }
        this.$store.commit("createTag", newTag);
        if (this.$store.state.createTagError) {
            window.alert(map[this.$store.state.createTagError.message] || '未知错误')
        } else {
            window.alert('新建成功')
        }
    }
}

export default TagHelper;