<template>
  <div class="card-item">
    <section class="header">
      <div class="header-content">
        <div class="title" @click="handleClickTitle(planItem)">
          {{ planItem.name }}
        </div>
        <div class="edit-btn" @click="handleEdit(planItem)">
          <EditOutlined/>
        </div>
      </div>
    </section>
    <div class="content">
      <div class="inner-content">
        <div class="list-container">
          <div class="list-item">
            <div class="circle"></div>
            已完成16
          </div>
          <div class="list-item">
            <div class="circle"></div>
            进行中5
          </div>
          <div class="list-item">
            <div class="circle"></div>
            未开始20
          </div>
        </div>
        <a-tooltip title="3 done / 3 in progress / 4 to do">
          <a-progress :width="90" :percent="60" :success-percent="30" type="circle"/>
        </a-tooltip>
      </div>
      <div class="bottom">
        <div class="deadline">
          剩余28天
        </div>
        <div class="status-tag">26个知识点</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlanModelType } from 'metagraph-constant';
import { defineEmits, defineProps, PropType } from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';
import { Progress as AProgress, Tooltip as ATooltip } from 'ant-design-vue';

defineProps({
  planItem: {
    type: Object as PropType<PlanModelType>,
    required: true
  }
});

const emit = defineEmits(['clickTitle', 'edit']);

function handleClickTitle(item: PlanModelType) {
  emit('clickTitle', item.id);
}

function handleEdit(item: PlanModelType) {
  emit('edit', item.id);
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.card-item {
  width: 288px;
  border: 1px solid $borderColor;
  border-radius: $borderRadius;

  .header {
    padding: 0 10px;

    .header-content {
      height: 40px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        cursor: pointer;
        min-width: 120px;
        width: max-content;
        text-align: left;
      }

      .edit-btn {
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          cursor: pointer;
          background: $hoverBackColor;
        }
      }
    }
  }

  .content {
    padding: 10px;
    min-height: 80px;
    width: 100%;

    .inner-content {
      padding: 0 10px 10px;
      height: 110px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .list-container {
        height: 90px;

        .list-item {
          display: flex;
          align-items: center;
          text-align: left;
          font-size: 12px;
          line-height: 28px;

          .circle {
            height: 4px;
            width: 4px;
            margin-right: 3px;
            border-radius: 2px;
            background: #2ea44f;
          }
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .deadline {
        font-size: 12px;
        line-height: 1;
      }

      .status-tag {
        height: 18px;
        width: max-content;
        padding: 0 4px;
        font-size: 12px;
        border: 1px solid $borderColor;
        border-radius: 4px;
      }
    }

  }
}
</style>
