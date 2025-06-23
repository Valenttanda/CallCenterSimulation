import { CircularQueue, Call } from './queue.js';
import { CallCenter } from './callcenter.js';

let callCenter;

const agentInput = document.getElementById('agentCount');
const queueInput = document.getElementById('maxQueue');
const startBtn = document.getElementById('startBtn');

const numberInput = document.getElementById('numberInput');
const durationInput = document.getElementById('durationInput');
const sendCallBtn = document.getElementById('sendCallBtn');

const queueList = document.getElementById('queueList');
const logArea = document.getElementById('logArea');

const statBtn = document.getElementById('statBtn');
const stopBtn = document.getElementById('stopBtn');

function updateUI() {
  queueList.innerHTML = '';
  if (callCenter) {
    callCenter.queue.getItems().forEach(call => {
      const li = document.createElement('li');
      li.textContent = `${call.number} (${call.duration}s)`;
      queueList.appendChild(li);
    });
  }
}

function appendLog(msg) {
  logArea.innerHTML += msg + '<br>';
  logArea.scrollTop = logArea.scrollHeight;
}

startBtn.addEventListener('click', () => {
  const numAgents = parseInt(agentInput.value);
  const maxSize = parseInt(queueInput.value);

  if (!numAgents || !maxSize || numAgents <= 0 || maxSize <= 0) {
    alert('❗ Jumlah agen dan maks antrian harus positif!');
    return;
  }

  callCenter = new CallCenter(numAgents, maxSize, { updateUI, CircularQueue }, appendLog);
  appendLog(`💡 Simulasi dimulai dengan ${numAgents} agen dan maks antrian ${maxSize}.`);
  startBtn.disabled = true;
  
  const stats = callCenter.statistics();
  document.getElementById('statReceived').textContent = stats.totalReceived;
  document.getElementById('statServed').textContent = stats.totalServed;
  document.getElementById('statRejected').textContent = stats.totalRejected;
  document.getElementById('statQueue').textContent = stats.totalQueue;
  document.getElementById('statWait').textContent = stats.totalWait.toFixed(2) + 's';
  document.getElementById('statDuration').textContent = stats.totalDuration.toFixed(2) + 's';
});

function updateStatistics() {
  if (!callCenter) return;

  const stats = callCenter.statistics();
  document.getElementById('statReceived').textContent = stats.totalReceived;
  document.getElementById('statServed').textContent = stats.totalServed;
  document.getElementById('statRejected').textContent = stats.totalRejected;
  document.getElementById('statQueue').textContent = stats.totalQueue;
  document.getElementById('statWait').textContent = stats.totalWait.toFixed(2) + 's';
  document.getElementById('statDuration').textContent = stats.totalDuration.toFixed(2) + 's';
}
statBtn.addEventListener('click', updateStatistics);

sendCallBtn.addEventListener('click', () => {
  if (!callCenter) {
    appendLog('❗ Simulasi belum dimulai!');
    return;
  }
  const number = numberInput.value.trim();
  const duration = parseInt(durationInput.value);
  if (number && !isNaN(duration)) {
    callCenter.addCall(number, duration);
    numberInput.value = '';
    durationInput.value = '';
  } else {
    appendLog('❗ Isi nomor dan durasi dengan benar!');
  }
});

stopBtn.addEventListener('click', () => {
  if (callCenter) {
    callCenter.stop();
    appendLog('⛔ Simulasi dihentikan');
    const stats = callCenter.statistics();
    document.getElementById('statReceived').textContent = stats.totalReceived;
    document.getElementById('statServed').textContent = stats.totalServed;
    document.getElementById('statRejected').textContent = stats.totalRejected;
    document.getElementById('statQueue').textContent = stats.totalQueue;
    document.getElementById('statWait').textContent = stats.totalWait.toFixed(2) + 's';
    document.getElementById('statDuration').textContent = stats.totalDuration.toFixed(2) + 's';
    startBtn.disabled = false;
    agentInput.value = '';
    queueInput.value = '';

    callCenter = null;
  }
});

const deleteInput = document.getElementById('deleteInput');
const deleteBtn = document.getElementById('deleteBtn');

deleteBtn.addEventListener('click', () => {
  if (!callCenter) {
    appendLog('❗ Simulasi belum dimulai!');
    return;
  }
  const numbersToDelete = deleteInput.value.split(',').map(n => n.trim());
  callCenter.removeCalls(numbersToDelete);
  deleteInput.value = '';
  updateUI();
  appendLog(`🗑️ Menghapus panggilan dengan nomor: ${numbersToDelete.join(', ')}`);
});