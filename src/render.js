import { isRealElement } from './helpers';
import render2VNode from './vdom/render';

export function render(rootDom) {
  if (!isRealElement(rootDom)) {
    const el = document.createElement('div');
    document.appendChild(el);
    return el;
  }
  // const vnode = render2VNode.call(this, rootDom);
  // console.log(vnode);
  let children = rootDom.children;
  resolveChildren.call(this, children);
}

function resolveChildren(children) {
  let vm = this;
  for(let i = 0;i < children.length; ++i) {
    const elm = children[i];
    if (elm.nodeType !== 1) {
      continue;
    }
    const attrs = [...elm.attributes].filter(attr => /^v-/.test(attr.name));
    for(let i = 0;i < attrs.length; ++i) {
      // v-html
      if (/v-html/.test(attrs[i].name)) {
        resolveVHtml(elm, vm, attrs[i].value);
      }
      // v-text
      if (/v-text/.test(attrs[i].name)) {
        resolveVText(elm, vm, attrs[i].value);
      }
      // v-if
      if (/v-if/.test(attrs[i].name)) {
        resolveVIf(elm, vm, attrs[i].value);
      }
      // v-on
      if (/^v-on/.test(attrs[i].name)) {
        resolveVOn(elm, vm, attrs[i].name.split(':')[1], attrs[i].value);
      }
      // v-model
      if (/^v-model/.test(attrs[i].name)) {
        resolveVModel(elm, vm, attrs[i].value);
      }
    }
    resolveChildren.call(vm, elm.children);
  }
}

function resolveVHtml(el, vm, key) {
  el.innerHTML = vm[key];
}

function resolveVText(el, vm, key) {
  el.innerText = vm[key];
}

function resolveVIf(el, vm, key) {
  const visible = vm[key];
  if(!visible) {
    el.style.display = 'none';
  }
}

function resolveVOn(el, vm, event, handler) {
  el.addEventListener(event, vm[handler]);
}

function resolveVModel(el, vm, key) {
  el.value = vm[key];
  el.addEventListener('input', e => {
    vm[key] = e.target.value;
  });
}