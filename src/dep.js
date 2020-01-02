let cid = 0;

export class Dep {
  constructor() {
    this.subs = [];
    this.id = cid++;
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addSub(this);
    }
  }

  removeSub(watcher) {
    let idx = -1;
    for (let i = 0; i < this.subs.length; ++i) {
      if (this.subs[i] === watcher) {
        idx = i;
        break;
      }
    }
    if (idx !== -1) {
      this.subs.splice(idx, 1);
    }
  }

  notify() {
    for (let i = 0; i < this.subs.length; ++i) {
      this.subs[i].update();
    }
  }
}

const watcherStack = [];

export function pushTarget(watcher) {
  if (Dep.target) {
    watcherStack.push(Dep.target);
  }
  Dep.target = watcher;
}

export function popTarget() {
  Dep.target = null;
  if (watcherStack.length !== 0) {
    Dep.target = watcherStack.pop();
  }
}

Dep.target = null;