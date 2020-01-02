import { render } from './render';
import { observe } from './observer';
import { Watcher } from './watcher';
import { loop } from './helpers';
import { Dep } from './dep';

export function Vueact(options) {
  this._init(options);
}

Vueact.prototype._render = render;

Vueact.prototype.initData = function() {
  let vm = this;
  let data = this.$options.data;
  data = typeof data === 'function' ? data() : (data || {});
  const keys = Object.keys(data);
  for(let i = 0;i < keys.length; ++i) {
    const key = keys[i];
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        return data[key];
      },
      set: function(newVal) {
        data[key] = newVal;
      }
    });
  }
  observe(data);
};

Vueact.prototype.initComputed = function() {
  let vm = this;
  this.$options.computed || (this.$options.computed = {});
  const computed = this.$options.computed;
  const keys = Object.keys(computed);
  for(let i = 0;i < keys.length; ++i) {
    const key = keys[i];
    const _watcher = new Watcher(vm, computed[key], true);
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        if (_watcher.dirty) {
          _watcher.get();
        }
        if (Dep.target) {
          _watcher.depend();
        }
        return _watcher.value;
      },
      set: loop
    });
  }
}

Vueact.prototype.initMethods = function() {
  let vm = this;
  let methods = this.$options.methods || {};
  const keys = Object.keys(methods);
  for(let i = 0;i < keys.length; ++i) {
    const key = keys[i];
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        return methods[key].bind(vm);
      },
      set: function(newVal) {
        methods[key] = newVal.bind(vm);
      }
    });
  }
}

Vueact.prototype._init = function(options) {
  this.$options = options;
  this.el = getDom(this.$options.el);
  this.initData();
  this.initComputed();
  this.initMethods();
  const updateView = () => {
    render.call(this, this.el);
  };
  new Watcher(this, updateView);
}

function getDom(el) {
  if (typeof el === 'string') {
    return document.querySelector(el);
  }
  return el;
}