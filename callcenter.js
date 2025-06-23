export class CallCenter {
  constructor(numAgents, maxQueueSize, updateUI, log) {
    this.queue = new updateUI.CircularQueue(maxQueueSize);
    this.numAgents = numAgents;

    this.updateUI = updateUI.updateUI;
    this.log = log;

    this.totalReceived = 0;
    this.totalServed = 0;
    this.totalRejected = 0;
    this.totalWait = 0;
    this.totalDuration = 0;

    this.running = true;

    this.startAgents();
  }

  async agentWorker(agentId) {
    while (this.running) {
      const call = this.queue.dequeue();
      if (call) {
        const waitTime = (new Date() - call.timeIn) / 1000;

        this.totalWait += waitTime;
        this.totalDuration += call.duration;
        this.totalServed++;

        this.log(`👨‍💼 Agen ${agentId} menerima ${call.number} (tunggu: ${waitTime.toFixed(2)}s, durasi: ${call.duration}s)`);
        this.updateUI();
        await new Promise(r => setTimeout(r, call.duration * 1000));
        this.log(`✅ Agen ${agentId} selesai melayani ${call.number}`);
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  startAgents() {
    for (let i = 0; i < this.numAgents; i++) {
      this.agentWorker(i + 1);
    }
  }

  addCall(number, duration) {
    this.totalReceived++;
    const call = { number, duration, timeIn: new Date() };
    if (this.queue.enqueue(call)) {
      this.log(`📞 Panggilan masuk: ${call.number}`);
      this.updateUI();
    } else {
      this.totalRejected++;
      this.log(`🚫 Antrian penuh! ${call.number} tidak dapat masuk.`);
    }
  }

  statistics() {
    return {
      totalReceived: this.totalReceived,
      totalServed: this.totalServed,
      totalRejected: this.totalRejected,
      totalQueue: this.queue.size(),
      totalWait: this.totalWait,
      totalDuration: this.totalDuration,
    };
  }

  stop() {
    this.running = false;
  }
}
