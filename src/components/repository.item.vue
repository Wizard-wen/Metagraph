<template>
  <div class="repository-item">
    <ant-avatar class="icon"></ant-avatar>
    <div class="content">
      <div class="title">
        laden666666 starred {{ repository.author.name }}/{{ repository.content.name }} 5 days ago
      </div>
      <div class="box">
        <div class="name" @click="goRepo($event)">
          {{ repository.author.name }}/{{ repository.content.name }}
        </div>
        <div class="des">{{ repository.content.description }}</div>
        <div class="others">
          <div class="tag"> domain</div>
          <div class="star">
            <StarOutlined style="margin-right: 8px"/>
            <span>{{ repository.star }}</span>
          </div>
          <div class="updatedAt">Updated {{ repository.content.updatedAt }}</div>
        </div>
        <ant-button class="star-btn" @click="addStar($event, repository.hasStared)"
                    :type="repository.hasStared ? 'primary': 'default'"
        >{{ repository.hasStared ? 'Stared' : 'Star' }}
        </ant-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StarApiService } from '@/api.service/star.api.service';
import { EntityCompletelyListItemType } from 'edu-graph-constant';
import { defineComponent, toRefs, PropType } from 'vue';
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
    const { repository } = toRefs<{ repository: EntityCompletelyListItemType }>(props);
    const router = useRouter();
    const goRepo = () => {
      router.push({
        name: 'EditableRepository',
        params: {
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
    return {
      goRepo,
      addStar,
    };
  }
});
</script>

<style scoped lang="scss">
.repository-item {
  padding: 16px 0;
  border-bottom: 1px solid #eaecef;
  display: flex;
  width: 1000px;

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
