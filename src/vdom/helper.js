export const extractAttrs = function (el) {
  const attrs = {};
  const _attrs = [...el.attributes].filter(attr => /^v-/.test(attr.name) && !/^v-on/.test(attr.name));
  for (let i = 0; i < _attrs.length; ++i) {
    const name = _attrs[i].name;
    const value = _attrs[i].value;
    attrs[name] = this[value];
  }
  return attrs;
}

export const extractOn = function (el) {
  const on = {};
  const _on = [...el.attributes].filter(attr => /^v-on/.test(attr.name));
  for (let i = 0; i < _on.length; ++i) {
    const name = _on[i].name;
    const value = _on[i].value;
    on[name] = this[value];
  }
  return on;
}