/**
 * @author songxiwen
 * @date  2022/5/15 16:55
 */
import { Graph } from '@antv/x6';

export class FlowchartService {
  constructor(
    private readonly graph: Graph,
    private readonly graphContainer: HTMLElement
  ) {
  }

  bindKey(): void {
    // #region 快捷键与事件
    // copy cut paste
    this.graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        this.graph.copy(cells);
      }
      return false;
    });
    this.graph.bindKey(['meta+x', 'ctrl+x'], () => {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        this.graph.cut(cells);
      }
      return false;
    });
    this.graph.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste({ offset: 32 });
        this.graph.cleanSelection();
        this.graph.select(cells);
      }
      return false;
    });
    // undo redo
    this.graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (this.graph.history.canUndo()) {
        this.graph.history.undo();
      }
      return false;
    });
    this.graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
      if (this.graph.history.canRedo()) {
        this.graph.history.redo();
      }
      return false;
    });
    // select all
    this.graph.bindKey(['meta+a', 'ctrl+a'], () => {
      const nodes = this.graph.getNodes();
      if (nodes) {
        this.graph.select(nodes);
      }
    });
    // delete
    this.graph.bindKey('backspace', () => {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        this.graph.removeCells(cells);
      }
    });
    // zoom
    this.graph.bindKey(['ctrl+1', 'meta+1'], () => {
      const zoom = this.graph.zoom();
      if (zoom < 1.5) {
        this.graph.zoom(0.1);
      }
    });
    this.graph.bindKey(['ctrl+2', 'meta+2'], () => {
      const zoom = this.graph.zoom();
      if (zoom > 0.5) {
        this.graph.zoom(-0.1);
      }
    });
  }

  initEvent(): void {
    console.log('init event');
    // 控制连接桩显示/隐藏
    const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
      for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
      }
    };
    this.graph.on('node:mouseenter', () => {
      console.log('hover');
      const ports = this.graphContainer.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, true);
    });
    this.graph.on('node:mouseleave', () => {
      const ports = this.graphContainer.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGElement>;
      showPorts(ports, false);
    });

    this.graph.on('node:click', (event) => {
      console.log(event);
      console.log(event.node.getAttrs());
      // event.node.setAttrByPath(['text', 'text'], 'aaaa');
    });
  }
}
