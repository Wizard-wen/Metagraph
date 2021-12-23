<template>
  <node-view-wrapper class="vue-component">
    <!--      <span class="label" contenteditable="false">Vue Component</span>-->
    <!--      <node-view-content class="content"/>-->
    <div class="text" @click="handleClick">{{ 66666 }}</div>
  </node-view-wrapper>

</template>

<script lang="ts">
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    NodeViewWrapper,
    // NodeViewContent,
  },

  props: nodeViewProps,
  setup(props) {
    console.log(props);

    function handleClick() {
      console.log('ssss');
    }

    return {
      handleClick
    };
  }
});
</script>

<style lang="scss" scoped>
.vue-component {
  user-select: none;
  //background: #FAF594;
  //border: 3px solid #0D0D0D;
  //border-radius: 0.5rem;
  //margin: 1rem 0;
  //position: relative;
}

.label {
  margin-left: 1rem;
  background-color: #0D0D0D;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
}

.content {
  margin: 2.5rem 1rem 1rem;
  padding: 0.5rem;
  border: 2px dashed #0D0D0D20;
  border-radius: 0.5rem;
}

.text {
  height: 30px;
  width: 120px;
  background: #50bfff;
  border-radius: 4px;
  cursor: pointer;
  color: #FFF!important;
}
</style>
