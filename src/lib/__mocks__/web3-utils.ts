export class MockPromiEvent {
  events: { [event: string]: Array<Function> } = {};

  on(event: string, callback: Function) {
    if (this.events[event]) {
      this.events[event].push(callback);
    } else {
      this.events[event] = [callback];
    }
    return this;
  }

  trigger(event: string, arg: any) {
    if (this.events[event]) {
      this.events[event].forEach((cb) => {
        cb(arg);
      });
    } else {
      throw new Error(`No event : ${event}`);
    }
  }
}
