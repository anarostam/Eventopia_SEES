export class EventPromoter {
    constructor() {
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
      }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter((obs) => obs !== listener);
    }
    
    notify(eventData) {
        this.listeners.forEach((listener) => listener.update(eventData));
    }
}