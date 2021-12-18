<template>
  <div class="repository-list-item">
    <repo-item-icon class="repo-icon"></repo-item-icon>
    <div class="content">
      <div class="title">angular/<em>angular</em></div>
      <div class="description">
        The modern web developer’s platform
      </div>
      <div class="tag-list">
        <div class="tag">angular</div>
        <div class="tag">typescript</div>
        <div class="tag">javascript</div>
      </div>
      <div class="banner">
        <div class="banner-item">
          <star-icon class="icon"></star-icon>
          77k typescript
        </div>
        <div class="banner-item">
          <span class="span-color"></span>
          typescript
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RepoItemIcon from './icons/repo-item-icon.vue';
import StarIcon from '@/components/icons/star.icon.vue';

export default defineComponent({
  name: 'repository-list-item',
  components: {
    RepoItemIcon,
    StarIcon
  }
});
</script>

<style scoped lang="scss">
.repository-list-item {
  width: 100%;
  padding: 24px 0;
  display: flex;
  border-bottom: 1px solid #d8dee4;

  .repo-icon {
    font-size: 18px;
    margin-right: 5px;
  }

  .content {
    text-align: left;
    flex: 1;

    .title {
      line-height: 25px;
      font-size: 18px;
      color: #0969DC;
      font-weight: 700;
    }

    .description {
      font-size: 14px;
      margin-bottom: 4px;
      line-height: 21px;
    }

    .tag-list {
      display: flex;

      .tag {
        line-height: 22px;
        padding: 0 8px;
        border: 1px solid transparent;
        border-radius: 12px;
        color: #0969DC;
        background: #ddf4ff;
        margin: 0 5px 5px 0;
      }
    }

    .banner {
      display: flex;
      justify-items: center;
      line-height: 1;
      .banner-item {
        margin-right: 5px;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        .span-color {
          display: inline-block;
          vertical-align: bottom;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #2ea44f;
          margin-right: 5px;
        }
        .icon {
          vertical-align: baseline;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
