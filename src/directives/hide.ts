/**
 * @author songxiwen
 * @date  2021/9/12 17:12
 */

import {
  Directive, nextTick
} from 'vue';

const hideDirective: Directive = {
  mounted(element) {
    element.style.position = 'relative';
    // 添加两个元素
    const divEle = document.createElement('div');
    const text = document.createElement('p');
    // next tick 将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。
    nextTick(() => {
      text.style.lineHeight = `${element.scrollHeight}px`;
    }).then();
    divEle.classList.add('hide');
    text.innerText = 'coming soon ...';
    text.classList.add('hide-text');
    element.appendChild(divEle);
    element.appendChild(text);
  }
};

export default hideDirective;
