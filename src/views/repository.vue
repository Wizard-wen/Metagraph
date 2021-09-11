<template>
  <div class="repo">
    <repository-header></repository-header>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RepositoryHeader from './repository/repository.header.vue';

export default defineComponent({
  name: 'repository',
  components: {
    RepositoryHeader
  }
});
</script>

<style scoped lang="scss">
@import "../style/common.scss";

.repo {
  .repo-header {
    padding-top: 16px;
    margin-bottom: 32px;
    background: #fafbfc;

    .title-box {
      display: flex;
      justify-content: space-between;
      padding: 0 32px;
      margin-bottom: 16px;

      .title {
        margin-right: 16px;
        display: flex;
        height: 32px;
        line-height: 32px;
        font-size: 20px;

        .icon {
          margin: 8px;
          height: 16px;
          width: 16px;
          background: #185;
        }

        .name {
          font-weight: 400;

        }
      }

      .control {
        display: flex;

        .btn {
          margin-right: 10px;
          height: 28px;
          display: flex;

          .detail {
            padding: 3px 12px;
            font-size: 12px;
            line-height: 20px;
            font-weight: 500;
            color: $fontColor;
            border: 1px solid #1b1f2326;
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }

          .count {
            padding: 3px 12px;
            font-size: 12px;
            font-weight: 600;
            line-height: 20px;
            background: #fff;
            border: 1px solid #1b1f2326;
            border-left: 0;
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
          }
        }
      }
    }
    .nav-box{
      width: 100%;
      padding: 0 32px;
      .nav {
        display: flex;
        .nav-item {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: $fontColor;
          padding: 8px 16px;
          font-size: 14px;
          line-height: 30px;
          text-align: center;
        }
        .nav-item-active {
          position: relative;
          &:before{
            content: "";
            position: absolute;
            left: 0;
            bottom: 0px;
            height: 1px;
            width: 100%;
            border-bottom: 1px solid #f9826c;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>
