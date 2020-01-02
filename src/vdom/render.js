import VNode from './index';
import {
  extractAttrs,
  extractOn
} from './helper';

let domCached;

function resolveChildren(children) {
  const res = [];
  for(let i = 0;i < children.length; ++i) {
    res.push(render2VNode.call(this, children[i], false));
  }
  return res;
}

export default function render2VNode(root, isRoot = true) {
  if (!root && !domCached) {
    throw new Error('root dom could not found');
  }
  let _root = (isRoot && domCached) || root;
  if (isRoot && _root === root) {
    domCached = root.cloneNode(true);
  }
  const tag = _root.tagName;
  const attrs = _root.nodeType === 1 ? extractAttrs.call(this, _root) : {};
  const on = _root.nodeType === 1 ? extractOn.call(this, _root) : {};
  const children = _root.nodeType === 1 ? resolveChildren.call(this, [..._root.childNodes]) : [];
  const vnode = new VNode(
    tag,
    attrs,
    on,
    children,
    _root.nodeType === 3 ? true : false,
    _root.nodeValue
  );
  return vnode;
}