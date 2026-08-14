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

  if (awaiting === 'orderNumber') {
    lookupOrder(t, 'status');
    return;
  }
  if (awaiting === 'refundOrderNumber') {
    lookupOrder(t, 'refund');
    return;
  }

  // --- specific sub-intents FIRST (they also contain "return"/"refund", so
  //     they must be checked before the broader category matcher below) ---

  if (t.includes('try again')) {
    awaiting = 'orderNumber';
    addMessage('bot', "No problem — what's the order number?");
    return;
  }

  if (t.includes('how do i return')) {
    addMessage('bot',
      "To return an item: 1) Go to <b>Order History</b> and select the item · 2) Choose a reason and print the prepaid label · 3) Drop it at any carrier location. Refunds post within 5–7 business days of us receiving it.",
      { stamp: true }
    );
    return;
  }

  if (t.includes("where's my refund") || t.includes('wheres my refund') || t.includes('refund status')) {
    awaiting = 'refundOrderNumber';
    addMessage('bot', "What's the order number for the return? <span style='color:#8B93A0;font-size:12px'>(Try NR3087 — already delivered — for this demo)</span>");
    return;
  }

  if (t.includes('return policy')) {
    addMessage('bot',
      "Our policy: items can be returned within 30 days of delivery, unworn and with tags. Refunds go back to the original payment method. Final-sale items are marked at checkout and aren't eligible.",
      { stamp: true }
    );
    return;
  }

  // --- broader category matchers (checked AFTER the specific ones above) ---

  if (t.includes('order status') || (t.includes('order') && (t.includes('where') || t.includes('ship')))) {
    awaiting = 'orderNumber';
    addMessage('bot', "Sure — what's your order number? It looks like <code>NR####</code> and is in your confirmation email.<br><span style='color:#8B93A0;font-size:12px'>(Try NR1042, NR2091, or NR3087 for this demo)</span>");
    return;
  }

  if (t.includes('returns & refunds') || t.includes('return') || t.includes('refund')) {
    addMessage('bot', "Got it — what's this about?", {
      quickReplies: ['How do I return an item', "Where's my refund", 'Return policy']
    });
    return;
  }

  // fallback — stock-availability matching lands in the next commit
  addMessage('bot',
    "I couldn't match that to order status, returns/refunds, or stock availability yet — those are the areas I handle. Want to try one of these, or should I hand this to a teammate?",
    { quickReplies: ['Order status', 'Returns & refunds', 'Stock availability', 'Talk to a human'], stamp: true, escalate: true }
  );
}

function lookupOrder(text, mode) {
  const match = text.toUpperCase().match(/NR\d{3,4}/);
  const order = match ? ORDERS[match[0]] : null;
  awaiting = null;

  if (!order) {
    addMessage('bot',
      "I couldn't find that order number. Double check it against your confirmation email, or I can loop in a teammate.",
      { quickReplies: ['Try again', 'Talk to a human'], stamp: true, escalate: true }
    );
    return;
  }

  if (mode === 'status') {
    addMessage('bot',
      `Order <b>${match[0]}</b> — ${order.item}<br>Status: <b>${order.status}</b><br>${order.shipped ? 'Expected/actual arrival: ' + order.eta : 'Not yet shipped — estimated ship-by ' + order.eta}`,
      { stamp: true }
    );
  } else {
    if (order.status !== 'Delivered') {
      addMessage('bot',
        `Order <b>${match[0]}</b> hasn't been marked delivered yet, so a return hasn't been logged. Once it arrives, start the return from Order History and refunds process within 5–7 business days of receipt.`,
        { stamp: true }
      );
    } else {
      addMessage('bot',
        `Order <b>${match[0]}</b> was delivered — if a return's been dropped off, refunds typically post within 5–7 business days. Nothing logged yet on our end for this one; if you already shipped it back, it may still be in transit to us.`,
        { stamp: true }
      );
    }
  }
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
