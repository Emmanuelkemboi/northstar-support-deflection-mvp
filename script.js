const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const deflectedCountEl = document.getElementById('deflectedCount');
let deflected = 0;

// mock order database
const ORDERS = {
  'NR1042': { status: 'In Transit', shipped: true, eta: 'Aug 14', item: 'Trail Runner Jacket (M)' },
  'NR2091': { status: 'Processing', shipped: false, eta: 'Aug 16', item: 'Ceramic Pour-Over Set' },
  'NR3087': { status: 'Delivered',  shipped: true,  eta: 'Delivered Aug 9', item: 'Wool Blend Throw' }
};

// mock stock catalog
const STOCK = {
  'trail runner jacket': { inStock: true, sizes: ['S', 'M', 'L'] },
  'pour-over set':       { inStock: false, restock: 'Aug 20' },
  'wool blend throw':    { inStock: true, sizes: ['One size'] }
};

function addMessage(sender, html, opts = {}) {
  const row = document.createElement('div');
  row.className = 'row ' + sender;

  const ticket = document.createElement('div');
  ticket.className = 'ticket';

  const meta = document.createElement('div');
  meta.className = 'meta';
  const now = new Date();
  const time = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  meta.textContent = (sender === 'bot' ? 'Assistant' : 'You') + ' · ' + time;
  ticket.appendChild(meta);

  const body = document.createElement('div');
  body.innerHTML = html;
  ticket.appendChild(body);

  if (opts.stamp) {
    const stamp = document.createElement('div');
    stamp.className = 'stamp' + (opts.escalate ? ' escalate' : '');
    stamp.textContent = opts.escalate ? 'Escalated' : 'Resolved';
    ticket.appendChild(stamp);
    if (!opts.escalate) {
      deflected++;
      deflectedCountEl.textContent = deflected;
    }
  }

  if (opts.quickReplies) {
    const qr = document.createElement('div');
    qr.className = 'quick-replies';
    opts.quickReplies.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.textContent = label;
      btn.onclick = () => handleUserChoice(label);
      qr.appendChild(btn);
    });
    ticket.appendChild(qr);
  }

  row.appendChild(ticket);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function botGreeting() {
  addMessage('bot',
    "Hi, I'm Northstar's support assistant. I can help with <b>order status</b>, <b>returns &amp; refunds</b>, or <b>stock availability</b> — what do you need?",
    { quickReplies: ['Order status', 'Returns & refunds', 'Stock availability'] }
  );
}

let awaiting = null; // tracks what we're waiting for next: 'orderNumber' | 'refundOrderNumber' | 'stockItem' | null

function disableAllQuickReplies() {
  document.querySelectorAll('.qr-btn').forEach(btn => {
    btn.disabled = true;
    btn.classList.add('used');
  });
}

function handleUserChoice(label) {
  disableAllQuickReplies();
  addMessage('user', label);
  route(label);
}

function route(text) {
  const t = text.toLowerCase();

  // Ticket-type matching (order status, returns/refunds, stock availability)
  // lands in follow-up commits. Everything falls back for now.

  addMessage('bot',
    "I couldn't match that to order status, returns/refunds, or stock availability yet — those are the areas I handle. Want to try one of these, or should I hand this to a teammate?",
    { quickReplies: ['Order status', 'Returns & refunds', 'Stock availability', 'Talk to a human'], stamp: true, escalate: true }
  );
}

sendBtn.addEventListener('click', () => {
  const val = input.value.trim();
  if (!val) return;
  disableAllQuickReplies();
  addMessage('user', val);
  route(val);
  input.value = '';
});
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

botGreeting();
