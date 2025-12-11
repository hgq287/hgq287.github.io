---
slug: "mastering-oauth2-jwt"
title: "Building a Modern Authentication System: OAuth 2.0 & JWT (RS256)"
date: "2025-12-11"
excerpt: "A simple guide to our Hybrid Security Architecture, using stateless JWT Access Tokens and revocable Refresh Tokens for better security and speed."
tags:
  - OAuth2
  - Security
  - JWT
  - Backend
  - Architecture
---

Welcome to my first technical deep dive! 

In this post, we explore how we built a super-secure and fast login system. We are using a **Hybrid Security Architecture** that combines **OAuth 2.0** rules with **JSON Web Tokens (JWTs)** signed by **RS256**.

## 1. Architecture Overview: Speed Meets Security

Our goal is simple: make the system fast by making the access key self-checking.

| Component | Technology | Main Job | Key Feature |
| :--- | :--- | :--- | :--- |
| **Access Token** | **JWT (RS256)** | The key to accessing our APIs. | **Stateless** (No DB check needed for verification). |
| **Refresh Token** | Opaque String | The key to get a new Access Token. | **Revocable** (Can be canceled instantly in the DB). |
| **Server Core** | `express-oauth-server` | Manages all the login and permission rules. | Follows industry standards. |
| **Database** | PostgreSQL/Prisma | Stores users and the long-term Refresh Tokens. | Data integrity. |

## 2. Token Strategy: Why Two Keys?

We use two types of tokens because each has a different security role.

### A. Access Token (The Fast Key)

1.  **Format:** JSON Web Token (JWT).
2.  **Validation:** Signed using a **Private Key** (RS256). The server checks its validity using a **Public Key**.
3.  **Benefit:** This is extremely fast because the server doesn't need to check the database every time an API is called.
4.  **Lifespan:** Short (e.g., 1 hour).

### B. Refresh Token (The Safe Key)

1.  **Format:** A random, meaningless string (Opaque Token).
2.  **Safety:** It **must be saved in the database**. This is the only way we can track long-term sessions.
3.  **Benefit:** If a user's account is compromised, we can delete the Refresh Token from the database, instantly blocking their ability to get new Access Tokens.
4.  **Lifespan:** Long (e.g., 1 week).

## 3. Supported Login Flows

### 3.1. Password Grant (The Main Sign-in Flow)

* **Endpoint:** `POST /v1/signin`
* **How it Works:** This is a custom solution we built to fix a library bug.
    * Client ID/Secret sent in the **Basic Auth Header**.
    * Username/Password sent in the **JSON Body**.
    * The server manually processes the request to ensure tokens are issued correctly.

### 3.2. Authorization Code Grant

* **Endpoint:** `GET /v1/oauth/authorize`
* **Use Case:** The standard, safest way for third-party apps (like a web service) to get limited access to your user's data.

## 4. Key Code Logic (`oauth.model.ts`)

Our custom security logic lives in the model file. Here’s what the key functions do:

| Model Function | What it Does |
| :--- | :--- |
| **`generateAccessToken`** | **Creates the JWT** and signs it using our Private Key. |
| **`getAccessToken`** | **Verifies the JWT signature** using the Public Key. (It doesn't touch the database). |
| **`saveToken`** | **Only saves the Refresh Token** to the DB. (It ignores the Access Token). |
| **`revokeToken`** | Deletes the Refresh Token from the database. |
| **`getUser`** | Checks the user's email and password during login. |

## 5. Conclusion

By moving to this **JWT/RS256** architecture, we solved complex library bugs and achieved a fast, reliable, and modern security system. This foundation is ready to scale with our application!