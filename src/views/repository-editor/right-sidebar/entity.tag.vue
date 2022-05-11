<template>

  <div class="edge-item">
    <div class="top-arrow" v-if="k2 === 'Pre' || k2  === 'Current'">
      <arrow-up-icon style="font-size: 16px;"></arrow-up-icon>
    </div>
    <div class="entity" >
      <div class="left">
        <arrow-left-icon style="font-size: 16px;"></arrow-left-icon>
      </div>
      <div class="content" :class="{'entity-active': k2 === 'Current'}">
        <div class="inner-content">
          <div class="target-icon" v-if="k2 === 'Current'">
            <TagOutlined />
          </div>
          <div class="title">
            {{ k1.name }}
          </div>
          <div class="basic">
            <div class="basic-item basic-item-border">Knowledge</div>
            <div class="basic-item basic-item-border">
              <StarOutlined/>
              {{ k1.star }}
            </div>
            <div class="basic-item">
              <CommentOutlined/>
              {{ k1.comment }}
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <arrow-right-icon style="font-size: 16px;"></arrow-right-icon>
      </div>
    </div>
    <div class="bottom-arrow" v-if="k2  === 'After' || k2  === 'Current'">
      <arrow-down-icon style="font-size: 16px;"></arrow-down-icon>
    </div>
  </div>
</template>

<script lang="ts">

import { CommentOutlined, StarOutlined, TagOutlined } from '@ant-design/icons-vue';
import {
  defineComponent, computed
} from 'vue';
import ArrowUpIcon from '@/components/icons/arrow.up.icon.vue';
import ArrowDownIcon from '@/components/icons/arrow.down.icon.vue';
import ArrowRightIcon from '@/components/icons/arrow.right.icon.vue';
import ArrowLeftIcon from '@/components/icons/arrow.left.icon.vue';

export default defineComponent({
  components: {
    StarOutlined,
    CommentOutlined,
    TagOutlined,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowRightIcon,
    ArrowLeftIcon
  },
  props: {
    knowledgeType: {
      type: String,
      required: true
    },
    knowledge: {
      type: Object,
      required: true
    }
  },
  setup({ knowledgeType, knowledge }) {
    const k1 = computed(() => knowledge);
    const k2 = computed(() => knowledgeType);
    return {
      k1,
      k2
    };
  }
});
</script>
<style lang="scss" scoped>
@import '../../../style/common';

.edge-item {
  .top-arrow {
    height: 45px;
    width: 100%;
    line-height: 45px;
  }

  .entity {
    box-sizing: border-box;
    height: 95px;
    width: 100%;
    display: flex;
    justify-content: space-around;

    .left, .right {
      height: 95px;
      width: 25px;
      display: inline-block;
      line-height: 95px;
      margin: 0 auto;
    }

    .content {
      width: calc(100% - 50px);
      //padding: 0 15px;
      border: 1px solid $borderColor;

      .inner-content {
        position: relative;
        .target-icon{
          position: absolute;
          left: 5px;
          top: 5px;
        }
        .title {
          height: 60px;
          line-height: 60px;
          font-size: 24px;
          text-align: center;
          border-bottom: 1px solid $borderColor;
        }

        .basic {
          height: 35px;
          line-height: 35px;
          text-align: center;
          width: 100%;
          font-size: 12px;
          display: flex;

          .basic-item {
            width: 33.3%;
          }

          .basic-item-border {
            border-right: 1px solid $borderColor;
          }
        }
      }
    }
  }

  .entity-active {
    background: #e6f7ff;
    color: #1790ff;
  }

  .bottom-arrow {
    height: 45px;
    width: 100%;
    line-height: 45px;
  }
}
</style>
