import { EdgeView, Graph, ToolsView } from '@antv/x6';
import { createApp, h, ref } from 'vue';
import TooltipNode from './tooltip-node.vue';

const app = ref();

export interface TooltipToolOptions extends ToolsView.ToolItem.Options {
  tooltip?: string;
}

// tooltip
class TooltipTool extends ToolsView.ToolItem<EdgeView, TooltipToolOptions> {
  private knob?: HTMLDivElement;

  render() {
    if (!this.knob) {
      this.knob = ToolsView.createElement('div', false) as HTMLDivElement;
      this.knob.style.position = 'absolute';
      this.container.appendChild(this.knob);
    }
    return this;
  }

  private toggleTooltip(visible: boolean) {
    const { tooltip } = this.options; // 接收使用时传入的内容
    app.value && app.value.unmount(this.knob);
    if (visible) {
      app.value = createApp({
        setup() {
          return () => h(TooltipNode, {
            visible,
            content: tooltip,
          });
        },
      });
      app.value.mount(this.knob);
    }
    console.log(app);
  }

  private onMouseEnter({ e }: { e: MouseEvent }) {
    console.log('enter =======');
    this.updatePosition(e);
    this.toggleTooltip(true);
  }

  private onMouseLeave() {
    this.updatePosition();
    this.toggleTooltip(false);
  }

  private onMouseMove() {
    this.updatePosition();
    this.toggleTooltip(false);
  }

  delegateEvents() {
    this.cellView.on('cell:mouseenter', this.onMouseEnter, this);
    this.cellView.on('cell:mouseleave', this.onMouseLeave, this);
    this.cellView.on('cell:mousemove', this.onMouseMove, this);
    return super.delegateEvents();
  }

  private updatePosition(e?: MouseEvent) {
    const style = this.knob?.style;
    if (!style) {
      return;
    }
    if (e) {
      const p = this.graph.clientToGraph(e.clientX, e.clientY);
      style.display = 'block';
      style.left = `${p.x}px`;
      style.top = `${p.y}px`;
    } else {
      style.display = 'none';
      style.left = '-1000px';
      style.top = '-1000px';
    }
  }

  protected onRemove() {
    this.cellView.off('cell:mouseenter', this.onMouseEnter, this);
    this.cellView.off('cell:mouseleave', this.onMouseLeave, this);
    this.cellView.off('cell:mousemove', this.onMouseMove, this);
  }
}

TooltipTool.config({
  tagName: 'div',
  isSVGElement: false
});

// 线
Graph.registerEdgeTool('tooltip', TooltipTool, true);
// 节点
Graph.registerNodeTool('tooltip', TooltipTool, true);
