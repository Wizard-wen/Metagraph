<template>

</template>

<script setup lang="ts">
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
export default {
  name: 'knowledge-mentioned-list'
};
</script>

<style scoped>

</style>
