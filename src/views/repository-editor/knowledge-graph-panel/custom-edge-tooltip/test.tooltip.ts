/**
 * @author songxiwen
 * @date  2022/1/11 14:45
 */
import { EdgeView, Graph, ToolsView } from '@antv/x6';
import { createApp, App, createRenderer } from 'vue';
import TestTooltip from './test-tooltip.vue';

export interface TooltipToolOptions extends ToolsView.ToolItem.Options {
  tooltip?: string
}

export class TooltipTool extends ToolsView.ToolItem<EdgeView, TooltipToolOptions> {
  private knob!: HTMLDivElement;

  app!: App;

  render() {
    if (!this.knob) {
      this.knob = ToolsView.createElement('div', false) as HTMLDivElement;
      this.knob.style.position = 'absolute';
      this.container.appendChild(this.knob);
      console.log(this.container);
    }
    return this;
  }

  private toggleTooltip(visible: boolean) {
    if (this.app) {
      this.app.unmount();
    }
    // ReactDom.unmountComponentAtNode(this.knob)
    // if (visible) {
    //   ReactDom.render(
    //     <Tooltip
    //       title={this.options.tooltip}
    //       visible={true}
    //       destroyTooltipOnHide
    //     >
    //   <div />
    //   </Tooltip>,
    //   this.knob,
    // )
    // }
    if (visible) {
      console.log('visible');
      this.app = createApp(TestTooltip, {
        content: this.options.tooltip
      });
      this.app.mount(this.knob);
      console.log(this.app);
    }
  }

  private onMouseEnter({ e }: { e: MouseEvent }) {
    console.log('show tooltip', e);
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
    const { style } = this.knob;
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
  isSVGElement: false,
});

Graph.registerEdgeTool('tooltip', TooltipTool, true);
