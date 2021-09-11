// import {Chi} from '../components/slate-vue-next/components/children';

// @ts-ignore
export const renderLeaf = ({ attributes, children, leaf }) => ({
  render() {
    if (leaf.bold) {
      children = <strong>{ children }</strong>;
    }

    if (leaf.code) {
      children = <code>{ children }</code>;
    }

    if (leaf.italic) {
      children = <em>{ children }</em>;
    }

    if (leaf.underline) {
      children = <u>{ children }</u>;
    }

    // @ts-ignore
    return <span { ...attributes }>{ children }</span>;
  }
});

// @ts-ignore
export const renderElement = ({ attributes, children, element }) => ({
  render() {
    switch (element.type) {
      case 'block-quote':
        // @ts-ignore
        return <blockquote { ...attributes }>{ children }</blockquote>;
      case 'bulleted-list':
        // @ts-ignore
        return <ul { ...attributes }>{ children }</ul>;
      case 'heading-one':
        // @ts-ignore
        return <h1 { ...attributes }>{ children }</h1>;
      case 'heading-two':
        // @ts-ignore
        return <h2 { ...attributes }>{ children }</h2>;
      case 'list-item':
        // @ts-ignore
        return <li { ...attributes }>{ children }</li>;
      case 'numbered-list':
        // @ts-ignore
        return <ol { ...attributes }>{ children }</ol>;
      default:
        // @ts-ignore
        return <p { ...attributes }>{ children }</p>;
    }
  }
});
