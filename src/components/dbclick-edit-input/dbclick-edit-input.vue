<template>
  <div class="rect" v-if="!isEditing" @dblclick="handleEdit">{{ text }}</div>
  <input
    @blur="handleSave"
    v-model="text"
    v-if="isEditing"
    type="text"
    class="form-control" ref="inputRef">
</template>

<script lang="ts">
import {
  defineComponent, inject, nextTick, onMounted, onUnmounted, ref
} from 'vue';

export default defineComponent({
  name: 'dbclick-edit-input',
  setup() {
    const getGraph = inject<any>('getGraph');
    const inputRef = ref();
    const isEditing = ref(false);
    const text = ref('');

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        isEditing.value = false;
      }
    }

    onMounted(() => {
      window.addEventListener('keydown', handleKeyDown);
      console.log(typeof getGraph);
      const graph = getGraph();
      console.log(graph);
    });
    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeyDown);
    });

    function handleEdit() {
      isEditing.value = true;
      nextTick(() => {
        inputRef.value.focus();
      });
    }

    function handleSave() {
      isEditing.value = false;
    }

    return {
      text,
      inputRef,
      isEditing,
      handleEdit,
      handleSave
    };
  }
});
</script>

<style scoped lang="scss">
.rect {
  border: 1px solid #5F95FF;
  background: #EFF4FF;
  height: 36px;
  line-height: 36px;
  width: 66px;
  border-radius: 5px;
}
.form-control {
  display: inline-block;
  height: 36px;
  width: 66px;
  padding-left: 5px;
}
</style>
