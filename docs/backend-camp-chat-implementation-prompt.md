# Backend Implementation Brief: Camp Chat

Use this document as the task prompt for the AI coding agent working in the backend repository. The goal is to implement the backend half of Camp chat so the React frontend can replace its temporary local mock with authenticated, persistent, near-real-time chat.

## Task Prompt

You are working in the backend repository for the Zombie Apocalypse game. Implement the backend support for a shared Camp chat. First inspect the repository and its conventions. Do not assume a framework, database, ORM, authentication library, deployment model, or realtime technology until you have verified it in the repository.

This is a feature implementation, not a request for a design proposal only. Explore the existing code, state your understanding briefly, then implement the smallest complete solution consistent with the current architecture. If a product decision below cannot be mapped to an existing domain concept with high confidence, stop and ask the user a focused question before changing the data model or public API.

## Product Decisions Already Made

- There is one shared camp for the initial release. Players who qualify as camp members are in that same camp.
- Camp chat is available only to authenticated camp members.
- The sender shown in chat is the in-game survivor name.
- A player sees messages created from the start of their current Camp visit onward. A player does not receive messages from before entering Camp.
- Entering Camp starts a new visit. Refreshing the page starts a new visit too.
- Other camp members should receive new messages near-real-time.
- Messages should be stored in SQL and retained; do not implement user message deletion or moderation in this first release.
- The first UI limit is 500 characters. Enforce a matching or stricter server-side limit, and document the character-counting rule. Reject empty or whitespace-only messages.
- Message content is plain text, not HTML or Markdown.

The frontend is currently a React/Vite application in a separate repository/workspace. Its Camp chat UI and temporary service are in:

- `src/components/CampChat.jsx`
- `src/service/camp-chat-service.js`
- `src/pages/CampPage.jsx`

The current service is intentionally only an in-memory local preview. It does not persist messages, authenticate a sender, create a server visit, or connect multiple players. Do not mistake it for an existing backend contract.

The frontend currently renders a message with this shape:

```json
{
  "id": "message-id",
  "content": "The east gate is holding.",
  "senderName": "Mara",
  "createdAt": "2026-10-02T16:30:00.000Z"
}
```

Keep this response shape if it fits the backend conventions. If existing conventions require a wrapper or different naming, document the exact mapping so the frontend adapter can be updated without guesswork.

## Required Repository Discovery

Before editing, inspect and report:

1. Backend language, framework, project structure, build and test commands.
2. SQL database, migration tool, ORM/query conventions, and how schema changes are normally applied.
3. Authentication middleware and how the authenticated principal is mapped to a user/profile/survivor.
4. Existing survivor ownership rules and what makes a player eligible to enter Camp.
5. Existing camp/group/membership domain objects, if any. The frontend currently has no `campId` or membership contract.
6. Existing realtime support, such as WebSocket, STOMP, Socket.IO, SSE, a message broker, or deployment-specific constraints.
7. Existing API error format, pagination conventions, logging policy, CORS configuration, and integration-test patterns.

Do not create a parallel authentication or persistence architecture. Reuse existing middleware, entities, migrations, serializers, error handling, and realtime infrastructure where practical.

If no camp domain exists, do not silently treat an arbitrary client-supplied camp ID as membership. Implement the minimum server-controlled shared-camp concept consistent with the product decision, and explain how authenticated users qualify for membership. If the repository’s rules do not make eligibility clear, ask before guessing.

## Proposed API Contract

Treat the routes below as a concrete starting contract, not a reason to ignore established backend route conventions. If you adapt the paths or response envelope, include the final contract and examples in your completion report.

### 1. Start a Camp visit

```http
POST /api/camp/visits
Authorization: Bearer <access-token>
Content-Type: application/json
```

The client does not choose the camp, user, survivor, or visit start time. The backend authenticates the caller, determines their eligible survivor and shared camp, and records a new visit using server time.

Example response (`201 Created`):

```json
{
  "visitId": "opaque-visit-id",
  "startedAt": "2026-10-02T16:30:00.000Z"
}
```

Each Camp entry creates a new visit. A refresh creates another visit. A browser tab should be able to keep using the visit created for that tab while it remains in Camp. Decide and document how old visits expire or become unusable, and avoid breaking a still-open Camp tab merely because the same player opened a second tab unless existing application behavior requires that.

### 2. Read messages for that visit

```http
GET /api/camp/visits/{visitId}/messages?limit=50&cursor=<opaque-cursor>
Authorization: Bearer <access-token>
```

Only return messages in the visit’s camp whose server `createdAt` is at or after the visit’s server-recorded `startedAt`. Never accept a client-provided timestamp as the authorization boundary. The visit must belong to the authenticated caller and must not grant access to another camp.

Use stable ordering by `(createdAt, id)` and bounded cursor pagination. Example response:

```json
{
  "items": [
    {
      "id": "message-id",
      "content": "The east gate is holding.",
      "senderName": "Mara",
      "createdAt": "2026-10-02T16:31:12.345Z"
    }
  ],
  "nextCursor": null
}
```

If there are more messages than the page limit, use a cursor that preserves chronological order and does not skip or duplicate messages around equal timestamps. Choose a sensible maximum page size. The frontend can merge duplicate IDs defensively, but the backend should still provide stable pagination.

### 3. Send a message

```http
POST /api/camp/visits/{visitId}/messages
Authorization: Bearer <access-token>
Content-Type: application/json
```

Request:

```json
{
  "content": "The east gate is holding."
}
```

The server must derive the sender and `senderName` from the authenticated principal and its owned survivor. Do not trust sender IDs, sender names, camp IDs, or timestamps in the request body. Return the persisted message, including its server-generated ID and timestamp.

Example response (`201 Created`):

```json
{
  "id": "message-id",
  "content": "The east gate is holding.",
  "senderName": "Mara",
  "createdAt": "2026-10-02T16:31:12.345Z"
}
```

The response and realtime event should represent the same persisted message. Publish only after the database write succeeds. Do not broadcast a message that subsequently fails to persist.

### 4. Near-real-time delivery

Use the realtime technology already present in the backend if it is suitable. Otherwise implement an authenticated WebSocket (or explain a framework-supported equivalent before choosing a new dependency).

The connection must be scoped to the caller’s current visit and camp. A new message event should use a clear envelope such as:

```json
{
  "type": "message.created",
  "message": {
    "id": "message-id",
    "content": "The east gate is holding.",
    "senderName": "Mara",
    "createdAt": "2026-10-02T16:31:12.345Z"
  }
}
```

Only deliver messages created at or after each connected client’s visit start. Authenticate the connection using the project’s established identity system. Browser WebSocket APIs cannot set arbitrary Authorization headers; do not place a long-lived bearer token in a URL or logs. Prefer the existing secure realtime auth mechanism. If none exists, use a short-lived, single-use connection ticket issued over an authenticated HTTP request and consumed during the WebSocket handshake.

Handle disconnects, reconnects, authorization failure, and cleanup. Reconnecting within the same still-open visit should be possible. On reconnect, the client can fetch messages after its last received cursor to fill any gap. Do not rely on the realtime channel as the only source of truth; SQL remains authoritative.

## Data and Persistence Requirements

Adapt names and types to the backend’s existing schema and migration style. At minimum, persisted messages need:

- A stable primary key.
- A server-controlled camp reference.
- A server-controlled sender survivor/user reference.
- Plain-text message content with a maximum length.
- A server-generated UTC creation timestamp.

The implementation also needs a server-verifiable visit record containing an opaque ID, authenticated owner, camp reference, and server-generated start time. Store visits only as long as needed for authorization and reconnection, and define cleanup/expiry behavior. A visit record must not be forgeable by clients.

Add indexes that support the actual access pattern: visit/camp membership checks and chronological message reads by camp. Use foreign keys and constraints where the existing database conventions support them. Ensure migrations work both on a fresh database and on a database with existing data. Never edit production data manually as part of the implementation.

The initial product choice is to retain messages in SQL and provide no user-facing deletion. Do not add automatic message purging unless the repository already has a retention policy that must be followed. If there is a legal, operational, or storage reason that makes indefinite retention inappropriate, stop and raise it rather than inventing a retention duration.

Consider an idempotency mechanism if the existing API patterns support it, so a retried send does not create accidental duplicates. Do not add disproportionate infrastructure solely for this feature.

## Authorization and Validation Requirements

- Require authentication for visit creation, history reads, sending, and realtime connection setup.
- Apply the existing survivor ownership rule. One user must not send as another user’s survivor.
- Verify the visit belongs to the authenticated user and the correct camp on every history/send/realtime operation.
- Enforce the shared camp membership rule on the server; hiding UI is not authorization.
- Ignore or reject client attempts to supply `campId`, `senderId`, `senderName`, or `createdAt`.
- Enforce a non-empty, trimmed message and the agreed 500-character limit server-side. Define how Unicode characters are counted and test it.
- Use parameterized queries or the repository’s safe ORM APIs. Do not concatenate user text into SQL.
- Treat message content as plain text. Do not render it as HTML or run it through an unsafe HTML renderer.
- Apply rate limiting or the existing anti-abuse mechanism to message sends and connection attempts where available. Keep the initial limit reasonable and document it; do not add unrequested moderation features.
- Return the project’s standard error shape and appropriate HTTP statuses. Do not leak whether another user, camp, or visit exists when that would expose private data.
- Do not log access tokens, one-time realtime tickets, or full message bodies unless existing policy explicitly permits it.

## Suggested Data Model

Use these concepts only as a guide. Reuse or extend equivalent existing entities instead of duplicating them.

```text
camp
  id
  name or stable key
  created_at

camp_membership
  camp_id
  survivor_id or user_id
  joined_at
  (unique constraint appropriate to the existing membership rules)

camp_chat_visit
  id
  camp_id
  authenticated_user_id
  survivor_id
  started_at
  expires_at or closed_at, if needed by the backend lifecycle

camp_message
  id
  camp_id
  sender_survivor_id
  content
  created_at
```

For the first release there is one shared camp, but keep camp identity server-controlled. Do not require clients to pass a camp ID. Do not create a multi-camp UI or camp-creation workflow as part of this task.

If an existing application concept makes `camp` or `camp_membership` unnecessary, explain the chosen equivalent. The key requirement is that the authorization boundary be explicit and testable rather than inferred from a client parameter.

## Required Tests

Add focused tests following the backend repository’s conventions. At minimum cover:

### Persistence and validation

- A valid message is persisted and returned with a server ID and UTC timestamp.
- Empty and whitespace-only content is rejected.
- Content above the maximum length is rejected; include a Unicode edge case.
- Sender name and sender identity come from the authenticated survivor, not request JSON.
- Messages are plain text data and special characters survive round-trip without unsafe interpretation.
- The database write must succeed before a message is broadcast.

### Visit boundary

- Creating a visit returns a server-generated ID and start time.
- A visit sees messages created at or after its own start time.
- A visit does not see messages created before it started.
- Refresh/new entry creates a new visit boundary.
- Supplying a forged timestamp or another user’s visit ID cannot widen the history window.
- Pagination is stable and has no gaps or duplicates for messages with tied timestamps.

### Authorization

- Unauthenticated callers are rejected.
- A user cannot read or send using another user’s visit.
- A user cannot impersonate another survivor or choose a different camp.
- A caller who is not eligible for Camp is rejected according to the actual membership rule.
- Realtime subscriptions are authorized and scoped to the visit/camp.

### Realtime

- A committed message is delivered to connected members of the same camp whose visit has started.
- Members whose visits have not started yet do not receive that older message.
- Failed persistence produces no message event.
- Disconnect/reconnect does not bypass authorization; the documented recovery path can retrieve messages missed during the disconnect.

Use unit tests for isolated validation and integration tests for authorization, SQL behavior, and realtime delivery where the repository supports them. Do not weaken or delete existing tests to make the feature pass.

## Implementation Workflow

Work in small, reviewable stages and run the narrowest relevant checks after each stage:

1. **Map the backend**: identify domain, auth, persistence, realtime, and test conventions. Report assumptions before implementation.
2. **Define the contract**: confirm final routes, request/response payloads, visit lifecycle, membership rule, and realtime auth. Ask the user if a required product decision is genuinely ambiguous.
3. **Implement schema and domain behavior**: add migrations/entities/repositories and visit-scoped query logic.
4. **Implement authenticated HTTP endpoints**: create visit, fetch paginated visit history, validate and persist a message.
5. **Implement realtime delivery**: authorize a visit-scoped connection and publish only committed messages.
6. **Test security and boundaries**: run focused tests for validation, membership, sender spoofing, history boundary, pagination, and realtime.
7. **Run project checks**: run the repository’s build, full tests, formatting, and lint/type checks. Report pre-existing failures separately; do not fix unrelated failures without approval.
8. **Prepare frontend handoff**: document the final API contract, auth requirements, WebSocket connection details, environment/configuration changes, migration command, test commands, and any changes the frontend must make to `camp-chat-service.js`.

Make small commits at meaningful, verified checkpoints if that repository’s workflow permits it. Do not rewrite history, discard existing user changes, or commit secrets/configuration containing credentials.

## Acceptance Checklist

Do not call the feature complete until all applicable items are true:

- [ ] The real database stores messages and server-owned visit boundaries.
- [ ] The authenticated identity determines survivor, camp, and sender name.
- [ ] A new Camp entry gets a new server visit; history is limited to that visit’s start time.
- [ ] A client cannot select another sender, camp, visit owner, or history start time.
- [ ] Messages are delivered near-real-time to authorized current camp visitors.
- [ ] Realtime delivery is backed by persisted messages and has a documented reconnect recovery path.
- [ ] Message length, blank input, and Unicode behavior are tested.
- [ ] SQL migrations, backend tests, and project build/checks pass, or existing failures are clearly identified.
- [ ] API examples and frontend integration instructions are documented.

## Completion Report Format

When finished, report:

1. The backend stack and existing conventions you used.
2. The files and migrations changed, with one-line descriptions.
3. The final HTTP and realtime contract, including example payloads and authentication behavior.
4. How camp membership and visit boundaries are enforced.
5. The exact tests/build/lint commands run and their results.
6. Any known limitations, operational setup, migration steps, environment variables, or deployment changes.
7. The exact frontend changes needed to replace the local mock with the real backend.

Do not claim that cross-player chat works until it has been verified with two authenticated clients connected to the same camp.
