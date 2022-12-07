<template>
  <div class="page-container">
    <metagraph-header></metagraph-header>
    <div class="banner">
      <div class="left">
        <div class="title-content">
          <h1 class="title">Metagraph</h1>
          <div class="sub-title">让不同知识背景的人站在同一起跑线</div>
          <div class="desc">
            Metagraph是一个内容创作分享平台。
            不同于以往的内容创作平台，Metagraph提供了强大的内容关联能力。
            你可以在Metagraph中构建自己的知识库，创作你的内容。
          </div>
        </div>
        <div class="control">
          <div class="button">
            <span>免费试用</span>
            <ArrowRightOutlined class="btn"/>
          </div>
        </div>
      </div>
      <div class="right">
        <img width="500" :src="FirstImage" alt="">
      </div>
    </div>
    <div class="page-1">
      <div class="desc-content">

      </div>
      <Transition name="page1">
        <div v-if="isPage1Show" class="image-content">
          <img width="500" :src="FirstImage" alt="">
        </div>
      </Transition>

    </div>
    <div ref="sticky" class="sticky">
      <div class="box-content">
        <Transition name="fade1">
          <div v-if="isShow" class="box"></div>
        </Transition>
        <Transition name="fade2">
          <div v-if="isShow" class="box"></div>
        </Transition>
        <Transition name="fade3">
          <div v-if="isShow" class="box"></div>
        </Transition>
        <Transition name="fade4">
          <div v-if="isShow" class="box"></div>
        </Transition>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import MetagraphHeader from './main/metagraph-header.vue';
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import FirstImage from '@/assets/co-working-space.png';
import { onMounted, onUnmounted, ref } from 'vue';

const sticky = ref<HTMLElement>();
const isShow = ref(false);
const isPage1Show = ref(false);
const height = ref();

function handleScroll() {
  console.log(document.documentElement.scrollTop, height.value, '----------');
  if (document.documentElement.scrollTop > (height.value + 400)) {
    isShow.value = true;
  }
  if (document.documentElement.scrollTop < (height.value + 400)) {
    isShow.value = false;
  }

  if (document.documentElement.scrollTop > 400) {
    isPage1Show.value = true;
  }
  if (document.documentElement.scrollTop < 400) {
    isPage1Show.value = false;
  }
}

onMounted(() => {
  document.documentElement.scrollTop = 0;
  isShow.value = false;
  height.value = document.body.clientHeight;
  document.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  document.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
$text-primary: #262626;
.page-container {
  //background: #000;
  overflow-y: auto;
  min-height: 100vh;
}

.banner {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  height: calc(100vh - 56px);
  margin: 0 auto;

  .left {
    min-height: 500px;
    padding-top: 80px;
    text-align: left;
    width: 40%;

    .title-content {
      width: 100%;

      .title {
        height: 72px;
        font-size: 60px;
        line-height: 72px;
        font-weight: 500;
        margin-bottom: 12px;
      }

      .sub-title {
        font-size: 24px;
        line-height: 1.5;
        color: $text-primary;
        margin-bottom: 48px;
      }

      .desc {
        font-size: 18px;
        color: #666;
        line-height: 28px;
      }
    }

    .control {
      margin: 60px auto 0 auto;

      .button {
        display: flex;
        align-items: center;
        width: 200px;
        height: 48px;
        padding-left: 58px;
        border: 1px solid #ccc;
        border-radius: 30px;
        cursor: pointer;
        font-size: 18px;
        line-height: 40px;
        text-align: left;
        will-change: transform;
        transition: transform .32s ease, box-shadow .32s ease;

        &:hover {
          //box-shadow: 0 10px 10px rgba(39, 78, 188, 0.8);
          transform: translateY(-3px);
        }
      }
    }

    @keyframes btnArrowEffect {
      0% {
        transform: translate(0);
      }
      20% {
        transform: translate(4px);
      }
      40% {
        transform: translate(-2px);
      }
      60% {
        transform: translate(4px);
      }
      80% {
        transform: translate(-2px);
      }
      100% {
        transform: translate(0px);
      }
    }

    .btn {
      font-size: 20px;
      margin-left: 16px;
      animation: btnArrowEffect 3s both infinite;
    }
  }

  .right {
    //padding-top: 60px;
    flex: 1;
    display: flex;
    //align-items: center;
    justify-content: flex-end;
  }

}

.page-1 {
  height: 100vh;
  width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .desc-content {
    width: 50%;
    height: 600px;
  }
  .image-content {
    width: 50%;
    height: 600px;
  }
  //background-image: url("../assets/login-bg.webp");
  //background-repeat: no-repeat;
  //background-size: 100% 100%;
  //background-attachment: fixed;
}

/* 下面我们会解释这些 class 是做什么的 */
.page1-enter-active,
.page1-leave-active {
  transition: opacity 1s ease, transform 1s ease;
}

.page1-enter-from {
  transform: translateX(116px);
}

.page1-leave-to {
  opacity: 0;
  transform: translateX(0);
}

.sticky {
  position: sticky;
  top: 0;
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;

  .box-content {
    height: 200px;
    width: 800px;
    display: flex;
    justify-content: space-between;

    .box {
      height: 160px;
      width: 160px;
      background: #5F95FF;
      border-radius: 50%;
    }
  }



  /* 下面我们会解释这些 class 是做什么的 */
  .fade1-enter-active,
  .fade1-leave-active {
    transition: opacity 1s ease, transform 1s ease;
  }

  .fade1-enter-from {
    transform: translateY(16px);
  }

  .fade1-leave-to {
    opacity: 0;
    transform: translateY(0);
  }


  .fade2-enter-active,
  .fade2-leave-active {
    transition: opacity 1s ease, transform 1s ease;
  }

  .fade2-enter-from {
    transform: translateY(32px);
  }

  .fade2-leave-to {
    opacity: 0;
    transform: translateY(0);
  }

  .fade3-enter-active,
  .fade3-leave-active {
    transition: opacity 1s ease, transform 1s ease;
  }

  .fade3-enter-from {
    transform: translateY(48px);
  }

  .fade3-leave-to {
    opacity: 0;
    transform: translateY(0);
  }

  .fade4-enter-active,
  .fade4-leave-active {
    transition: opacity 1s ease, transform 1s ease;
  }

  .fade4-enter-from {
    transform: translateY(64px);
  }

  .fade4-leave-to {
    opacity: 0;
    transform: translateY(0);
  }

  @keyframes test {
    from {
      transform: translateY(12px);
    }

    to {
      transform: translateY(0);
    }
  }


}


.banner-bg {
  width: 120%;
  height: 200px;
  background: #2f54eb;
  transform: rotate(-4deg);
}
</style>
