<template>
  <div>
    <div class="panel" v-for="item in domainTree" :key="item.id">
      <div class="panel-title">{{ item.title }}</div>
      <div class="panel-content">
        <div class="classic" v-for="innerItem in item.children" :key="innerItem.id">
          <div class="classic-title">{{ innerItem.title }}</div>
          <div class="classic-content">
            <template
              v-for="classicItem in innerItem.children"
              :key="classicItem.id">
              <div class="active-classic-item"
                   v-if="selectKeys.includes(classicItem.id)"
                   @click="handleClickItem(classicItem.id, 'remove')">
                {{ classicItem.title }}
                <CloseOutlined/>
              </div>
              <div class="classic-item" v-else @click="handleClickItem(classicItem.id, 'add')">
                {{ classicItem.title }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType } from 'vue';
import { DomainTreeNodeResponseType } from 'metagraph-constant';
import { CloseOutlined } from '@ant-design/icons-vue';

const emit = defineEmits(['selectChange']);
defineProps({
  domainTree: {
    type: Array as PropType<DomainTreeNodeResponseType[]>
  },
  selectKeys: {
    type: Array as PropType<string[]>,
    default() {
      return [];
    }
  }
});

function handleClickItem(id: string, type: 'add' | 'remove') {
  emit('selectChange', {
    id,
    type
  });
}
</script>

<style scoped lang="scss">
@import "../../style/common.scss";

.panel {
  width: 100%;

  .panel-title {
    height: 28px;
    font-size: 16px;
    line-height: 28px;
    font-weight: 600;
  }

  .panel-content {
    padding: 5px 0;
    display: flex;
    flex-wrap: wrap;

    .classic {
      min-width: 120px;
      margin-bottom: 20px;

      .classic-title {
        font-size: 14px;
        margin-bottom: 5px;
      }

      .classic-content {
        .classic-item {
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          color: $lightFontColor;
          cursor: pointer;
          margin-bottom: 2px;
        }

        .active-classic-item {
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          cursor: pointer;
          background: $themeColor;
          padding: 0 6px;
          width: max-content;
          border-radius: 3px;
          color: #FFF;
          margin-bottom: 2px;
        }
      }
    }
  }
}
</style>
