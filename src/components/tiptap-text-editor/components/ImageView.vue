<template>
  <node-view-wrapper as="span" :class="imageViewClass">
    <div
      :class="{
        'image-view__body--focused': selected,
        'image-view__body--resizing': resizing,
      }"
      class="image-view__body"
    >
      <img
        :src="src"
        :title="node.attrs.title"
        :alt="node.attrs.alt"
        :width="width"
        :height="height"
        class="image-view__body__image"
        @click="selectImage"
      />

      <div
        v-if="editor.isEditable"
        v-show="selected || resizing"
        class="image-resizer"
      >
        <span
          v-for="direction in resizeDirections"
          :key="direction"
          :class="`image-resizer__handler--${direction}`"
          class="image-resizer__handler"
          @mousedown="onMouseDown($event, direction)"
        />
      </div>

      <!-- when image is break text or float
      bubble menu's position is miscalculated
      use el-popover instead bubble menu -->
      <a-popover
        v-model:visible="selected"
        :show-arrow="false"
        placement="top"
        popper-class="el-tiptap-image-popper"
      >
        <image-bubble-menu
          :node="node"
          :editor="editor"
          :update-attrs="updateAttributes"
        />

        <template #reference>
          <div class="image-view__body__placeholder"/>
        </template>
      </a-popover>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts" setup>
import { computed, defineProps, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';
import { ResizeObserver } from '@juggle/resize-observer';
import { ImageDisplay, resolveImg } from '../utils/image';
import { clamp } from '../utils/shared';
import ImageBubbleMenu from './ImageBubbleMenu.vue';
import { Popover as APopover } from 'ant-design-vue';


const enum ResizeDirection {
  TOP_LEFT = 'tl',
  TOP_RIGHT = 'tr',
  BOTTOM_LEFT = 'bl',
  BOTTOM_RIGHT = 'br',
}

const MIN_SIZE = 20;
const MAX_SIZE = 100000;
const props = defineProps(nodeViewProps);
const maxSize = ref({
  width: MAX_SIZE,
  height: MAX_SIZE,
});

const originalSize = ref({
  width: 0,
  height: 0,
});
const resizeOb = ref<ResizeObserver>();
const resizeDirections = ref([
  ResizeDirection.TOP_LEFT,
  ResizeDirection.TOP_RIGHT,
  ResizeDirection.BOTTOM_LEFT,
  ResizeDirection.BOTTOM_RIGHT,
]);

const resizing = ref(false);

const resizerState = ref({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  dir: '',
});

const selected = computed(() => props.selected);

function updateAttributes(params: Record<string, any>) {
  props.updateAttributes(params);
}

const editor = computed(() => props.editor);
const node = computed(() => props.node);

const src = computed<string>(() => props.node.attrs.src);

const width = computed<number>(() => props.node.attrs.width);

const height = computed<number>(() => props.node.attrs.height);

const display = computed<ImageDisplay>(() => props.node.attrs.display);

const imageViewClass = computed(() => ['image-view', `image-view--${display.value}`]);

// https://github.com/scrumpy/tiptap/issues/361#issuecomment-540299541
function selectImage() {
  props.editor?.commands.setNodeSelection(props.getPos());
}

/* invoked when window or editor resize */
function getMaxSize() {
  const { width } = getComputedStyle(props.editor.view.dom);
  maxSize.value.width = parseInt(width, 10);
}

/* on resizer handler mousedown
 * record the position where the event is triggered and resize direction
 * calculate the initial width and height of the image
 */
function onMouseDown(e: MouseEvent, dir: ResizeDirection): void {
  e.preventDefault();
  e.stopPropagation();

  resizerState.value.x = e.clientX;
  resizerState.value.y = e.clientY;

  const originalWidth = originalSize.value.width;
  const originalHeight = originalSize.value.height;
  const aspectRatio = originalWidth / originalHeight;

  let { width, height } = props.node!.attrs;
  const maxWidth = maxSize.value.width;

  if (width && !height) {
    width = width > maxWidth ? maxWidth : width;
    height = Math.round(width / aspectRatio);
  } else if (height && !width) {
    width = Math.round(height * aspectRatio);
    width = width > maxWidth ? maxWidth : width;
  } else if (!width && !height) {
    width = originalWidth > maxWidth ? maxWidth : originalWidth;
    height = Math.round(width / aspectRatio);
  } else {
    width = width > maxWidth ? maxWidth : width;
  }

  resizerState.value.w = width;
  resizerState.value.h = height;
  resizerState.value.dir = dir;

  resizing.value = true;

  onEvents();
}

function onMouseMove(e: MouseEvent): void {
  e.preventDefault();
  e.stopPropagation();
  if (!resizing.value) return;

  const { x, y, w, h, dir } = resizerState.value;

  const dx = (e.clientX - x) * (/l/.test(dir) ? -1 : 1);
  const dy = (e.clientY - y) * (/t/.test(dir) ? -1 : 1);

  props.updateAttributes?.({
    width: clamp(w + dx, MIN_SIZE, maxSize.value.width),
    height: Math.max(h + dy, MIN_SIZE),
  });
}

function offEvents(): void {
  document.removeEventListener('mousemove', onMouseMove, true);
  document.removeEventListener('mouseup', onMouseUp, true);
}

function onMouseUp(e: MouseEvent): void {
  e.preventDefault();
  e.stopPropagation();
  if (!resizing.value) return;

  resizing.value = false;

  resizerState.value = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dir: '',
  };

  offEvents();
  selectImage();
}

function onEvents(): void {
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('mouseup', onMouseUp, true);
}


onMounted(() => {
  // resizeOb.value = new ResizeObserver(() => {
  //   getMaxSize();
  // });
  // debugger
  // resizeOb.value.observe(props.editor.view.dom);
});

watchEffect(async () => {
  const result = await resolveImg(src.value);

  if (!result.complete) {
    result.width = MIN_SIZE;
    result.height = MIN_SIZE;
  }

  originalSize.value = {
    width: result.width,
    height: result.height,
  };
});

onBeforeUnmount(() => {
  // resizeOb.value?.disconnect();
});

</script>
