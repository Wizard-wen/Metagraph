<template>
  <div class="repository-list-item">
    <div class="icon">

    </div>
    <div class="content">
      <div class="header">{{}}</div>
      <div class="description"></div>
      <div class="label-box">
        <div class="label-item"></div>
      </div>
      <div class=""></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';

export default defineComponent({
  name: 'repository-list-item',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { title } = toRefs(props);

    return {
      title
    }
  }
});
</script>

<style scoped lang="scss">
.repository-list-item {
  display: flex;
  justify-content: flex-start;
  padding: 24px 0;
  border-bottom: 1px solid #eaecef;

  .icon {
    margin-right: 8px;
  }

  .content {

  }
}
</style>
