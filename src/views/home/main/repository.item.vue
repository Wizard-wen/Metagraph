<template>
  <div class="repository-item">
    <ant-avatar class="icon" :src="repository.author.avatar"></ant-avatar>
    <div class="content">
      <div class="title">
        {{ repository.author.name }}
      </div>
      <div class="box">
        <div class="name" @click="goRepositoryPage($event)">
          {{ repository.content.name }}
        </div>
        <div class="des">{{ repository.content.description }}</div>
        <div class="others">
          <div class="tag"> domain</div>
          <div class="star">
            <StarOutlined style="margin-right: 8px"/>
            <span>{{ repository.star }}</span>
          </div>
          <div class="updatedAt">更新于 {{ date }}</div>
        </div>
        <ant-button
          v-if="hasToken"
          class="star-btn"
          @click="addStar($event, repository.hasStared)"
          :type="repository.hasStared ? 'primary': 'default'"
        >{{ repository.hasStared ? 'Stared' : 'Star' }}
        </ant-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StarApiService } from '@/api.service/star.api.service';
import { CommonUtil } from "@/utils/common.util";
import { EntityCompletelyListItemType } from 'edu-graph-constant';
import {
  defineComponent, toRefs, PropType, ref, onMounted, computed
} from 'vue';
import { useRouter } from 'vue-router';
import { StarOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'repository-item',
  components: {
    StarOutlined
  },
  props: {
    repository: {
      type: Object as PropType<EntityCompletelyListItemType>,
      required: true
    }
  },
  setup(props, context) {
    const { repository } = toRefs<{ repository: any }>(props);
    const date = computed(() => CommonUtil.formatDate(
      new Date(repository.value.content.updatedAt),
      'yyyy-MM-dd hh:mm:ss'
    ));
    const router = useRouter();
    const hasToken = ref(false);
    const goRepositoryPage = () => {
      router.push({
        name: 'EditableRepository',
        query: {
          repositoryEntityId: repository.value.entity.id
        }
      });
    };
    const addStar = async (event: MouseEvent, status: boolean) => {
      event.stopPropagation();
      if (status) {
        await StarApiService.cancel({
          entityId: repository.value.entity.id,
          entityType: 'Repository'
        });
      } else {
        await StarApiService.create({
          entityId: repository.value.entity.id,
          entityType: 'Repository'
        });
      }
    };
    onMounted(() => {
      const user = localStorage.getItem('user');
      if (user) {
        hasToken.value = true;
      }
    });
    return {
      goRepositoryPage,
      addStar,
      hasToken,
      date
    };
  }
});
</script>

<style scoped lang="scss">
.repository-item {
  padding: 16px 0;
  border-bottom: 1px solid #eaecef;
  display: flex;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;

  .icon {
    margin-right: 15px;
  }

  .content {
    width: 100%;

    .title {
      height: 32px;
      line-height: 32px;
      text-align: left;
    }

    .box {
      position: relative;
      text-align: left;
      margin-top: 8px;
      border-radius: 6px;
      border: 1px solid #e1e4e8;
      background: #fff;
      padding: 16px;

      .name {
        cursor: pointer;
        font-weight: 600;
        font-size: 16px;
      }

      .des {
        margin-top: 4px;
      }

      .others {
        margin-top: 8px;
        display: flex;

        .tag {
          margin-right: 16px;
        }

        .star {
          margin-right: 16px;
        }

        .updatedAt {
          margin-right: 16px;
        }
      }

      .star-btn {
        position: absolute;
        padding: 3px 12px;
        font-size: 12px;
        line-height: 20px;
        top: 16px;
        right: 16px;
        border: 1px solid #1b1f2326;
        border-radius: 6px;
        cursor: pointer;
        //color: var(--color-btn-string);
        //background-color: var(--color-btn-bg);
        //border-color: var(--color-btn-border);
        //box-shadow: var(--color-btn-shadow),var(--color-btn-inset-shadow);
        //transition: .2s cubic-bezier(.3,0,.5,1);
        //transition-property: color,background-color,border-color;
      }
    }
  }
}
</style>
