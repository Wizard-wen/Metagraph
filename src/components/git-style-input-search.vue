<template>
  <div class="search">
    <label for="search" class="search-label" ref="searchBox"
           :class="{'expand-search-label': isSearchListShow}">
      <div style="display: flex; width: 100%">
        <input id="search" type="text" class="normal-search-input"
               placeholder="search or jump to..."
               :class="{'expand-search-input': isSearchListShow}"
               @focus="show()"
               @keydown.enter="getSearchList($event)"
        >
        <search-icon v-if="!isSearchListShow" style="font-size: 25px;"></search-icon>
      </div>
      <div class="search-list" v-if="isSearchListShow">
        <div class="search-item"
             v-for="(item, index) in searchList"
             :key="index"
             @mouseover="handleMouseover($event, 'over')"
             @mouseout="handleMouseover($event, 'out')"
             :style="{background: inner ? '#0366d6': '#fff', color: inner ? '#fff' : 'black'}">
          <div class="icon" style="display: block">
            <search-icon v-if="!isSearchListShow" style="font-size: 30px;"></search-icon>
          </div>
          <div class="text">{{ item.name }}</div>
          <div class="tag">all</div>
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { RepositoryApiService } from '@/api.service';
import { defineComponent } from 'vue';
import SearchIcon from '@/components/icons/search.icon.vue';

export default defineComponent({
  name: 'edu-header',
  data(): {
    isSearchListShow: boolean,
    searchList: any[],
    inner: boolean
    } {
    return {
      isSearchListShow: false,
      searchList: [],
      inner: false
    };
  },
  computed: {
    searchInputClass(): string {
      return this.isSearchListShow ? 'expand-search-input' : 'normal-search-input';
    }
  },
  components: {
    SearchIcon
  },
  methods: {
    handleInputFocus(event: InputEvent, status: 'blur' | 'focus') {
      console.log(event);
      if (status === 'focus') {
        this.isSearchListShow = true;
      } else {
        this.isSearchListShow = false;
      }
    },
    show() {
      this.isSearchListShow = true;
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
      const result = await RepositoryApiService.getRepositoryList({
        name: input.value,
        pageIndex: 0,
        pageSize: 10
      });
      console.log(result);
      this.searchList = result.data?.list || [];
    },
    handleMouseover(event: MouseEvent, type: 'out' | 'over') {
      if (type === 'out') {
        this.inner = false;
      } else {
        this.inner = true;
      }
    }
  }
});
</script>

<style scoped lang="scss">
.search {
  height: 30px;
  width: 272px;
  //position: relative;

  .search-label {
    display: block;
    box-sizing: content-box;
    //height: 30px;
    width: 272px;
    border: 1px solid #444d56;
    border-radius: 4px;
    transition: width 0.5s, background 0.5s linear, height 0.5s linear;

    .normal-search-input {
      display: block;
      height: 30px;
      width: 100%;
      padding: 0px 12px;
      margin: 0;
      border: 0;
      background: #24292e;
      color: #fff;
      transition: background 0.5s linear, border 0.5s;
    }

    .expand-search-input {
      background: #fff;
      color: #000;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
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
      padding-top: 3px;
    }

    .search-list {
      width: 100%;
      max-height: 300px;
      background: #fff;
      transition: width 0.5s;

      .search-item {
        display: flex;
        justify-content: space-between;
        height: 44px;
        padding: 7px;
        width: 100%;
        line-height: 50px;
        border-bottom: 1px solid #e1e4e8;
        cursor: pointer;

        .icon {
          height: 30px;
          width: 30px;
          //padding: 10px;
        }

        .text {
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
