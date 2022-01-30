/**
 * @author songxiwen
 * @date  2022/1/18 15:43
 */

import { Graph, Tooltip } from '@antv/g6';
import * as AntvG6 from '@antv/g6';
import {
  EntityCompletelyListItemType,
  KnowledgeEdgeModelType, KnowledgeModelType,
  RepositoryModelType
} from 'metagraph-constant';
import { KnowledgeResponseType } from 'metagraph-constant/dist/module/knowledge/knowledge.type';
import { reactive, ref } from 'vue';
import {
  EdgeNoAuthApiService, EntityNoAuthApiService, KnowledgeNoAuthApiService,
  RepositoryApiService,
  RepositoryNoAuthApiService
} from '@/api.service';

export const edges = reactive<{
  list?: KnowledgeEdgeModelType[]
}>({});
export const repositoryList = reactive<{
  list?: EntityCompletelyListItemType[]
}>({});
export const nodes = reactive<{
  list?: {
    id: string;
    // label: string;
    comboId: string
  }[]
}>({});
export const knowledgeList = reactive<{
  target: EntityCompletelyListItemType[]
}>({
  target: []
});
export const combos = reactive<{
  list: { id: string, label: string }[]
}>({
  list: []
});
export const comboIds = ref<string[]>([]);

export const graph = ref<AntvG6.Graph>();
export const tooltip = ref<any>();

export class KnowledgeMap {
  async initGraph(): Promise<void> {
    this.initTooltip();
    const container = document.getElementById('container')!;
    const width = document.body.clientWidth - 260;
    const height = document.body.clientHeight - 55;
    graph.value = new Graph({
      container: 'container',
      width,
      height,
      fitView: true,
      fitViewPadding: 50,
      minZoom: 0.00000001,
      layout: {
        type: 'comboForce',
        nodeSpacing: (d: any) => 8,
      },
      defaultNode: {
        size: 15,
        color: '#5B8FF9',
        style: {
          lineWidth: 2,
          fill: '#C6E5FF',
        },
      },
      defaultEdge: {
        size: 2,
        color: '#e2e2e2',
      },
      modes: {
        default: ['drag-combo', 'drag-node', 'drag-canvas', 'activate-relations'],
      },
      plugins: [tooltip.value],
    });
    await this.initData();
    graph.value.render();
    // this.initNodeMouseEnterEvent();
  }

  initTooltip(): void {
    tooltip.value = new Tooltip({
      offsetX: 10,
      offsetY: 10,
      fixToNode: [1, 0.5],
      // the types of items that allow the tooltip show up
      // 允许出现 tooltip 的 item 类型
      itemTypes: ['node', 'edge'],
      // custom the tooltip's content
      // 自定义 tooltip 内容
      getContent: (e: any) => {
        const outDiv = document.createElement('div');
        outDiv.style.width = 'fit-content';
        outDiv.style.height = 'fit-content';
        const model = e.item.getModel();
        if (e.item.getType() === 'node') {
          outDiv.innerHTML = `名称：${model.name}<br/>关联边数量：${e.item.getEdges().length}`;
        } else {
          const source = e.item.getSource();
          const target = e.item.getTarget();
          outDiv.innerHTML = `来源：${source.getModel().name}<br/>去向：${target.getModel().name}`;
        }
        return outDiv;
      },
    });
  }

  private initNodeMouseEnterEvent() {
    if (!graph.value) {
      return;
    }
    graph.value.on('node:mouseenter', (e: any) => {
      const { item } = e;
      graph.value?.setAutoPaint(false);
      graph.value?.getNodes()
        .forEach((node) => {
          graph.value?.clearItemStates(node);
          graph.value?.setItemState(node, 'dark', true);
        });
      graph.value?.setItemState(item, 'dark', false);
      graph.value?.setItemState(item, 'highlight', true);
      graph.value?.getEdges()
        .forEach((edge) => {
          if (edge.getSource() === item) {
            graph.value?.setItemState(edge.getTarget(), 'dark', false);
            graph.value?.setItemState(edge.getTarget(), 'highlight', true);
            graph.value?.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else if (edge.getTarget() === item) {
            graph.value?.setItemState(edge.getSource(), 'dark', false);
            graph.value?.setItemState(edge.getSource(), 'highlight', true);
            graph.value?.setItemState(edge, 'highlight', true);
            edge.toFront();
          } else {
            graph.value?.setItemState(edge, 'highlight', false);
          }
        });
      graph.value?.paint();
      graph.value?.setAutoPaint(true);
    });
  }

  private async initData(): Promise<void> {
    await Promise.all([
      this.initNodes(),
      this.initCombos()
    ]);
    const edges = await this.initEdge();
    console.log(combos.list);
    graph.value?.data({
      nodes: nodes.list,
      edges,
      combos: combos.list
      // combos: [{
      //   id: '613e2d75ef07650f7deda3cd',
      //   label: '会计科目'
      // }]
    });
  }

  async initEdge(): Promise<{
    // id: string;
    source: string;
    target: string;
    // value: number;
  }[]> {
    await this.getEdges();
    const enabledEdges: {
      // id: string;
      source: string;
      target: string;
      label?: string;
      // value: number;
    }[] = [];
    edges.list?.forEach((item) => {
      const originKnowledge = knowledgeList.target?.find(
        (nodeItem) => nodeItem.entity.id === item.originKnowledgeEntityId
      );
      const targetKnowledge = knowledgeList.target?.find(
        (nodeItem) => nodeItem.entity.id === item.targetKnowledgeEntityId
      );




      if (originKnowledge && targetKnowledge) {
        const edgeItem = enabledEdges.find((innerItem) => innerItem.source === originKnowledge.entity.id
          && innerItem.target === targetKnowledge.entity.id);
        if (edgeItem === undefined) {
          enabledEdges.push({
            // id: item.id,
            // source: item.originKnowledgeEntityId,
            // target: item.targetKnowledgeEntityId,
            source: originKnowledge.entity.id,
            target: targetKnowledge.entity.id,
            // label: item.description || '',
            // value: 100
          });
        }
        // const originKnowledgeContent = originKnowledge.content as KnowledgeModelType;
        // const targetKnowledgeContent = targetKnowledge.content as KnowledgeModelType;
        // if (originKnowledgeContent.repositoryEntityId === targetKnowledgeContent.repositoryEntityId
        //   && originKnowledgeContent.repositoryEntityId === item.edgeRepositoryEntityId) {
        //   const edgeItem = enabledEdges.find((innerItem) => innerItem.source === originKnowledge.entity.id
        //     && innerItem.target === targetKnowledge.entity.id);
        //   if (edgeItem === undefined) {
        //     enabledEdges.push({
        //       // id: item.id,
        //       // source: item.originKnowledgeEntityId,
        //       // target: item.targetKnowledgeEntityId,
        //       source: originKnowledge.entity.id,
        //       target: targetKnowledge.entity.id,
        //       label: item.description || '',
        //       // value: 100
        //     });
        //   }
        // } else {
        //   // enabledEdges.push({
        //   //   // id: item.id,
        //   //   // source: originKnowledgeContent.repositoryEntityId,
        //   //   // target: targetKnowledgeContent.repositoryEntityId,
        //   //   source: originKnowledge.entity.id,
        //   //   target: targetKnowledge.entity.id,
        //   //   label: item.description || '',
        //   //   // value: 100
        //   // });
        // }
      }
    });
    console.log(enabledEdges.length);
    return enabledEdges;
  }

  async initNodes(): Promise<void> {
    await this.getNodes();
  }

  async initCombos(): Promise<void> {
    await this.getRepositoryList();
  }

  async getEdges(): Promise<void> {
    const result = await EdgeNoAuthApiService.getEdgeList();
    if (result.data) {
      edges.list = result.data;
    }
  }

  async getRepositoryList(): Promise<void> {
    const result = await RepositoryNoAuthApiService.getList({
      pageIndex: 0,
      pageSize: 1000
    });
    if (result.data) {
      repositoryList.list = result.data.list;
      combos.list = repositoryList.list.map((item) => ({
        id: item.entity.id,
        label: (item.content as RepositoryModelType).name
      }));
    }
  }

  async getNodes(): Promise<void> {
    const result = await EntityNoAuthApiService.getEntityListByEntityType({
      entityType: 'Knowledge'
    });
    if (result.data) {
      knowledgeList.target = result.data;
      nodes.list = result.data.map((item: EntityCompletelyListItemType) => {
        const content = item.content as KnowledgeModelType;
        const combo = comboIds.value.find((comboItem) => comboItem === content.repositoryEntityId);
        if (combo === undefined) {
          comboIds.value.push(content.repositoryEntityId);
        }
        return {
          id: item.entity.id,
          // label: content.name || '',
          name: content.name,
          properties: content,
          comboId: content.repositoryEntityId
        };
      });
    }
  }
}
