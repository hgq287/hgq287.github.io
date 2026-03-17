---
slug: "mastering-oauth2-jwt"
title: "Building a Modern Authentication System: OAuth 2.0 & JWT (RS256)"
date: "2025-12-11"
excerpt: "A guide to a hybrid auth setup: stateless JWT access tokens (RS256) and revocable refresh tokens for security and performance."
tags:
  - OAuth2
  - Security
  - JWT
  - Backend
  - Architecture
---

This post describes how we built a **secure, performant authentication system** using **OAuth 2.0** with **JWT access tokens** signed by **RS256** and **opaque, revocable refresh tokens**. The hybrid approach keeps API checks fast while still allowing instant revocation when needed.

## 1. Architecture overview

We use two kinds of tokens so that **speed** (no DB on every request) and **security** (ability to revoke sessions) are both satisfied.

| Component | Technology | Role | Main point |
| :--- | :--- | :--- | :--- |
| **Access Token** | JWT (RS256) | Presented when calling APIs | **Stateless** — verified by signature only, no DB lookup |
| **Refresh Token** | Opaque string | Used to obtain a new access token | **Revocable** — stored in DB; we can invalidate it anytime |
| **Server** | express-oauth-server | Implements OAuth 2.0 flows and token handling | Standard behavior; we customize the model (see below) |
| **Database** | PostgreSQL/Prisma | Stores users and refresh tokens | Single source of truth for long-lived sessions |

**Why RS256?** We sign JWTs with a **private key** and verify with a **public key**. That allows verification without sharing the signing secret (e.g. multiple services can verify tokens with only the public key). RS256 is a good fit when you have a central auth service that issues tokens and other services that only verify them.

## 2. Why two tokens?

### Access token (short-lived, stateless)

- **Format:** JWT (claims like `sub`, `exp`, `scope`, etc.).
- **Signing:** RS256 with a private key; servers verify with the public key.
- **Benefit:** No database call on each API request. Validation is a cryptographic check only.
- **Lifetime:** Short (e.g. 15 minutes to 1 hour). Limits damage if the token is leaked.

### Refresh token (long-lived, revocable)

- **Format:** Opaque string (random, stored in DB).
- **Storage:** Saved in the database and linked to the user (and optionally client/session).
- **Benefit:** When we revoke a session (logout, compromise, password change), we delete or invalidate the refresh token. The user can no longer get new access tokens.
- **Lifetime:** Long (e.g. days or weeks). Only used occasionally to get a new access token.

So: **access token = fast, stateless, short-lived**; **refresh token = revocable, long-lived, stored**.

## 3. Supported login flows

### 3.1. Password grant (username + password sign-in)

- **Endpoint:** `POST /v1/signin` (or equivalent).
- **Flow:** Client sends client ID/secret (e.g. in Basic Auth header) and username/password (e.g. in JSON body). Server validates credentials, creates access + refresh tokens, returns both.
- **Use case:** First-party apps (e.g. your own web or mobile app) where the user types a password. We implemented a custom handler here to fix a library bug and to control exactly how tokens are issued.

### 3.2. Authorization code grant

- **Endpoint:** `GET /v1/oauth/authorize` (and token endpoint for exchanging the code).
- **Flow:** User is redirected to the auth server, logs in, and approves access. The server redirects back with a one-time **authorization code**. The client exchanges the code (with client secret) for access and refresh tokens.
- **Use case:** Third-party or public clients (e.g. another company’s app) that need limited access to a user’s data. The secret never goes to the browser; the code is one-time use.

## 4. Key logic in the OAuth model

We plug custom logic into the OAuth library via a **model** (e.g. `oauth.model.ts`). Main responsibilities:

| Function | Responsibility |
| :--- | :--- |
| **`generateAccessToken`** | Create a JWT with the right claims and sign it with the **private key** (RS256). |
| **`getAccessToken`** | **Verify** the JWT signature with the **public key** and return the token object. No database access. |
| **`saveToken`** | Persist **only the refresh token** (and metadata) in the DB. The access token is not stored. |
| **`getRefreshToken`** | Load the refresh token from the DB (e.g. to validate and rotate it). |
| **`revokeToken`** | Delete or mark the refresh token as invalid in the DB. |
| **`getUser`** | Validate username/password (or other credentials) and return the user object. |

This keeps **JWT creation and verification** in one place and **refresh token lifecycle** in the database.

## 5. Security considerations

- **Access token:** Prefer short expiry. Store in memory or a short-lived cookie; avoid long-term storage in localStorage if XSS is a concern.
- **Refresh token:** Store in DB; send over HTTPS only. Optionally bind to client or IP; rotate on use (issue a new refresh token and invalidate the old one).
- **Keys:** Keep the RS256 private key only on the auth server; distribute the public key to services that verify tokens. Rotate keys with a clear strategy (e.g. support two public keys during transition).

## 6. Wrap-up

Using **JWT (RS256)** for access tokens and **opaque, stored refresh tokens** gives a hybrid auth system that is fast (stateless verification), standards-based (OAuth 2.0), and secure (revocation and short-lived access). Customizing the OAuth model lets you align token format, storage, and revocation with your product and security requirements.
