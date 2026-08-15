# Northstar Support Deflection MVP

A rule-based chatbot prototype built for the Northstar Sprint assignment. It answers customer questions on **order status**, **returns & refunds**, and **stock availability** without a human agent — all 3 of the required ticket categories.

Built by:
1. Godswill Ajuonuma
2. Joy Kolia 
3. Lily Mwangi 
4. Emmanuel Kemboi

--- 

## Project links
- **Board:** [Trello board link]
- **Repo:** [GitHub repo link]
- **Decision-tree design:** `decision-tree-design.md`

---

## How to run it

No installation, no server, no internet connection needed (aside from loading the fonts).

**Option A — Just open it**
Double-click `index.html`. It opens in your default browser and works immediately.

**Option B — VS Code + Live Server (recommended if you're editing)**
1. Open this whole folder in VS Code (`File > Open Folder`)
2. Install the **Live Server** extension (search it in the Extensions panel)
3. Right-click `index.html` → **Open with Live Server**
4. Any time you save a change, the browser auto-refreshes

---

## File structure

```
northstar_bot_split/
├── index.html    ← page structure/skeleton only, no styling or logic
├── styles.css    ← all visual styling (colors, layout, fonts)
├── script.js     ← all chatbot logic (the "brain")
└── README.md     ← this file
```

Keep all three files in the same folder — `index.html` loads the other two by filename, so if they get separated it will load as a broken, unstyled page.

---

## How the chatbot works

`script.js` is a simple **if this, then that** system — no AI model, no real database. It:
1. Takes whatever the customer types (or whichever quick-reply button they click)
2. Checks it against a list of keyword rules (e.g. "contains 'order' and 'where'" → ask for an order number)
3. Looks up a small **mock** list of 3 sample orders (`NR1042`, `NR2091`, `NR3087`) to fake a real order-status lookup
4. If nothing matches, it offers a graceful fallback instead of guessing

Try these to test it:
- "Where's my order?" → then enter `NR1042`
- "How do I return an item?"
- "Where's my refund?" → then enter `NR3087`
- Something unrelated (e.g. "hello") → should offer to escalate, not break
