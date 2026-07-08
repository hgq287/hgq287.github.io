---
slug: "kafka-real-systems-event-log-consumer-groups-replay"
title: "Kafka in real systems: the event log, consumer groups, and replay"
date: "2026-07-02"
excerpt: "Kafka is not just a queue. It is a durable event log that lets many systems react, recover, and replay. This post shows a small TypeScript setup and the production lessons from LinkedIn and Uber."
tags:
  - Kafka
  - EventStreaming
  - Architecture
  - TypeScript
  - Backend
---

Kafka shines when you want to do work **after** a request, without making the user wait.

If you only remember one sentence:

**Kafka is a durable event log that many consumers can read at their own pace.**

## Table of contents

1. [Scenario](#1-scenario)
2. [Queue vs log, in plain language](#2-queue-vs-log-in-plain-language)
3. [Core model: topic, partition, offset, consumer group](#3-core-model-topic-partition-offset-consumer-group)
4. [A tiny TypeScript lab (produce, consume, replay)](#4-a-tiny-typescript-lab-produce-consume-replay)
5. [Delivery semantics: duplicates are normal](#5-delivery-semantics-duplicates-are-normal)
6. [Case studies: LinkedIn and Uber](#6-case-studies-linkedin-and-uber)
7. [The real failure modes](#7-the-real-failure-modes)
8. [Checklist](#8-checklist)

## 1. Scenario

Checkout succeeds. Now several things must happen:

- Send an email receipt
- Run fraud checks
- Update analytics
- Notify warehouse

If Checkout calls all of those services synchronously:

- latency becomes the sum of many dependencies
- any slow system blocks the user
- a temporary outage turns into a full outage

Instead, Checkout publishes one event: `order.paid`.
Downstream systems consume it and do their work asynchronously.

![Kafka event log fanout](/images/systems/kafka-event-log-fanout.svg)

## 2. Queue vs log in plain language

It is easy to think Kafka is "just a queue".
That framing causes bad designs.

### Queue mental model

- One message is handled by one worker
- Once done, it disappears

### Log mental model (Kafka)

- Events are appended to a log
- Consumers track their own position (offset)
- Multiple consumer groups can read the same events independently
- Replay is a normal operation, not a panic move

That is why Kafka fits "many systems react to the same event" so well.

## 3. Core model: topic, partition, offset, consumer group

You do not need to memorize internals to use Kafka well.
You need these four ideas:

- **Topic**: a named stream of events, like `order.paid`
- **Partition**: a shard of that stream, ordered within the partition
- **Offset**: the position of a consumer in a partition
- **Consumer group**: a group of instances that share work for one topic

Two important consequences:

1. Ordering is per partition, not global.
2. Scaling consumers means you scale by partitions.

## 4. A tiny TypeScript lab (produce, consume, replay)

Library to look at:

- `kafkajs`

Producer sketch:

```ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ clientId: 'checkout', brokers: ['localhost:9092'] });
const producer = kafka.producer();

await producer.connect();
await producer.send({
  topic: 'order.paid',
  messages: [
    { key: 'order-123', value: JSON.stringify({ orderId: 'order-123', amount: 1999 }) },
  ],
});
```

Consumer sketch (email service):

```ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ clientId: 'email', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'email-receipts' });

await consumer.connect();
await consumer.subscribe({ topic: 'order.paid', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ message }) => {
    const payload = message.value ? JSON.parse(message.value.toString()) : null;
    if (!payload) return;
    // send email, then commit offset (handled by the client based on config)
  },
});
```

Replay idea:

- Use a new group id to reprocess everything safely, or
- Reset offsets for an existing group if you know what you are doing

In production, replay is how you recover from downstream bugs without asking upstream to resend.

## 5. Delivery semantics: duplicates are normal

In many Kafka setups, you should assume "at least once" delivery.
That means duplicates can happen.

Fresh engineers often learn this the hard way:

- customer gets two emails
- you charge twice
- you double-count analytics

The fix is not to wish for perfect delivery.
The fix is to make consumers idempotent.

Common patterns:

- Use an idempotency key (event id) and store processed ids
- Make writes upsert-based (insert on conflict do nothing)
- Design handlers so repeating is safe

## 6. Case studies: LinkedIn and Uber

### LinkedIn: Kafka as the company data pipeline

Kafka started at LinkedIn as a central data pipeline.
At scale, the key idea is that a durable log lets many teams build consumers without coupling to one producer.

Reference: LinkedIn engineering posts about Kafka ecosystem.

### Uber: Kafka for async queueing between microservices

Uber uses Kafka heavily for pub-sub between services.
They also built a Consumer Proxy to reduce common consumer mistakes and operational headaches.

Reference: Uber engineering post on Kafka async queuing with Consumer Proxy.

## 7. The real failure modes

### 7.1 Treating Kafka like a request path

Kafka is not a good place for "please answer now".
If you need a bounded response, that is usually gRPC or HTTP.

### 7.2 Too few partitions

If you have one partition, you have one lane.
Your consumer group cannot scale beyond that.

Pick partition count with growth in mind, but do not overdo it.

### 7.3 No schema discipline

JSON without rules becomes a mess fast.
If you scale teams, you eventually want schemas (Avro, protobuf, or JSON schema) plus versioning rules.

### 7.4 Ignoring backpressure

Consumers fall behind.
That is normal.

You should monitor:

- consumer lag
- error rates
- retries

And you should decide what happens when you are behind:

- scale consumers
- shed non-critical work
- slow producers in the source system if needed

## 8. Checklist

Before you pick Kafka for a workflow:

1. The work can be asynchronous.
2. You are happy with eventual consistency.
3. You will handle duplicates safely.
4. You have a story for replay and backfill.
5. You can operate it (lag, retries, partitions, retention).

If you need a sync answer with a strict latency budget, use gRPC instead.

