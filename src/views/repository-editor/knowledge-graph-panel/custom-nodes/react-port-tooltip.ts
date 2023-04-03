export function registerPortTooltip(container: HTMLElement, text: string) {
  container.addEventListener('mouseenter', (e: MouseEvent) => {
    const tooltip = document.querySelector('.x6-tooltip') as HTMLElement;
    const content = tooltip?.querySelector('.ant-tooltip-inner') as HTMLElement;
    if (content) {
      content.innerText = text;
      tooltip.style.left = `${e.clientX - content.offsetWidth / 2}px`;
      tooltip.style.top = `${e.clientY - 50}px`;
    }
  });
  container.addEventListener('mouseleave', () => {
    const tooltip = document.querySelector('.x6-tooltip') as HTMLElement;
    tooltip.style.left = '-1000px';
    tooltip.style.top = '-1000px';
  });
};
