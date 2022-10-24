<template>
  <node-view-wrapper class="draw">
    <input type="color" v-model="color">
    <input
      type="number"
      min="1"
      max="10"
      v-model="size"
    >
    <button @click="clear">
      clear
    </button>
    <svg viewBox="0 0 500 250" ref="canvas">
      <template v-for="item in node.attrs.lines">
        <path
          v-if="item.id !== id"
          :key="item.id"
          :d="item.path"
          :id="`id-${item.id}`"
          :stroke="item.color"
          :stroke-width="item.size"
        />
      </template>
    </svg>
  </node-view-wrapper>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, ref, toRefs
} from 'vue';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { v4 as uuid } from 'uuid';
import * as d3 from 'd3';

const getRandomElement = (list) => list[Math.floor(Math.random() * list.length)];

export default defineComponent({
  name: 'Paper',

  components: {
    NodeViewWrapper,
  },

  props: nodeViewProps,

  data() {
    return {};
  },

  setup(props) {
    const {
      node,
      updateAttributes
    } = toRefs(props);
    const color = ref(getRandomElement([
      '#A975FF',
      '#FB5151',
      '#FD9170',
      '#FFCB6B',
      '#68CEF8',
      '#80CBC4',
      '#9DEF8F',
    ]));
    const size = ref(Math.ceil(Math.random() * Math.floor(10)));
    const svg = ref(null);
    const path = ref(null);
    const points = ref([]);
    const drawing = ref(false);
    const id = ref(uuid());
    const canvas = ref();

    function onEndDrawing() {
      svg.value.on('mousemove', null);
      svg.value.on('touchmove', null);

      if (!drawing.value) {
        return;
      }

      drawing.value = false;
      svg.value.select(`#id-${id.value}`)
        .remove();
      id.value = uuid();
    }

    function tick() {
      requestAnimationFrame(() => {
        path.value.attr('d', (points) => {
          const path = d3.line()
            .curve(d3.curveBasis)(points);
          const lines = node.value.attrs.lines.filter((item) => item.id !== this.id);
          updateAttributes({
            lines: [
              ...lines,
              {
                id: id.value,
                color: color.value,
                size: size.value,
                path,
              },
            ],
          });
          return path;
        });
      });
    }

    function onMove(event) {
      event.preventDefault();
      points.value.push(d3.pointers(event)[0]);
      tick();
    }

    function onStartDrawing(event) {
      drawing.value() = true;
      points.value() = [];
      path.value() = svg.value()
        .append('path')
        .data([this.points])
        .attr('id', `id-${id.value}`)
        .attr('stroke', color.value)
        .attr('stroke-width', size.value);

      const moveEvent = event.type === 'mousedown'
        ? 'mousemove'
        : 'touchmove';

      svg.value.on(moveEvent, onMove);
    }

    function clear() {
      updateAttributes({
        lines: [],
      });
    }

    onMounted(() => {
      svg.value = d3.select(canvas.value);

      svg.value
        .on('mousedown', onStartDrawing)
        .on('mouseup', onEndDrawing)
        .on('mouseleave', onEndDrawing)
        .on('touchstart', onStartDrawing)
        .on('touchend', onEndDrawing)
        .on('touchleave', onEndDrawing);
    });

    return {
      clear,
      size,
      color
    };
  }
});
</script>

<style lang="scss">
.draw {
  svg {
    background: #f1f3f5;
    cursor: crosshair;
  }

  path {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
