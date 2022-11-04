/**
 * @author wizard.song
 * @date  2022/3/4 16:54
 * @description 新手引导
 */

import introJs, { Step } from 'intro.js';
import { MutationEnum, store } from '@/store';

export const getHomepageStepList = (): Step[] => [{
  title: '知识库列表',
  element: document.querySelector('#step1')!, // id为step1的元素
  intro: '登录后，可以在这里看到您创建的知识库和克隆的知识库',
  position: 'right'
}, {
  title: '创建知识库',
  element: document.querySelector('#step2')!, // id为step1的元素
  intro: '点击创建，跳转至创建知识库页面。',
  position: 'right'
}, {
  title: '搜索知识库',
  element: document.querySelector('#step3')!, // id为step1的元素
  intro: '在此搜索目前拥有的知识库。',
  position: 'right'
}, {
  title: '用户动态',
  element: document.querySelector('#step4')!, // id为step1的元素
  intro: '在此查看用户动态',
  position: 'left'
}];

/**
 * @name: 新手指导
 * @param {String} params 当前页面的path
 * @return {*}
 */
export function guide(params: {
  type: 'homepage' | 'repositorySectionEditor' | 'repositoryGraphEditor' | 'knowledgeEditor'
}): void {
  const { guide } = store.state.global;
  if (guide[params.type] && guide[params.type].status === 'done') {
    return;
  }
  let stepList: Step[] = [];
  if (params.type === 'homepage') {
    stepList = getHomepageStepList();
  }
  const currentStep = guide[params.type].step;
  const introInstance = introJs()
    .setOptions({
      prevLabel: '&larr; 上一步',
      nextLabel: '下一步 &rarr;',
      doneLabel: '我知道了',
      tooltipClass: 'custom-intro-tooltip',
      buttonClass: 'normal-control-button-1',
      showProgress: false,
      scrollToElement: false,
      steps: stepList
    });
  introInstance.onchange((element: HTMLElement) => {
    console.log(element.dataset, introInstance.currentStep());
  });
  introInstance.onafterchange((element: HTMLElement) => {
    console.log(element.dataset, 'after change', introInstance.currentStep());
    store.commit(MutationEnum.SET_GUIDE_STATUS, {
      type: params.type,
      step: introInstance.currentStep(),
      status: 'doing'
    });
  });
  introInstance.onexit(() => {
    console.log('exit', introInstance.currentStep());
    store.commit(MutationEnum.SET_GUIDE_STATUS, {
      type: params.type,
      step: introInstance.currentStep(),
      status: 'done'
    });
  });
  introInstance.oncomplete(() => {
    console.log('complete', introInstance.currentStep());
    store.commit(MutationEnum.SET_GUIDE_STATUS, {
      type: params.type,
      step: introInstance.currentStep(),
      status: 'done'
    });
  });
  console.log(currentStep);
  if (!currentStep) {
    introInstance.start();
  } else {
    introInstance.goToStep(currentStep);
  }
}
