# 🚀 Realtime Chat Backend (NestJS)

A scalable **real-time chat backend** built with **NestJS**, **Socket.IO**, **JWT authentication**, and **Prisma**.  
Supports private conversations, friend requests, unread message tracking, and event-driven UI updates.

---

## ✨ Features

- 🔐 **JWT Authentication**
- 💬 **1-to-1 Realtime Messaging (Socket.IO)**
- 👥 **Friend Request System**
  - Send request
  - Accept / Reject
  - Realtime updates
- 📨 **Unread Message Count**
- 🕒 **Last Message & Timestamp Sync**
- 🧠 **Event-driven architecture**
- 🗄 **Prisma ORM**
- 🐘 **PostgreSQL**
- ⚡ **Optimized for mobile clients (React Native / Expo)**

---

## 🧱 Tech Stack

- **Framework:** NestJS
- **Realtime:** Socket.IO
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT
- **Language:** TypeScript

---

## 🔐 Authentication

- Uses **JWT Bearer Tokens**
- Token is required for:
  - Rest endpoints
  - Socket connection (handshake auth)

### Socket Authentication

```ts
socket.auth = { token: JWT_TOKEN };
socket.connect();
```

---

## 🔌 WebSocket Events

### 💬 Messaging

| Event                | Direction       | Description        |
| -------------------- | --------------- | ------------------ |
| `join_conversation`  | Client → Server |  Join a chat room  |
| `leave_conversation` | Client → Server |  Leave a chat room |
| `send_message`       | Client → Server |  Send message      |
| `message:new`        | Server → Client |  New message event |

Payload:

```bash
{
  message: {
    id,
    content,
    senderId,
    conversationId,
    createdAt
  },
  conversation: {
    id,
    lastMessage,
    lastMessageAt
  }
}
```

---

## 👥 Friends

| Event                     | Description        |
| ------------------------- | ------------------ |
| `friend:request_sent`     | Sent to receiver   |
| `friend:request_accepted` | Sent to both users |
| `friend:request_rejected` | Sent to sender     |

---

## 📨 Unread Messages Logic

- `unreadCount` is **NOT stored in the database**
- Calculated and mananged **client-side**
- Reset when the conversation becomes active
- Incremented via `message:new`socket event

---

## 🗃 Database (Prisma)

### FriendRequest

```prisma
model FriendRequest {
  id          String    @id @default(uuid())
  senderId    String
  receiverId  String
  status      FriendRequestStatus
  createdAt   DateTime  @default(now())
}
```

### Message

```prisma
model Message {
  id              String    @id @default(uuid())
  content         String
  senderId        String
  conversationId  String
  createdAt       DateTime  @default(now())
}
```

---

## ⚙️ Environment Variables

Create a `.env`file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/chat
JWT_SECRET=yoursecretkey
PORT=3000
```

---

## 🛠 Setup & Run

```bash
# Install dependencies
npm install

# prisma
npx prisma generate
npx prisma migrate dev

# Start server
npm run start:dev
```

---

## 🧪 Tested With

- React Native (expo)
- Socket.IO client
- JWT-based mobile auth
- İOS & Android

---

## 🚧 Todo / Roadmap

The project is still under active development. Planned features and improvements:

- [ ] 📸 Image messaging
  - [ ] Local image storage (device)
  - [ ] Server-side image upload & delivery
- [ ] 📴 Offline usage
  - [ ] Store messages locally when offline
  - [ ] Sync pending messages when connection is restored
- [ ] 👥 Friend management
  - [ ] Remove friend
  - [ ] Block user (optional)
- [ ] 📬 Message improvements
  - [ ] Read receipts
  - [ ] Typing indicators
- [ ] 🔔 Notifications
  - [ ] Push notifications for new messages
- [ ] 🧪 Testing
  - [ ] Unit tests
  - [ ] Socket integration tests

---

## 📌 Notes

- Event-driven UI → **no refresh required**
- REST is used for initial fetch
- Socket is used for live updates
- Designed to scale with groups & notifications

---

## 👨‍💻 Author

#### Ahmet Furkan Meriç

Frontend-focused Full Stack Developer

React • React Native • NestJS • Prisma
