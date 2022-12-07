<template>
  <div class="no-auth-page">
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

    <div class="sticky"><h1>Less bazel, more screen.</h1></div>
    <!--    <div class="banner-bg"></div>-->
  </div>
</template>

<script lang="ts" setup>
import { ArrowRightOutlined } from '@ant-design/icons-vue';
import FirstImage from '@/assets/co-working-space.png';
import { onMounted } from 'vue';

onMounted(() => {
  const h1 = document.querySelector('h1');
  document.addEventListener('scroll', () => {
    const scrolled = document.documentElement.scrollTop / (document.documentElement.scrollHeight -
      document.documentElement.clientHeight);
    console.log(scrolled);
    h1!.style.backgroundPositionX = `${(1 - scrolled) * 100}%`;
  });
});

</script>

<style scoped lang="scss">
$text-primary: #262626;
.no-auth-page {
  box-sizing: border-box;
  width: 100vw;
  height: calc(100vh - 56px);
  overflow-y: auto;

  .banner {
    //background: #5F95FF;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    height: calc(100vh - 56px);
    margin: -80px auto 0;

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

  .banner-bg {
    width: 120%;
    height: 200px;
    background: #2f54eb;
    transform: rotate(-4deg);
  }

  .sticky {
    //position: sticky;
    //top: 0;
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    h1 {
      color: transparent;
      font-size: 5rem;
      font-family: "Helvetica Neue", Helvetica, Arial;
      background-image: linear-gradient(75deg, #fff 0%, #ffffff 33.33%, rgba(255, 255, 255, 0) 66.67%, rgba(255, 255, 255, 0) 100%);
      background-size: 300% 100%;
      background-position-x: 100%;
      background-clip: text;
      -webkit-background-clip: text;
    }

    h1:hover {
      background-position-x: 0;
    }
  }


}
</style>
