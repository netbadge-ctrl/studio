// A simple event emitter for cross-component communication.
type EventCallback = (data: any) => void;

class PartScanner {
  private events: Record<string, EventCallback[]> = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, data: any) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(data));
  }
}

export const partScanner = new PartScanner();
