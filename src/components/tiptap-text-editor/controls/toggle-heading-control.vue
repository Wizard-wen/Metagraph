<template>
  <div class="operation-icon"
       @click="toggleHeading">
    <div class="icon">
      <H1Icon
        v-if="level === 1"
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('heading', { level }) }"/>
      <H2Icon
        v-if="level === 2"
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('heading', { level }) }"/>
      <H3Icon
        v-if="level === 3"
        class="icon-svg"
        :class="{ 'is-active': editor.isActive('heading', { level }) }"/>
    </div>
    <div class="name">
      标题{{ level }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3';
import { defineEmits, defineProps, PropType } from 'vue';
import { H1Icon, H2Icon, H3Icon } from '@/components/icons';

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true
  },
  level: {
    type: Number,
    required: true
  }
});

function toggleHeading() {
  props.editor.chain()
    .focus()
    .toggleHeading({ level: props.level })
    .run();
}
</script>
<style scoped lang="scss">
@import "../../../style/tiptap.common.scss";
</style>
