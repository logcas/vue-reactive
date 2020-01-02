class VNode {
  constructor(tag, attrs, on, children, isTextNode = false, value = '') {
    this.tag = tag;
    this.attrs = attrs || {};
    this.on = on || {};
    this.children = children || [];
    this.isTextNode = isTextNode;
    this.value = value;
  }
}

export default VNode;