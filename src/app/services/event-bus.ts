import { Callback } from '../models';

export default class EventBus {
  private static events: Record<string, Callback[]> = {};

  static subscribe(eventName: string, callback: Callback): void {
    if (!EventBus.events[eventName]) {
      EventBus.events[eventName] = [];
    }
    EventBus.events[eventName].push(callback);
  }

  static publish(eventName: string, ...args: unknown[]): void {
    const callbacks = EventBus.events[eventName];
    if (callbacks) {
      callbacks.forEach((callback) => {
        callback(...args);
      });
    }
  }
}
