export const loop = function (){};

export const def = function(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false,
    configurable: false,
    value
  });
}

export const isObject = function(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

export const isRealElement = function(el) {
  return el instanceof HTMLElement;
}