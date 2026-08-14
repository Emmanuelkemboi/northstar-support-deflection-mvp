# Decision-Tree Design — Northstar Support Assistant
**Satisfies Task Board #4** — "Design decision-tree logic for all 3 flows (order, returns, stock)"

This document is the design record for the chatbot's matching logic — it maps directly to the `route()` function in `script.js`. It's separate from the Charter/Board (team process), README (how to run it), and go-live note (handoff status) because it answers a different question: *what does the bot actually decide, and why*.

## 1. Order status

![Order status decision tree](./assets/order-status-flow.svg)

| Step | Logic |
|---|---|
| Trigger phrases | "order status", "where's my order", "has this shipped" |
| Ask | Order number (expects `NR####` pattern) |
| Lookup | Match against `ORDERS` object |
| Found | Return item, status, and ETA — marked Resolved |
| Not found | Offer retry or hand off to a staff — marked Escalated |

## 2. Returns & refunds

![Returns and refunds decision tree](./assets/returns-refunds-flow.svg)

| Step | Logic |
|---|---|
| Trigger phrases | "return", "refund", "returns & refunds" |
| Ask | Which of 3 sub-topics (quick replies) |
| How to return | Static instructions — Resolved |
| Refund status | Asks for order number, then checks whether that order is marked `Delivered` before replying — Resolved either way, no escalation path here |
| Return policy | Static 30-day policy text — Resolved |

