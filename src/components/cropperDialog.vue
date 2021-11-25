<template>
  <!--  <ant-modal-->
  <!--    :title="'裁剪图片'"-->
  <!--    v-loading="is_loading"-->
  <!--    v-if="cropperDialogVisible"-->
  <!--    v-model:visible="cropperDialogVisible"-->
  <!--    :show-close="false"-->
  <!--    :close-on-press-escape="false"-->
  <!--    :close-on-click-modal="false"-->
  <!--    width="1100px"-->
  <!--    append-to-body-->
  <!--    class="dialog">-->
  <!--    -->
  <!--  </ant-modal>-->
  <div class="cropper-content">
    <!-- 剪裁框 -->
    <div class="cropper">
      <vueCropper
        class="cropper-div"
        ref="cropper"
        :img="option.img"
        :outputSize="option.size"
        :outputType="option.outputType"
        :info="true"
        :full="option.full"
        :canMove="option.canMove"
        :canMoveBox="option.canMoveBox"
        :original="option.original"
        :autoCrop="option.autoCrop"
        :autoCropWidth="option.autoCropWidth"
        :autoCropHeight="option.autoCropHeight"
        :fixedBox="option.fixedBox"
        @realTime="realTime"
        :fixed="option.fixed"
        :fixedNumber="option.fixedNumber"></vueCropper>
    </div>
    <!-- 预览框 -->
    <div
      class="show-preview"
      :style="{
        'width': '500px',
        'height': '400px',
        'overflow': 'hidden',
        'margin': '0 25px',
        'display':'flex',
        'align-items' : 'center'
				}">
      <div :style="previews.div" class="preview">
        <img :src="previews.url" :style="previews.img">
      </div>
    </div>
  </div>
  <div class="footer-btn">
    <!-- 缩放旋转按钮 -->
    <div class="scope-btn">
      <el-button type="primary" icon="el-icon-zoom-in" @click="changeScale(1)"></el-button>
      <el-button type="primary" icon="el-icon-zoom-out" @click="changeScale(-1)"></el-button>
      <el-button type="primary" @click="rotateLeft">逆时针旋转</el-button>
      <el-button type="primary" @click="rotateRight">顺时针旋转</el-button>
    </div>
    <!-- 确认上传按钮 -->
    <div class="upload-btn">
      <!-- <el-button type="primary" @click="uploadImg('blob')">上传</el-button> -->
      <el-button type="danger" @click="closeCropperDialog">关闭</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="uploadImg('base64')">上传</el-button>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper';
import axios from 'axios';
// import utils from './utils.js';
import { PropType } from 'vue';

const noop = () => {
};
export default {
  components: {
    VueCropper,
  },
  props: {
    // 上传地址
    targetUrl: {
      type: String,
      default: './admin/common/uploadImage'
    },
    // 控制弹窗显示隐藏
    cropperDialogVisible: {
      type: Boolean,
      default: false,
    },
    // 剪裁框比例设置
    fixedNumber: {
      default() {
        return [1.5, 1];
      }
    },
    // 当前上传的图片
    currentFileObject: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 上传时自定义的header
     */
    uploadHeader: {
      type: Object,
      default() {
        return {};
      }
    },
    /**
     * 图片高
     */
    height: {
      type: Number,
      default: 178
    },
    /**
     * 图片宽
     */
    width: {
      type: Number,
      default: 178,
    },
  },
  watch: {
    // currentFileObject: {
    //   handler(val, oldVal) {
    //     if (val.hasOwnProperty('raw')) {
    //       // file to url
    //       this.option.img = this.fileToURL(val.raw);
    //     }
    //   },
    //   deep: true,
    //   immediate: true,
    // }
  },
  data() {
    return {
      previews: {}, // 预览数据
      option: {
        img: '', // 裁剪图片的地址  (默认：空)
        outputSize: 1, // 裁剪生成图片的质量  (默认:1)
        full: true, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
        outputType: 'png', // 裁剪生成图片的格式  (默认:jpg)
        canMove: true, // 上传图片是否可以移动  (默认:true)
        original: true, // 上传图片按照原始比例渲染  (默认:false)

        canMoveBox: true, // 截图框能否拖动  (默认:true)
        autoCrop: true, // 是否默认生成截图框  (默认:false)
        autoCropWidth: this.width, // 默认生成截图框宽度  (默认:80%)
        autoCropHeight: this.height, // 默认生成截图框高度  (默认:80%)

        fixedBox: false, // 固定截图框大小 不允许改变  (默认:false)
        fixed: true, // 是否开启截图框宽高固定比例  (默认:true)
        fixedNumber: this.fixedNumber, // 截图框比例  (默认:[1:1])

        enlarge: 1
      },
      isDisabled: false,
      downImg: '#',
      is_loading: false,
    };
  },
  methods: {
    /**
     * 父组件updated时调用
     */
    fileToURL(file) {
      return URL.createObjectURL(file);
    },
    /**
     * 图片缩放
     */
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    /**
     * 向左旋转
     */
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    /**
     * 向右旋转
     */
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },

    /**
     * 实时预览
     */
    realTime(data) {
      this.previews = data;
    },
    /**
     * 关闭裁剪弹窗
     */
    closeCropperDialog() {
      this.$emit('closeCropperDialog', null);
    },
    /**
     * 点击上传按钮
     */
    async uploadImg(type) {
      // 将剪裁好的图片回传给父组件
      event.preventDefault();
      this.isDisabled = true;
      const that = this;
      if (type === 'blob') {
        await this.$refs.cropper.getCropBlob(async (data) => {
          await this.customUpload(data);
        });
      } else {
        await this.$refs.cropper.getCropData(async (data) => {
          await this.customUpload(data);
        });
      }
    },
    /**
     * 自定义上传函数
     */
    async customUpload(data) {
      const img = new Image();
      img.src = data;
      img.onload = async () => {
        // 压缩图片
        const _data = this.compress(img, this.fixedNumber[1]);
        // data to blob
        const blob = this.dataURItoBlob(_data);
        const formData = new FormData();

        formData.append('file', blob, this.currentFileObject.name); // 有的后台需要传文件名，不然会报错

        await this.uploadImageRequest(formData);
      };
    },
    /**
     * 上传图片接口
     */
    async uploadImageRequest(formData) {

    },

    dataURItoBlob(base64Data) {
      let byteString;
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]);
      } else {
        byteString = unescape(base64Data.split(',')[1]);
      }
      const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      const ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
    // 压缩图片
    compress(img, scale) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 图片原始尺寸
      const originWidth = img.width;
      const originHeight = img.height;
      // 最大尺寸限制
      // var maxHeight = 1000;

      const maxWidth = 750;
      // 目标尺寸
      let targetWidth = originWidth;
      let targetHeight = originHeight;
      // 图片尺寸超过400x400的限制
      // if ( originHeight > maxHeight) {
      //     targetHeight = maxHeight;
      //     targetWidth = maxHeight * scale;
      // }
      console.log('scale', scale);
      if (originWidth > maxWidth) {
        targetWidth = maxWidth;
        targetHeight = maxWidth * scale;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // 铺底色
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      // 进行压缩
      const ndata = canvas.toDataURL('image/jpeg', 0.8);
      return ndata;
    },
  },

};
</script>
<style scoped lang="scss">
.cropper-content {
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
}

.cropper-content .cropper {
  width: 500px;
  height: 400px;
}

.cropper-content .show-preview {
  flex: 1;
  -webkit-flex: 1;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
  margin-left: 40px;
}

.preview {
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #cccccc;
}

.footer-btn {
  margin-top: 30px;
  display: flex;
  display: -webkit-flex;
  justify-content: flex-end;
  -webkit-justify-content: flex-end;
}

.footer-btn .scope-btn {
  width: 370px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
}

.footer-btn .upload-btn {
  flex: 1;
  -webkit-flex: 1;
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  -webkit-justify-content: center;
}

.footer-btn .btn {
  outline: none;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 8px 15px;
  font-size: 12px;
  border-radius: 3px;
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.dialog {
  z-index: 3000 !important;
}
</style>
