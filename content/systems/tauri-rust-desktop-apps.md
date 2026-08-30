---
slug: "tauri-rust-desktop-apps"
title: "Shipping one desktop app on Mac and Windows: Tauri, Rust, and what I would not do twice"
date: "2026-08-21"
excerpt: "One React UI, one Rust engine, two signed installers. Why we picked Tauri over SwiftUI or Electron, what I would not do twice, and the CI path that ships Mac and Windows."
tags:
  - Tauri
  - Rust
  - Desktop
  - Architecture
  - ONNX
  - GitHub Actions
---

A lot of desktop advice still assumes you pick a native UI kit per OS, then hope the two products stay in sync. We did not want that. We wanted one design, one engine, two installers.

This is the stack we would pick again for a local utility (scan, classify, talk to OS APIs, optional on-device model): **Tauri 2** for the window, **React** for the chrome, **Rust** for everything that can ruin a user's files.

Tauri 2 can also target **iOS and Android**. That is a real option, not vapor. It is also the junior sibling of desktop.

Notes below are from building and shipping that kind of app, not from a framework landing page.

**Goal:** keep Mac, Windows, the CLI, and a weekly job on **one rulebook**, then sign both desktop installers without inventing a second product.

## Table of contents

1. [What Tauri plus Rust actually is](#1-what-tauri-plus-rust-actually-is)
2. [The trade-off we accepted](#2-the-trade-off-we-accepted)
3. [Why Tauri, not SwiftUI or WinForms](#3-why-tauri-not-swiftui-or-winforms)
4. [Why Rust, not Swift-only, KMP, C#, or C++](#4-why-rust-not-swift-only-kmp-c-or-c)
5. [Can Tauri plus Rust do Slack or ClickUp?](#5-can-tauri-plus-rust-do-slack-or-clickup)
6. [Mobile: yes you can, you probably should not ship the same app](#6-mobile-yes-you-can-you-probably-should-not-ship-the-same-app)
7. [On-device AI, Mac vs Windows: a stack that does not fork](#7-on-device-ai-mac-vs-windows-a-stack-that-does-not-fork)
8. [Performance: what to measure, not what to brag about](#8-performance-what-to-measure-not-what-to-brag-about)
9. [Database strategy](#9-database-strategy)
10. [System design (patterns that survive a second OS)](#10-system-design-patterns-that-survive-a-second-os)
11. [CI/CD, signing, and a workflow that is not a demo](#11-cicd-signing-and-a-workflow-that-is-not-a-demo)
12. [Checklist](#12-checklist)

## 1. What Tauri plus Rust actually is

Tauri is a **thin native shell**. On macOS you get a WKWebView. On Windows you get WebView2. On iOS, WKWebView again. On Android, the system WebView. Your UI is HTML/CSS/JS (we use React). The interesting work lives in a **Rust process** that the webview talks to over a small IPC layer.

That is the opposite of Electron, where Chromium *is* the app. It is also the opposite of SwiftUI, where the UI *is* the Mac.

![Tauri plus Rust: one window, one engine](/images/systems/tauri-shell-architecture.svg)

A useful mental model:

| Piece | Who owns it |
|-------|-------------|
| Window, title bar, menus (desktop) | Tauri (OS chrome) |
| Screens, lists, settings | React |
| Scan, rules, delete, license, schedule | Rust |
| Trash / Recycle Bin, Finder, Explorer | Tiny Rust (or a few lines of FFI) per OS |

If you put risk logic in React, you will rewrite it in the CLI and again in the weekly job. We did not.

## 2. The trade-off we accepted

We traded **native widgets and a faster first Mac (or Windows) UI** for **one engine and one design**.

What we gave up:

- SwiftUI / AppKit density. Webview CSS will never look like System Settings.
- Best-in-class mobile. Tauri on iOS/Android is reuse, not a phone-first product.
- Hiring. Rust plus a bit of FFI is harder to staff than C# on Windows or Swift on Mac.
- Day-one speed. A SwiftUI prototype of the list is shorter. The third delete path is more expensive.

What we bought:

- Mac and Windows are the same product, not two roadmaps.
- GUI, CLI, and a weekly job cannot invent their own Trash rules.
- A small installer and no bundled Chromium.
- On-device copy that fails to static rules, not a second AI stack per OS.

If the product is a website in a window, this trade is the wrong one. Stay on Electron. If the product is OS APIs plus a rulebook, this is the trade I would make again.

The rest of this post is that trade in detail, not a feature list.

## 3. Why Tauri, not SwiftUI or WinForms

**SwiftUI** is the right call if the product is Mac-only and you want System Settings density, Widgets, and reviewers who live in Xcode. The cost is a **second product** the day you need Windows. You do not "just add WinUI later." You hire a Windows team or you stall.

**WinForms / WPF / WinUI** is the same story in reverse. Fine for an internal Windows tool. Painful if the Mac build is supposed to be the same app, not a cousin.

**Electron** would have given us one UI, but we would ship Chromium, eat RAM, and fight autoupdate size. For a disk utility that people leave in the menu bar, that is the wrong default.

Tauri is the boring middle: one React UI, native webviews the OS already updates, Rust for the kernel.

### SwiftUI vs Tauri, in code

Same job: list leftovers, user confirms, then move to Trash. SwiftUI wants the list and the side effect in the same world.

```swift
struct ReviewView: View {
    @State var items: [Leftover] = []

    var body: some View {
        List(items) { item in
            Toggle(item.title, isOn: $items[item.id].selected)
        }
        Button("Move to Trash") {
            Task { try await TrashService.move(items.filter(\.selected)) }
        }
    }
}
```

That compiles. Six months later, `TrashService` has grown a CLI, a launchd job, and a "just this once" skip. You now have **three delete paths**.

Tauri keeps the list dumb. Rust owns confirm:

```rust
#[tauri::command]
fn purge_execute(state: State<App>, ids: Vec<String>) -> Result<Receipt, String> {
    let plan = state.engine.plan_purge(&ids)?;
    state.engine.execute_purge(&plan).map_err(|e| e.to_string())
}
```

```tsx
async function confirmTrash(ids: string[]) {
  const receipt = await invoke<Receipt>("purge_execute", { ids });
  setReceipt(receipt);
}
```

The React side cannot invent a new delete. The CLI calls the same `execute_purge`. That is the whole point of the split.

SwiftUI snippet is shorter on day one. Tauri plus Rust is longer on day one and cheaper when Windows, CLI, and a weekly job show up. That is the same trade as section 2, in code.

## 4. Why Rust, not Swift-only, KMP, C#, or C++

The UI kit is not the hard part. The hard part is **one set of rules** that must match on Mac, Windows, and a headless CLI.

| Option | What you get | What you pay |
|--------|--------------|--------------|
| **Rust** | One engine crate. Memory safety. Easy to ship a CLI from the same code. `unsafe` stays at OS edges. | Steeper hiring. Slower UI iteration unless the webview owns chrome. |
| **Swift + Foundation** | Best Mac APIs. SwiftUI for free. | Windows is a rewrite or a JNI-shaped mess. CLI on Windows is not this codebase. |
| **Kotlin Multiplatform** | Shared domain on JVM/Native. Decent mobile story. | Desktop is still the weak sibling. ONNX/ORT and Trash APIs are not KMP's home. Two UI toolkits anyway. |
| **C# (.NET MAUI / Avalonia)** | Fast to staff. Fine Windows story. | Mac is second-class or a different UI. Native Mac Trash and signing are the usual tax. |
| **C++** | Fast, everywhere. | You *will* leak, and you will debug it on two OS. Not worth it unless you already have that team. |

### Pros of Rust for this class of app

- One `Engine` for GUI, CLI, and Task Scheduler / launchd.
- Ports and adapters stay honest: core has no `~/Library` literals.
- FFI to CoreML/DirectML via a crate is ugly but **one** ugly, not two languages.
- No GC pauses in a long file walk.

### Cons

- Webview CSS is not AppKit. You will fight density and fonts.
- Async Rust plus a UI thread takes discipline (one engine mutex, don't block the webview).
- Debug symbols and link times are worse than Swift in Xcode.
- You still write a little Objective-C or `windows` crate code. Rust does not erase the OS.

KMP is what I would use if the *same* domain had to run in iOS and Android *as first-class clients* next year. For two desktop OSes and a CLI, Rust is the shorter path. If mobile later needs a native look, you can still keep the Rust kernel and put SwiftUI or Compose on top (UniFFI). That is a different product surface, not a Tauri checkbox.

## 5. Can Tauri plus Rust do Slack or ClickUp?

**A desktop client that looks like Slack?** Yes, with caveats.

**Slack or ClickUp as a company?** That is not a UI framework question. That is sync, search, presence, billing, and a fleet of services.

What Tauri is good at:

- Multi-window (Tauri 2).
- Deep OS integration: notifications, tray, file dialogs, protocol handlers.
- A big React tree for settings, lists, and editors.

Where you will hurt:

- **Huge virtualized lists** in the webview (100k DOM nodes). You virtualize, like you would on the web. Native `NSTableView` still wins for pathological lists.
- **Realtime** is your protocol (WebSocket, etc.), not Tauri. Rust can own the socket; React renders.
- **Collaboration CRDTs** belong in a library, not in IPC glue.
- **App Store / sandbox** is a policy problem. Tauri can ship outside the store, like most pro tools.

ClickUp and Slack stayed on Electron because they already had a web app and a web org. If your product *is* a website with a desktop wrapper, Electron is still the honest default. If the product is **local state plus OS APIs**, Tauri is the better shell.

I would not start Slack from zero in Tauri. I would start a **local-first** or **OS-heavy** desktop app in Tauri without blinking.

## 6. Mobile: yes you can, you probably should not ship the same app

Tauri 2 builds **iOS and Android**. Same React UI, same Rust crate, different webview. Plugins exist (share, some filesystem, camera). That is enough to put a **companion** on a phone: license status, a summary, a settings screen.

It is not enough to pretend the phone is a tiny Mac.

| | Desktop Tauri | Mobile Tauri |
|---|---------------|--------------|
| Maturity | Fine for a production utility | Newer. Plugin gaps. Store review will surprise you. |
| Background / schedule | launchd / Task Scheduler | iOS will fight a weekly job. You need native work or you drop the feature. |
| Files | App Support plus known tool paths | Sandbox, scoped storage. You do not walk another app's folder the way you do on a Mac. |
| Look | Acceptable if you design for webview | Feels like a website unless you spend real UI time. |
| Store | Notarize / Authenticode | Privacy forms, encryption export, background limits, IAP rules. |

**Same product as an OS-heavy desktop utility:** keep mobile a **smaller surface**, or skip it until desktop is signed and boring. Do not tell the team "one binary, three stores."

**CRUD / chat / dashboard that is already a web app:** mobile Tauri is in the same bucket as Capacitor. Viable. Not automatically better than React Native if mobile *is* the product.

**If mobile must feel native:** share **Rust via UniFFI**, UI in SwiftUI and Compose. You keep the kernel. You drop the fantasy of one webview everywhere.

That is the mobile half of the same trade: reuse the sidecar, do not clone the desktop contract.

## 7. On-device AI, Mac vs Windows: a stack that does not fork

Goal: optional better **sentences** on this machine. Classification and delete stay deterministic. If the model is missing or the GPU session will not start, show the rulebook copy and move on. No cloud round trip on scan.

**One model file, two execution providers.**

| OS | Runtime | If it fails |
|----|---------|-------------|
| macOS | ONNX Runtime, **CoreML** only | Catalog copy. Do not silently switch to CPU. |
| Windows | ONNX Runtime, **DirectML** only | Same. |

Do not ship Apple Foundation Models on Mac and a different story on Windows. You will debug two prompts, two failures, and a support matrix that looks like two products.

**Do not put ONNX Runtime `.dylib` / `.dll` in a download pack.** Link `ort` into the signed app. The download is **weights plus a manifest** (checksum, byte size, template list). Put it on object storage (R2 or S3). User taps Install, you show size, then stream, verify hash, unzip into Application Support. Scan never hits the network.

Keep the model small. A few MB of a **ranker over fixed templates** is enough to fill `{size}` and `{when}`. A 100MB+ instruction model is a second product: tokenizer, KV cache, hallucination, and CoreML vs DirectML drift. Save that for a later pack with a new `arch` field, still display-only.

Shape that stays honest:

```plaintext
features [1, F]  ->  logits [1, N]
Rust argmax, then fill a template from templates.json
If N != templates.len() or checksum fails -> catalog
```

Never let the model pick Trash. If you add a `junk_score`, it is a label on screen, not an input to the delete planner.

On a phone, the same pack is usually the wrong idea: thermals, store size, and you still must not classify from a model. Desktop first.

Trade here: **weaker, smaller, same-on-both-OS copy** vs a flashy OS LLM that only exists on one laptop.

## 8. Performance: what to measure, not what to brag about

Public "Tauri vs Electron" posts usually agree on **installer size** and **idle RAM**. Treat them as order-of-magnitude, not lab numbers.

| | Typical Electron utility | Tauri + system webview |
|---|--------------------------|------------------------|
| Installer | 80 to 200MB+ | tens of MB if you skip Chromium and skip a fat model |
| Idle RAM | often 150MB+ | often well under 100MB for a simple shell |
| File walk | depends on JS vs native | Rust walk is in the same league as C++/Swift |

What actually mattered for us:

- **Do not walk the whole home directory.** Walk known tool paths. The UI is not a Finder clone.
- One worker / one engine lock. Progress events to the webview. Cancel is a flag, not a second walker.
- Unload the ONNX session after idle (minutes, not seconds) so a weekly job does not keep a GPU context forever.
- Profile the webview for list jank before you rewrite Rust.

If your bottleneck is "SwiftUI would be 8ms faster on this table," you picked the wrong war. If the bottleneck is "Windows and Mac disagree on what is safe to delete," you picked the wrong architecture.

## 9. Database strategy

Desktop local state is still **SQLite**. One file, WAL, busy timeout so the GUI, CLI, and scheduled job can coexist.

Put it in the OS app-support directory, not next to the `.app` (that gets wiped on update).

```plaintext
macOS:    ~/Library/Application Support/<App>/state.sqlite
Windows:  %APPDATA%\<App>\state.sqlite
```

What belongs in SQLite:

- prefs (theme, toggles)
- last scan snapshot (cache, not source of truth)
- receipts for undo (item ids, trash tokens, not display titles as keys)
- a license blob if you verify offline

What does not:

- the rule catalog (ship YAML or similar **in the binary**, versioned with the release; do not download rules at scan time)
- the ONNX weights (files on disk, checksum in `pack.json`)

Skip Core Data, skip Realm, skip a local Postgres. You do not have a sync server in v1. If you add sync later, SQLite is still the local cache, not the opposite.

WAL plus a short busy timeout beats "we will use a mutex around the whole engine and hope." You still want that mutex for domain invariants; SQLite is for durability.

Mobile can use the same schema in the app sandbox. Do not pretend iCloud or Play backup is your sync story unless you designed it.

## 10. System design (patterns that survive a second OS)

![One engine, many entry points](/images/systems/tauri-hexagon-engine.svg)

### Hexagon

Core crate: domain, use cases, port traits. No `objc`, no `windows` crate, no `ort`. Platform crate: OS adapters, SQLite, model. Apps (desktop, CLI, later a mobile shell) only construct adapters and call `Engine`.

### One delete path

Plan, then execute. Partial failure writes a partial receipt. Restore uses OS Trash/Recycle tokens, not `mv` from a hidden folder you invented.

### Catalog over ML for class

New tool = a YAML file and process names, not a new crate.

### Fail closed

Model down, permission denied, process still running: skip or catalog, never "best effort delete."

This is ordinary staff stuff. The mistake is treating Windows as a flavor flag in the scanner, or treating iOS as "the same binary with a smaller window."

## 11. CI/CD, signing, and a workflow that is not a demo

Build **on GitHub Actions**, not on a laptop, if you care about Windows. Use `macos-latest` and `windows-latest`. First ONNX/ORT compile on a runner will download native libs; budget 20 to 40 minutes the first time, not 5.

Unsigned is fine for internal testers. Public Mac needs **Developer ID + notarize**. Public Windows needs **Authenticode** (EV if you want SmartScreen to calm down). Those are calendar items, not Tauri features.

Mobile, if you ever add it, is **Xcode + Play** on top of this, not a third job you copy-paste from `tauri build`. Treat it as a later pipeline.

![Desktop release on GitHub Actions](/images/systems/tauri-desktop-release.svg)

Sketch of a real desktop workflow (names are examples):

```yaml
name: release
on:
  push:
    tags: ["v*"]

jobs:
  macos:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npm ci
        working-directory: apps/desktop
      - run: npm run tauri build
        working-directory: apps/desktop
        env:
          APPLE_CERTIFICATE: ${{ secrets.APPLE_CERTIFICATE }}
          APPLE_ID: ${{ secrets.APPLE_ID }}
          # apple-action / tauri-action: wire notarize here

  windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npm ci
        working-directory: apps/desktop
      - run: npm run tauri build
        working-directory: apps/desktop
        # Authenticode: signtool after NSIS, or tauri-action signing
```

`tauri.conf.json` is where bundle id, NSIS vs MSI, and macOS minimum version live. Keep **createUpdaterArtifacts** off until you have a signed update server. Unsigned auto-update is how you teach users to ignore Gatekeeper.

### Config vs secrets

| In git | In CI secrets |
|--------|---------------|
| bundle id, window size, NSIS current-user | Apple cert, Apple ID, notarize password |
| public verifying key for licenses | signing certs, R2 keys for packing models |

Do not bake a model URL that requires a secret. Public HTTPS plus sha256 in the app is enough for a first pack.

### Local loop

```bash
cd apps/desktop
npm install
npm run tauri dev
```

Rust rebuilds on change; the webview reloads. That is the loop that makes Tauri cheaper than two Xcode/Visual Studio solutions.

## 12. Checklist

Before you take this stack to a design review:

1. The product is **OS APIs plus a rulebook**, not a website in a window. If it is a website, stay on Electron.
2. Risk logic lives in one Rust `Engine`. GUI, CLI, and launchd / Task Scheduler cannot invent a second delete path.
3. Core crate has **no** `objc`, `windows`, or `ort`. Platform adapters are constructed at the edge.
4. Delete is **plan, then execute**. Partial failure writes a partial receipt. Restore uses OS Trash / Recycle tokens.
5. On-device AI is an optional pack on the same ONNX Runtime: CoreML on Mac, DirectML on Windows, checksum, fail to catalog copy. The model never picks Trash.
6. SQLite lives in app support, WAL on, receipts for undo. Rules ship in the binary.
7. CI builds both desktop OS. Public Mac is Developer ID + notarize. Public Windows is Authenticode. Updater stays off until the update server is signed.
8. Mobile is optional reuse of the sidecar, not the Mac file walker in a pocket.

If your app is a website in a window, stay on Electron (and maybe Capacitor on phones). If your app is OS APIs plus a rulebook, Tauri and Rust is the desktop stack I would take to a design review without apologizing. Mobile waits until that story is true.
