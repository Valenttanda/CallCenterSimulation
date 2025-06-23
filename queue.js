export class Call {
  constructor(number, duration) {
    this.number = number;
    this.duration = duration;
    this.timeIn = new Date();
  }
  toString() {
    return `${this.number} (${this.duration}s)`;
  }
}

export class CircularQueue {
  constructor(maxSize) {
    this.queue = new Array(maxSize);
    this.maxSize = maxSize;
    this.front = -1;
    this.rear = -1;
  }

  isEmpty() {
    return this.front === -1;
  }

  isFull() {
    return (this.rear + 1) % this.maxSize === this.front;
  }

  enqueue(item) {
    if (this.isFull()) return false;
    if (this.isEmpty()) {
      this.front = this.rear = 0;
    } else {
      this.rear = (this.rear + 1) % this.maxSize;
    }
    this.queue[this.rear] = item;
    return true;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const item = this.queue[this.front];
    if (this.front === this.rear) {
      this.front = this.rear = -1;
    } else {
      this.front = (this.front + 1) % this.maxSize;
    }
    return item;
  }

  getItems() {
    const items = [];
    if (this.isEmpty()) return items;
    let i = this.front;
    while (true) {
      items.push(this.queue[i]);
      if (i === this.rear) break;
      i = (i + 1) % this.maxSize;
    }
    return items;
  }

  size() {
    return this.getItems().length;
  }
}