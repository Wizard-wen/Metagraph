<template>
  <div class="search" ref="root">
    <label for="search" class="search-label" ref="searchBox"
           :class="{'expand-search-label': isSearchListShow}">
      <div class="search-box">
        <input
          v-model="searchText"
          id="search" type="text"
          placeholder="search or jump to..."
          class="normal-search-input"
          :class="{'expand-search-input': isSearchListShow}"
          @focus="show()"
          @input="handleInput($event)"
          @keydown.enter="getSearchList($event)"
        >
        <search-icon v-if="!isSearchListShow" class="search-icon"></search-icon>
      </div>
      <div class="search-list" v-if="isSearchListShow">
        <div
          class="search-item"
          v-if="searchText"
          :class="{'search-item-active': -1 === currentHoverIndex}"
          @mouseover="handleMouseover($event, -1)">
          <search-icon class="icon"></search-icon>
          <div class="text">{{ searchText }}</div>
          <div class="tag">all</div>
        </div>
        <div
          class="search-item"
          v-for="(item, index) in searchList"
          :key="index"
          :class="{'search-item-active': index === currentHoverIndex}"
          @mouseover="handleMouseover($event, index)">
          <repository-list-icon class="icon"></repository-list-icon>
          <div class="text">{{ item.name }}</div>
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, onUnmounted, ref
} from 'vue';
import { RepositoryApiService } from '@/api-service';
import SearchIcon from '@/components/icons/search.icon.vue';
import RepositoryListIcon from '@/components/icons/repository.list.icon.vue';

export default defineComponent({
  name: 'edu-header',
  data(): {
    inner: boolean
  } {
    return {
      inner: false
    };
  },
  computed: {
    searchInputClass(): string {
      return this.isSearchListShow ? 'expand-search-input' : 'normal-search-input';
    }
  },
  components: {
    SearchIcon,
    RepositoryListIcon
  },
  methods: {
    // handleInputFocus(event: InputEvent, status: 'blur' | 'focus') {
    //   console.log(event);
    //   if (status === 'focus') {
    //     this.isSearchListShow = true;
    //   } else {
    //     this.isSearchListShow = false;
    //   }
    // },
    show() {
      this.isSearchListShow = true;
      const searchHistory = localStorage.getItem('search-history');
      this.searchList = searchHistory && JSON.parse(searchHistory);
      // window.addEventListener('click', this.hidePanel, false);
    },
    hide() {
      // window.removeEventListener('click', this.hidePanel, false);
    },
    // hidePanel(e: Event) {
    //   console.log(e);
    //   if (!(this.$refs.searchBox as Element).contains(e.target as Node)) {
    //     console.log('out');
    //     this.isSearchListShow = false;
    //     this.hide();
    //   }
    // },
    async getSearchList(event: KeyboardEvent) {
      console.log(event);
      const input = event.target as HTMLInputElement;
      this.isSearchListShow = true;
      this.searchList = [];
    }
  },
  setup() {
    const root = ref<HTMLElement | null>(null);
    localStorage.setItem('search-history', JSON.stringify([{ name: 'aaa' }, { name: 'bbbbb' }]));
    const isSearchListShow = ref(false);
    const searchText = ref('');
    const searchList = ref<{ name: string; isUserInput?: boolean }[]>([]);
    const currentHoverIndex = ref<number | undefined>(undefined);

    function documentHandler(e: any): any {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (!root.value?.contains(e.target)) {
        console.log('out input');
        isSearchListShow.value = false;
      }
    }

    onMounted(() => {
      document.addEventListener('click', documentHandler);
    });
    onUnmounted(() => {
      document.removeEventListener('click', documentHandler);
    });

    function handleInput(event: InputEvent) {
      console.log(event);
      const input = event.target as HTMLInputElement;
      searchText.value = input.value;
      currentHoverIndex.value = -1;
    }

    function handleMouseover(event: MouseEvent, type: number) {
      currentHoverIndex.value = type;
    }

    return {
      root,
      isSearchListShow,
      searchText,
      searchList,
      handleInput,
      handleMouseover,
      currentHoverIndex
    };
  }
});
</script>

<style scoped lang="scss">
$border-color: #57606E;

.search {
  height: 100%;
  width: 272px;

  .search-label {
    display: block;
    box-sizing: content-box;
    width: 100%;
    border: 1px solid #444d56;
    border-radius: 4px;
    transition: width 0.5s, background 0.5s linear, height 0.5s linear;

    .search-box {
      display: flex;
      width: 100%;
      align-items: center;

      .normal-search-input {
        display: block;
        height: 30px;
        width: 100%;
        padding: 0px 12px;
        margin: 0;
        border: 0;
        color: #fff;
        transition: background 0.5s linear, border 0.5s;
        border-bottom: 1px solid transparent;

        &::placeholder {
          // todo change placeholder
        }
      }

      .expand-search-input {
        background: #fff;
        color: #000;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: 1px solid #444d56;
      }

      .search-icon {
        font-size: 25px;
      }
    }

    input:-webkit-autofill {
      outline: none;
      box-shadow: 0 0 0px 1000px #130F6E inset !important;
      text-fill-color: white;
      -webkit-text-fill-color: white;
      border: none;
    }

    input:focus {
      outline: none;
    }

    .search-icon {
      //padding-top: 3px;
    }

    .search-list {
      width: 100%;
      max-height: 300px;
      background: #fff;
      transition: width 0.5s;

      .search-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 44px;
        padding: 7px;
        width: 100%;
        line-height: 50px;
        border-bottom: 1px solid #e1e4e8;
        cursor: pointer;

        .icon {
          font-size: 20px;
        }

        .text {
          flex: 1;
          padding-left: 15px;
          height: 30px;
          text-align: left;
          width: 273px;
          line-height: 30px;
        }

        .tag {
          border-radius: 6px;
          padding: 0 4px;
          font-size: 12px;
          height: 29px;
          line-height: 29px;
          width: 100px;
          background: #f6f8fa;
          //border-radius: 3px;
          color: #6a737d;
        }
      }

      .search-item-active {
        background: #0366d6;
        color: #fff;
      }
    }
  }

  .expand-search-label {
    width: 433px;
    max-height: 330px;
    background: #fff;
    //border-radius: 4px;
  }

  //.search-list {
  //  //opacity: 0;
  //  //position: absolute;
  //  //top: 30px;
  //  width: 100%;
  //  height: 300px;
  //  background: #fff;
  //  transition: width 0.5s;
  //}

  //.expand-search-list {
  //  //opacity: 1;
  //  //position: absolute;
  //  //top: -1;
  //  width: 433px;
  //  //height: 300px;
  //  //background: #fff;
  //}

  .fade-enter-active, .fade-leave-active {
    transition: width .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    width: 272px;
    //opacity: 0;
  }

  .fade-enter-to, .fade-leave /* .fade-leave-active below version 2.1.8 */
  {
    width: 433px;
    //opacity: 1;
  }
}
</style>
