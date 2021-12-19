<template>
  <div class="bind-panel">
    <div class="knowledge-connection">
      <div class="title">引用的知识点</div>
      <div class="content" v-if="edges?.target?.preInnerList.length">
        <div
          class="content-item"
          v-for="item in edges.target.preInnerList">
          {{ item.content.name }}
          <EyeOutlined/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EyeOutlined } from '@ant-design/icons-vue';
import { edges } from './model/knowledge.edit';
/**
 * 功能需求
 * 1.获取知识点引用的知识点
 * 2.编辑知识点基本信息
 * 3.动态增加信息项
 * 4.知识点的信息定义要有一个文字的上限
 * 5.可以为知识点引用静态资源？
 * 6.知识点之间的同义词
 * 7.引用数量 被引数量 建立的关系说明
 * 8.文本编辑器中的mention节点可以被点击，不但展示引用的知识点的信息，还要展示引用的理由
 * 9.引用知识点时，弹窗应该添加引用的原因
 * 10.可以选择一段文本，直接标记为引用
 * 11.可以考虑展示一下，同一个知识点之间的循环引用关系
 */

</script>

<style scoped lang="scss">
.bind-panel {
  width: 100%;
  height: calc(100vh - 55px);
}

.knowledge-connection {
  width: 100%;
  height: 100%;

  .title {
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid #ccc;
  }

  .content {
    padding: 10px 0;

    .content-item {
      padding: 0 10px;
      text-align: left;
      height: 35px;
      line-height: 35px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        cursor: pointer;
        background: #50bfff;
        color: #FFFFFF;
      }
    }
  }
}
</style>
