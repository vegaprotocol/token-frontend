// @ts-ignore
if (!window.promiManager) {
  // @ts-ignore
  window.promiManager = {
    promiEvents: [],
    callbacks: [],
    clearAllListeners() {
      // @ts-ignore
      window.promiManager.callbacks.forEach(({ event, cb }) => {
        document.removeEventListener(event, cb);
      });
      // @ts-ignore
      window.promiManager.promiEvents = [];
    },
  };
}

export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function promiEventFactory(id: string, name: string): any {
  let events: { [event: string]: Array<Function> } = {};
  const fns: { [fn: string]: Function } = {};

  fns.on = (event: string, callback: Function) => {
    const cb = (e: Event) => {
      const ev = e as CustomEvent;
      if (ev.detail.id === id) {
        events[event].forEach((c) => {
          c(ev.detail.data);
        });
      }
    };

    window.addEventListener(`${event}-mock`, cb);
    // @ts-ignore
    window.promiManager.callbacks.push({
      cb,
      event,
    });
    if (events.hasOwnProperty(event)) {
      events[event].push(callback);
    } else {
      events[event] = [callback];
    }

    return fns;
  };

  fns.then = (cb: Function) => {
    cb();
    return fns;
  };

  fns.catch = () => {
    return fns;
  };
  // @ts-ignore
  window.promiManager.promiEvents.push({
    id,
    name,
  });
  fns.off = () => {};
  return { promiEvent: fns as any };
}
