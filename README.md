# Northstar Support Deflection MVP

A rule-based chatbot prototype built for the Northstar Sprint assignment. It answers customer questions on **order status**, **returns & refunds**, and **stock availability** without a human agent — all 3 of the required ticket categories.

Built by:
1. Godswill Ajuonuma
2. Joy Kolia 
3. Lily Mwangi 
4. Emmanuel Kemboi

--- 

## Project links
- [Project charter](https://docs.google.com/document/d/1bFPIbFYlttUt4Bdvw_-3ugtwAO85SmnUqCwG0ClW-rg/edit?usp=sharing)
- **Board:** [Trello Board](https://trello.com/invite/b/6a7cb29070d3c4e2b63218af/ATTI6674c657941547b28827f131d0c5636387330F41/plpgroup95)
- **Repo:** [GitHub Repository](https://github.com/Emmanuelkemboi/northstarsupportdeflectionmvp)
- **Decision-tree design:**[Decision-tree design](./decision-tree-design.md)
- [Go-live readiness note](./assets/Northstar_GoLive_Note.docx)

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

---

## Try it: quick test script

| You type | Expected result |
|---|---|
| Where's my order? | Bot asks for order number |
| NR1042 | Bot returns "In Transit," ETA Aug 14 |
| Returns & refunds | Bot shows 3 sub-options |
| How do I return an item | Bot gives return steps |
| Is this back in stock? | Bot asks which item |
| trail runner jacket | Bot returns "in stock," sizes S/M/L |
| pour-over set | Bot returns "out of stock," restock date |
| asdkfjhskdjf | Bot offers fallback + "Talk to a human" |

Note: once you click any button, all earlier buttons in the chat lock (grey out) so you can only respond to the latest message — this matches how a real support chat should behave.

---

## Known limitations (see the go-live note for full details)

- Order and stock data is hardcoded/mock, not connected to a real database
- Keyword matching only — unusual phrasing may not be recognized
- Stock lookup matches on exact-ish product names only, not fuzzy search
- No identity verification before showing order details

---

## Working on this as a team

To keep the commit/edit audit trail meaningful, try to keep changes scoped to the file that matches your task:
- Logic/rules changes → `script.js`
- Visual/styling changes → `styles.css`
- Structure/layout changes → `index.html`

Use real commit messages in the format `<type>: <what changed> - <why it matters>`, for example:

```
feat: add stock-availability lookup - covers 3rd ticket type
fix: reorder intent matching - specific replies were being swallowed by generic category check
style: adjust mobile chat spacing - was unreadable under 400px width
docs: update README test script - added new stock-availability examples
```

Avoid vague messages like "updates" or "fixed stuff" — the brief specifically calls these out as unacceptable.
