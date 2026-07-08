---
slug: "design-patterns-resource"
title: "Design patterns resource I keep sending people"
date: "2025-12-12"
excerpt: "Refactoring.Guru in short: what design patterns are, how the site groups them, and when they are actually worth using."
tags:
  - design-patterns
  - Docs
---

For design patterns, I usually point people to [Refactoring.Guru: Design Patterns](https://refactoring.guru/design-patterns). Here is a quick guide to what you get there and when it helps.

## What are design patterns?

Design patterns are **reusable solutions to common problems** in software design. They are not ready-made code you copy-paste; they are **templates or blueprints** you adapt to your context. Using them helps you write code that is easier to maintain, extend, and discuss with others.

Patterns come from real-world use. The “Gang of Four” (GoF) book documented 23 classic patterns; many resources, including Refactoring.Guru, build on that and explain them in a clear, example-driven way.

## What you’ll find on Refactoring.Guru

The site covers **22 classic design patterns**, grouped by intent:

1. **Creational patterns**: how objects are created and who creates them. Examples: Factory Method, Abstract Factory, Singleton, Builder, Prototype.
2. **Structural patterns**: how classes and objects are combined into larger structures. Examples: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
3. **Behavioral patterns**: how objects interact and how responsibilities are assigned. Examples: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor.

For each pattern you typically get: intent, structure (e.g. UML), example code, pros and cons, and when to use it. The explanations are in plain language and avoid unnecessary jargon.

## When are patterns useful?

- **Recurring problems:** When you keep solving the same kind of design problem (e.g. “I need to add new behavior without changing existing code”), a pattern might fit.
- **Communication:** Patterns give you a **shared vocabulary** (e.g. “we’ll use a Strategy here”) so the team can reason about design quickly.
- **Guidance:** They suggest a structure and trade-offs instead of inventing everything from scratch.

Patterns are not mandatory. Use them when they clearly improve clarity or flexibility; avoid forcing them where a simple solution is enough.

## Why Refactoring.Guru

Refactoring.Guru uses a **consistent format** with diagrams, multi-language snippets, intent, and trade-offs for each pattern. It is good for learning the idea first, then applying it in your own stack (TypeScript, Swift, Kotlin, and more). The Refactoring and SOLID sections also pair well with patterns.

**Link:** [Refactoring.Guru – Design Patterns](https://refactoring.guru/design-patterns)
