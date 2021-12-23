<template>
  <div class="knowledge-card">
    <div class="cover-image">
      <img src="" alt="">
    </div>
    <div class="basic">
      <link-icon class="link-icon"></link-icon>
      <div class="title">库存现金</div>
      <div class="domain">管理学</div>
    </div>
    <div class="content">
      维基百科是维基媒体基金会运营的一个多语言的网络百科全书，并以创建和维护作为开放式协同合作项目，特点是自由内容、自由编辑、自由著作权。
      目前是全球网络上最大且最受大众欢迎的参考工具书，名列全球二十大最受欢迎的网站，其在搜索引擎中排名亦较为靠前。
      维基百科目前由非营利组织维基媒体基金会负责营运。
    </div>
    <div class="detail">
      <div class="detail-item">
        <label class="label-name">名称：  </label>维基百科目前由非营利组织维基媒体基金会负责营运。其在搜索引擎中排名亦较为靠前。
      </div>
      <div class="detail-item">
        <label class="label-name">名称：  </label>维基百科目前由非营利组织维基媒体基金会负责营运。其在搜索引擎中排名亦较为靠前。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LinkIcon } from '@/components/icons';
// import { knowledge } from './model/knowledge.edit';

</script>

<style scoped lang="scss">
@import '../../style/common.scss';

.knowledge-card {
  border-radius: 8px;
  border: 1px solid #dfe1e5;
  width: 400px;
  text-align: left;

  .cover-image {
    height: 188px;
    width: 100%;
    background: #f5f5f5;
  }

  .basic {
    position: relative;
    height: 90px;
    padding: 12px 15px;
    border-bottom: 1px solid #ccc;

    .link-icon {
      position: absolute;
      right: 15px;
      top: 15px;
      font-size: 20px;
      cursor: pointer;
    }

    .title {
      height: 35px;
      line-height: 35px;
      font-size: 30px;
    }

    .domain {
      height: 25px;
      line-height: 25px;
      font-size: 14px;
    }
  }

  .content {
    padding: 15px;
  }

  .detail {
    padding: 0 15px;

    .detail-item {
      margin-bottom: 5px;

      .label-name {
        color: #202214;
        font-weight: bolder;
      }
    }
  }
}
</style>
