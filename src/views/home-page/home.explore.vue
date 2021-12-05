<template>
  <div class="explore-box">
    <h2 class="explore-header">Explore repositories</h2>
    <div class="explore-item">
      <div class="title">Deja-vuuu/vue-ele</div>
      <div class="description">Idiomatic Session Module for NestJS. </div>
      <div class="action">
        <div class="action-item">
          <StarOutlined style="margin-right: 8px"/>
          <span>233</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { LikeOutlined, MenuOutlined, StarOutlined } from '@ant-design/icons-vue';

const data = [
  {
    title: 'Ant Design Title 1',
  },
];
export default defineComponent({
  name: 'home.explore',
  components: {
    StarOutlined
  },
  setup() {
    return {
      data
    };
  }
});
</script>

<style scoped lang="scss">
.explore-box {
  width: 350px;
  padding: 0 24px;
  margin-top: 32px;

  .explore-header {
    font-size: 14px;
    text-align: left;
  }

  .explore-item {
    margin: 8px 0;
    padding: 8px 0;
    text-align: left;
    border-bottom: 1px solid #ccc;

    .title {
      font-weight: bold;
      cursor: pointer;
    }

    .description {
      margin-bottom: 8px;
      max-width: 70%;
    }

    .action {
      display: flex;
      justify-content: flex-start;
      .action-item {
        margin-right: 10px;
      }
    }
  }
}
</style>
