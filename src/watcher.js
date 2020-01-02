import {
  pushTarget,
  popTarget
} from './dep';

let cid = 0;

let watcherQueue = [];
let flushing = false;
let waiting = true;

function flushQueueAsync(watcher) {
  if (watcherQueue.indexOf(watcher) !== -1) {
    return;
  }
  if (flushing) {
    let i = 0;
    for (; i < watcherQueue.length; ++i) {
      if (watcherQueue[i].id > watcher.id) {
        break;
      }
    }
    watcherQueue.splice(i, 0, watcher);
  } else {
    watcherQueue.push(watcher);
  }
  if (waiting) {
    waiting = false;
    triggerFlush();
  }
}

function triggerFlush() {
  flushing = true;
  watcherQueue.sort((a, b) => a.id - b.id);
  Promise.resolve().then(() => {
    for (let i = 0; i < watcherQueue.length; ++i) {
      watcherQueue[i].run();
    }
    flushing = false;
    waiting = true;
    watcherQueue = [];
  });
}

export class Watcher {
  constructor(vm, callback, lazy = false) {
    this.id = cid++;
    this.vm = vm;
    vm._watcher = this;
    this.lazy = lazy;
    this.dirty = lazy;
    this.callback = callback;
    this.deps = [];
    this.depsId = new Set();
    this.value = this.lazy ? undefined : this.get();
  }

  get() {
    pushTarget(this);
    let value;
    try {
      value = this.callback.call(this.vm);
    } catch (e) {
      console.error(e);
      console.error(`Watcher running error`);
    }
    popTarget();
    this.dirty = false;
    this.value = value;
    return value;
  }

  addSub(dep) {
    if (!this.depsId.has(dep.id)) {
      this.depsId.add(dep.id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  depend() {
    for(let i = 0;i < this.deps.length; ++i) {
      this.deps[i].depend();
    }
  }

  update() {
    flushQueueAsync(this);
  }

  run() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      this.get();
    }
  }
}