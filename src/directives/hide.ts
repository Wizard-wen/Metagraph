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
