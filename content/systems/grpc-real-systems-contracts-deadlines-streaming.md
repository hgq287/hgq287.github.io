---
slug: "grpc-real-systems-contracts-deadlines-streaming"
title: "gRPC in real systems: contracts, deadlines, and streaming"
date: "2026-06-12"
excerpt: "When a service needs a fast answer, gRPC is a great fit. This post shows a small TypeScript setup, the failure modes that bite teams, and what Netflix and Uber learned at scale."
tags:
  - gRPC
  - Microservices
  - Architecture
  - TypeScript
  - Backend
---

You usually reach for gRPC when Service A needs an answer from Service B **now**, not later.

This post is not a framework tour. It focuses on what makes gRPC worth it in production:

- A typed contract that does not drift
- Deadlines that prevent slow calls from melting your fleet
- Streaming when you need a long-lived, efficient connection

## Table of contents

1. [Scenario](#1-scenario)
2. [What gRPC is, in one minute](#2-what-grpc-is-in-one-minute)
3. [The contract: proto rules that keep you safe](#3-the-contract-proto-rules-that-keep-you-safe)
4. [A tiny TypeScript lab (unary + deadline)](#4-a-tiny-typescript-lab-unary--deadline)
5. [Streaming: when it is actually the right tool](#5-streaming-when-it-is-actually-the-right-tool)
6. [Case studies: Netflix and Uber](#6-case-studies-netflix-and-uber)
7. [The real failure modes](#7-the-real-failure-modes)
8. [Checklist](#8-checklist)

## 1. Scenario

You run an Order API. Before you accept an order, you must check Inventory:

- Target: p95 under 50 ms
- Data is small and structured (SKU, quantity, availability)
- A slow dependency must not block worker threads forever

This is a synchronous call. If Order waits, the customer waits.

That is the shape where gRPC is a strong default.

![gRPC service call boundary](/images/systems/grpc-service-call-boundary.svg)

## 2. What gRPC is, in one minute

gRPC is RPC over HTTP/2 with a strongly typed interface definition (protobuf).

You define the service once in a `.proto` file:

- Both sides generate code from the same contract
- Payloads are small (binary protobuf, not JSON text)
- HTTP/2 keeps connections efficient (multiplexing, header compression)

The part that matters most is not speed. It is that the contract and clients stay consistent.

## 3. The contract: proto rules that keep you safe

If you only remember one thing, remember this:

**Proto files are an API. Treat them like one.**

Basic rules that keep old clients working:

- Never reuse field numbers
- Only add optional fields, do not rename or change meaning lightly
- Reserve removed field numbers
- Keep messages small and stable

Example contract:

```proto
syntax = "proto3";

package inventory.v1;

service InventoryService {
  rpc CheckAvailability(CheckAvailabilityRequest) returns (CheckAvailabilityResponse);
}

message CheckAvailabilityRequest {
  string sku = 1;
  int32 quantity = 2;
}

message CheckAvailabilityResponse {
  bool available = 1;
  int32 available_quantity = 2;
}
```

## 4. A tiny TypeScript lab (unary + deadline)

Libraries to look at:

- `@grpc/grpc-js`
- `@grpc/proto-loader`

Server sketch:

```ts
import * as grpc from '@grpc/grpc-js';

function checkAvailability(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const { sku, quantity } = call.request;
  const available = sku !== '' && quantity > 0;
  callback(null, { available, available_quantity: available ? 42 : 0 });
}
```

Client sketch with a deadline:

```ts
import * as grpc from '@grpc/grpc-js';

const deadline = new Date(Date.now() + 50);

client.CheckAvailability(
  { sku: 'SKU-123', quantity: 2 },
  { deadline },
  (err: grpc.ServiceError | null, res?: any) => {
    if (err) {
      if (err.code === grpc.status.DEADLINE_EXCEEDED) {
        // treat as a normal failure, not an incident
      }
      return;
    }
    // use res.available
  }
);
```

Deadlines are not optional.
If you do not set them, you will eventually have a slow dependency and a pile-up behind it.

## 5. Streaming: when it is actually the right tool

Do not add streaming because it looks advanced.
Use streaming when you need a long-lived channel:

- Mobile push connection with acknowledgements
- Live updates to a dashboard
- Low-latency fanout where polling is wasteful

If you just need request, response, unary calls are simpler and easier to debug.

## 6. Case studies: Netflix and Uber

These are different companies, but the lessons are the same.

### Netflix: contracts and codegen are the big win

Netflix chose gRPC largely for the interface definition and generated clients.
At scale, the time saved is not microseconds per call. It is engineering time and fewer client bugs.

Reference: CNCF Netflix case study on gRPC.

### Uber: streaming for mobile push, better tail latency

Uber moved parts of their push platform to gRPC streaming.
They reported better p95 connection latency and improved delivery acknowledgement reliability by keeping everything on one stream.

Reference: Uber engineering write-up on their next-gen push platform over gRPC.

## 7. The real failure modes

These are the ones that bite teams early.

### 7.1 No deadlines

If you ship without deadlines:

- slow calls pile up
- retries increase pressure
- the system fails in a spiral

Set deadlines everywhere and propagate them across hops.

### 7.2 Too much data in one call

gRPC is not a free pass to send large payloads.

Large messages:

- increase tail latency
- stress memory
- increase GC pressure in managed runtimes

Prefer small messages and paginate when needed.

### 7.3 Browser constraints

Browsers cannot talk to native gRPC the same way servers do.
If you need browser clients, you usually add a gateway (gRPC-Web or an HTTP API in front).

### 7.4 Debugging without good tooling

With REST, you can curl and read JSON.
With gRPC, you should plan for:

- structured logs (method name, status, latency)
- tracing
- a standard way to test locally (grpcurl, or a small dev client)

## 8. Checklist

Before you pick gRPC for a service boundary:

1. The call is synchronous and needs a bounded latency budget.
2. You will enforce deadlines by default.
3. You can keep a shared proto contract stable (versioning discipline).
4. You have a plan for observability (status codes, latency, tracing).
5. You are not doing this for browsers without a gateway plan.

