# Bitespeed Backend Task: Identity Reconciliation

A web service that identifies and reconciles customer identities across multiple purchases by linking contacts with shared email addresses or phone numbers.

## 🚀 Live Endpoint

```
POST https://bitespeed-4pst.onrender.com/identify

```

---

## 📋 Problem Statement

FluxKart.com uses Bitespeed to collect contact details for personalized customer experiences. Since customers may use different emails and phone numbers across purchases, Bitespeed needs to link those contacts to the same person.

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MySQL

### Frontend
- **Build Tool:** Vite
- **Framework:** React
- **Language:** TypeScript

---

## 📁 Project Structure

```
├── sql/
│   └── schema.sql        # Database schema definition (reference)
├── src/
│   ├── config/
│       └── db.ts         # MySQL database connection setup
│   ├── index.ts          # Application entry point
│   ├── routes/
│   │   └── identify.ts   # Defines /identify API route
│   ├── services/
│   │   └── contactService.ts    # Core identity reconciliation logic
│   └── types/
│       └── contact.ts     # Type definitions for Contact model
├── package.json           # # Project dependencies and scripts
```

---

## 📡 API Reference

### `POST /identify`

Identifies and consolidates a contact based on the provided email and/or phone number.

#### Request Body

```json
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}
```

> At least one of `email` or `phoneNumber` must be provided.

#### Response

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["primary@example.com", "secondary@example.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

---

## 🔍 Business Logic

| Scenario | Behavior |
|----------|----------|
| No matching contact found | Create a new **primary** contact |
| Match found with new info | Create a new **secondary** contact linked to the primary |
| Two separate primaries linked by request | Older one stays **primary**, newer becomes **secondary** |
| Existing contact, no new info | Return consolidated contact as-is |

### Contact Linking Rules

- Contacts are linked if they share either an `email` or `phoneNumber`.
- The **oldest** contact in a linked group is always the `primary`.
- All others are `secondary`, with `linkedId` pointing to the primary's `id`.
- If a request bridges two previously separate primary contacts, the newer primary is demoted to secondary.

---

## 🧪 Example

**Request:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

---

## 🌐 Deployment

The application is deployed using separate services for backend, frontend, and database.

### Backend (Render)
- Hosted on **Render**
- API Base URL: https://bitespeed-4pst.onrender.com
- Exposes the `/identify` endpoint.

---

### Frontend (Vercel)
- Hosted on **Vercel**
- Frontend URL: https://bite-speed-kappa-three.vercel.app/
- Built using Vite + React + TypeScript.
- Communicates with the deployed backend API.

---

### Database (Railway)
- **MySQL database** hosted on Railway.
- Connected securely using the `DATABASE_URL` environment variable.

---
