<template>
  <div class="custom-field-box">
    <div class="header">
      <div class="title">概念图册</div>
      <div class="right">
        <ant-button>
          <PlusOutlined/>
          添加图片
        </ant-button>
      </div>
    </div>
    <div class="content">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'knowledge-pictures',
  components: {
    PlusOutlined
  }
});
</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.custom-field-box {
  padding: 0 15px 15px 15px;
  background: #FFFFFF;
  max-width: 850px;
  margin: 0 auto;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05);

  .header {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px solid $borderColor;

    .title {
      font-size: 20px;
    }

    .right {
      display: flex;
      gap: 10px;
    }
  }

  .content {
    padding-top: 15px;
    height: 300px;
  }
}

</style>
