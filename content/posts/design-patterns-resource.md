---
slug: "design-patterns-resource"
title: "Essential Resource: Software Design Patterns"
date: "2025-12-12"
excerpt: "A recommended resource for learning software design patterns, with a short guide to what they are and when they help."
tags:
  - design-patterns
  - Docs
---

For design patterns I often send people to [Refactoring.Guru: Design Patterns](https://refactoring.guru/design-patterns). Quick summary of what is on the site and when it helps.

## What are design patterns?

Design patterns are **reusable solutions to common problems** in software design. They are not ready-made code you copy-paste; they are **templates or blueprints** you adapt to your context. Using them helps you write code that is easier to maintain, extend, and discuss with others.

Patterns come from real-world use. The “Gang of Four” (GoF) book documented 23 classic patterns; many resources, including Refactoring.Guru, build on that and explain them in a clear, example-driven way.

## What you’ll find on Refactoring.Guru

The site covers **22 classic design patterns**, grouped by intent:

1. **Creational patterns** — How objects are created and who creates them. Examples: Factory Method, Abstract Factory, Singleton, Builder, Prototype.
2. **Structural patterns** — How classes and objects are composed to form larger structures. Examples: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
3. **Behavioral patterns** — How objects interact and how responsibilities are assigned. Examples: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor.

For each pattern you typically get: intent, structure (e.g. UML), example code, pros and cons, and when to use it. The explanations are in plain language and avoid unnecessary jargon.

## When are patterns useful?

- **Recurring problems:** When you keep solving the same kind of design problem (e.g. “I need to add new behavior without changing existing code”), a pattern might fit.
- **Communication:** Patterns give you a **shared vocabulary** (e.g. “we’ll use a Strategy here”) so the team can reason about design quickly.
- **Guidance:** They suggest a structure and trade-offs instead of inventing everything from scratch.

Patterns are not mandatory. Use them when they clearly improve clarity or flexibility; avoid forcing them where a simple solution is enough.

## Why Refactoring.Guru

Refactoring.Guru uses a **consistent format** — diagrams, multi-language snippets, intent and trade-offs per pattern. Good for learning the idea, then applying it in your stack (TypeScript, Swift, Kotlin, etc.). Refactoring and SOLID sections pair well with patterns.

**Link:** [Refactoring.Guru – Design Patterns](https://refactoring.guru/design-patterns)
