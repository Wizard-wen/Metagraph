<template>
  <div class="container">
    <div class="header">
      <div class="title">
        <LockOutlined style="float: left; clear: both; margin-right: 3px; font-size: 16px;"/>
        Wizard-wen / metagraph-serverless
      </div>
      <div class="type-tag">Private</div>
    </div>

    <div class="description">
      Wizard-wen / metagraph serverless metagraph
      serverless metagraph serverless metagraph serverless
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LockOutlined, ReadOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'repo-item-hover',
  components: {
    LockOutlined
  }
});
</script>

<style scoped lang="scss">
.container {
  padding: 12px;
  width: 310px;
  border: 1px solid #ccc;

  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .type-tag {
      width: 65px;
      height: 20px;
      line-height: 20px;
      border-radius: 11px;
      border: 1px solid #ccc;
      font-size: 12px;
    }

    .title {
      //display: flex;
      //align-items: center;
      //flex-wrap: wrap;
      height: auto;
      width: 220px;
      color: #24292f;;
      text-align: left;
      font-size: 14px;
      line-height: 20px;
    }
  }

  .description {
    width: 100%;
    text-align: left;
  }

}
</style>
