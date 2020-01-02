import {
  def,
  isObject
} from './helpers';
import { Dep } from './dep';

export function observe(value) {
  if (!isObject(value)) {
    return;
  }
  let ob;
  if ((ob = value['__ob__'])) {
    return ob;
  }
  ob = new Observer(value);
  return ob;
}

export class Observer {
  constructor(value) {
    this.value = value;
    def(value, '__ob__', this);
    this.walk(value);
  }

  walk(value) {
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; ++i) {
      defineReactive(value, keys[i]);
    }
  }
}

function defineReactive(obj, key) {
  let val = obj[key];
  let childOb = observe(val);
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      if (Dep.target) {
        dep.depend();
      }
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (val === newVal || (val !== val && newVal !== newVal)) {
        return;
      }
      val = newVal;
      childOb = observe(val);
      dep.notify();
    }
  });
}