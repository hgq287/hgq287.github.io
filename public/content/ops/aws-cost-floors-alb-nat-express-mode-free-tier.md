---
slug: "aws-cost-floors-alb-nat-express-mode-free-tier"
title: "AWS cost floors: ALB, NAT, Express Mode, and free-tier traps"
date: "2026-09-04"
excerpt: "The bill is ALB + NAT, not the t3.small. What actually changes if you strip them, where ECS Express Mode lands, and why a $0 marketplace demo is a usage envelope."
tags:
  - AWS
  - ALB
  - NAT Gateway
  - ECS
  - Fargate
  - CloudFront
  - Cost optimization
  - Free Tier
featured: true
---

The cheap AWS trap is a false choice: a Kubernetes cluster you do not need, or a single VM you cannot sleep on.

The useful question is **total cost of ownership**: cloud bill, operational overhead, security boundary, and what breaks when the one box dies.

This note walks four layers of that question: a small EC2 bill, hardening a public origin, ECS Express Mode vs a pet host, and a serverless demo that stays near zero. Numbers are **On-Demand, Linux, 730-hour months**. The EC2 table uses **Asia Pacific (Singapore)** because that is where a `t3.small` actually lands near **$19**. Fargate unit prices below are **US East (N. Virginia)** from the public pricing page - treat them as a floor; Singapore is higher.

## Why the bill is $77, not $19

Five small containers or Next.js apps behind an **Application Load Balancer** and a **NAT Gateway** often look like this:

| Resource | What you are paying for | Monthly floor |
| :--- | :--- | :--- |
| EC2 `t3.small` | 2 vCPU burst, 2 GiB, On-Demand in `ap-southeast-1` (`$0.0264/hr`) | **~$19.27** |
| NAT Gateway | `$0.045/hr` plus `$0.045/GB` processed (both directions) plus internet egress | **~$32.85** before data |
| ALB | Hourly charge plus LCUs | **~$16-20** idle |
| Public IPv4 | `$0.005/hr` **per address**, including ALB and NAT IPs | **~$3.65 each** |

The **$77** headline undercounts. An internet-facing ALB in two AZs typically has **two** public IPv4s (~$7.30). The NAT Gateway has another (~$3.65). Before transfer, the real floor is closer to **$85-110**.

Two decisions are independent. Do not bundle them:

1. **Delete the NAT Gateway.** Put the instance in a public subnet, or keep it private and use **VPC endpoints** for S3, ECR, and SSM. That is the $33 line.
2. **Delete the ALB.** Routing, TLS, health checks, and drain move onto the host.

You can do (1) without (2). Doing (2) without (1) is usually a worse deal: NAT costs more than the ALB.

## What changes if you strip the ALB

Public subnet, no NAT, no ALB, one Elastic IP on the instance:

| Resource | Monthly |
| :--- | :--- |
| EC2 `t3.small` | ~$19.27 |
| 30 GB `gp3` | ~$2.40-$2.70 |
| Public IPv4 | ~$3.65 |
| ALB / NAT | $0 |
| **Floor** | **~$25-26** |

Architecturally:

- **Routing moves to the host.** Nginx (or Caddy) on the instance listens and fans out to the five containers.
- **One failure domain.** There is no target group to drain. Replacing the only container is how you get a brief **502**, not `nginx -s reload` itself - reload is graceful.
- **The origin is on the public internet.** Clients can hit the raw IP unless you lock the security group.

That $52 “saving” is real on the invoice. It is not free in ops: patching, disk, log rotation, and the 2 a.m. kernel panic are now yours. Two hours of that work in a month erases the cloud delta.

## Hardening a public EC2 origin

If the instance has a public IPv4, anyone who finds `1.2.3.4` can bypass the CDN. Defense in depth still works. It is **not** $0 if you turn on WAF.

```text
Internet -> CloudFront (+ optional WAF) -> security group (CloudFront prefix list) -> Nginx
```

### Edge: Shield Standard vs WAF

**AWS Shield Standard** is on by default and absorbs a lot of volumetric **L3/L4** noise at the edge. It does not replace application-layer filtering.

**AWS WAF** is extra: typically **$5 / web ACL + $1 / rule + ~$0.60 / million requests**, unless you are on a CloudFront flat-rate plan that bundles WAF. Put WAF on the distribution if you need path and rate rules. Do not list it as a free control.

### Network: CloudFront origin-facing prefix list

In the instance security group, allow the origin port **only** from the AWS-managed prefix list `com.amazonaws.global.cloudfront.origin-facing` (IPv6: `com.amazonaws.global.ipv6.cloudfront.origin-facing`). AWS keeps the ranges current.

**Quota trap:** that list has **weight 55**. A security group’s default quota is **60 rules**, so one prefix-list rule leaves **five** slots. Opening **80 and 443** from the list is **110** and needs a quota increase. Prefer **one** origin port, **443**.

This does not “drop pings.” Security groups deny ICMP unless you allow it. The prefix list only filters the TCP port you attach it to.

Set CloudFront’s origin HTTP/HTTPS port to match. **8080 works** if the distribution origin is configured for it. Default mental model is still 443.

### App: origin custom header

Add an origin custom header on the distribution (a shared secret). Require it on Nginx. Prefer `map`, not `if` in `server` / `location` - Nginx `if` is a known footgun.

```nginx
map $http_x_origin_secret $origin_ok {
    default 0;
    "your-secure-token-here" 1;
}

server {
    listen 443 ssl;

    location / {
        if ($origin_ok = 0) {
            return 403;
        }
        # proxy_pass to local containers…
    }
}
```

This is a handshake, not cryptography. Rotate it, do not log it, do not echo it on error pages. Pair it with the prefix list so the secret is not the only gate.

**Stronger 2025+ pattern:** [CloudFront VPC origins](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-vpc-origins.html). The EC2 (or ALB) origin stays private. There is no public IPv4 to discover. Use prefix lists + a header when the origin must remain public.

### Host: rate limits, Fail2ban, SSM

- Rate-limit sensitive paths in Nginx (`limit_req_zone`) **or**, better, at CloudFront / WAF using the **client** IP.
- **Fail2ban behind CloudFront is easy to get wrong.** The origin sees **CloudFront IPs**, not browsers. A naive jail bans edge nodes and black-holes your own site. If you jail on the host, use Nginx `real_ip` with CloudFront as trusted proxies and never ban those addresses. Prefer WAF rate rules on the first `X-Forwarded-For`.
- Close inbound **22**. Use **SSM Session Manager**: agent on the instance, IAM instance profile, outbound HTTPS to SSM (or VPC endpoints).

## ECS Express Mode vs a cheap EC2

**Amazon ECS Express Mode** (GA November 2025) is a real product. You give it a container image plus two IAM roles. It provisions **Fargate**, an **internet-facing ALB with HTTPS**, autoscaling, canary deploys, and a `*.ecs.<region>.on.aws` URL. There is **no Express Mode surcharge**. You pay Fargate + ALB + logs + transfer.

It can share **one ALB across up to 25** Express services in the same VPC via host-header rules. That is the cost win versus one ALB per service. It does **not** delete the ALB.

Default task size is **1 vCPU / 2 GB**. Always-on Linux/x86 in us-east-1 is about **$36/mo** compute (`$0.000011244` per vCPU-second + `$0.000001235` per GB-second). Add ALB (~$16-20) and two ALB public IPv4s (~$7). **One default Express service is ~$55-65/mo**, not $27-35.

The $30-shaped bill only appears with a **tiny** task (0.25 vCPU / 0.5 GB ≈ $9) plus one ALB, and often by ignoring IPv4. That is **one** service, not five containers packed onto a `t3.small`.

| Setup | Honest monthly floor | What you run |
| :--- | :--- | :--- |
| 5 containers on one public `t3.small` + Nginx | **~$25** | Shared kernel, one AZ, you patch |
| 1 Express service, 0.25 vCPU | **~$30-40** including ALB | One web/API |
| 1 Express service, default 1 vCPU / 2 GB | **~$55-65** | One web/API |
| 5 Express services, tiny tasks, shared ALB | **~$60-80** | Five isolated tasks |
| 5 Express services, default size, shared ALB | **~$200+** | Five default tasks |

Fargate isolation (Firecracker microVM per task) is the real product difference versus Docker on one EC2 kernel. The deploy API is `CreateExpressGatewayService` / `UpdateExpressGatewayService`, not “just `update-service`.” Express Mode is a **HTTPS web/API** shortcut. It is not every ECS workload.

**Verdict:** strip **NAT** first. Keep the **ALB** unless you accept a single-host origin and put CloudFront (ideally a VPC origin) in front. Use Express Mode when you want managed containers and can pay **ALB + per-task Fargate** as the floor.

## Marketplace scale is a different problem

A $25 box does not become Shopee by adding service names.

For a **large AWS marketplace**, the usual split is still right: CloudFront + WAF at the edge, containers on ECS or EKS, **OpenSearch** for faceted search, **ElastiCache** for sessions and hot counters, **Aurora** for money, **DynamoDB** for key-value, queues (**SQS / EventBridge / Kinesis**) so checkout is not a synchronous fan-out.

Treat that as a **template**, not a company diagram.

- **Klook** has a public AWS story: Aurora for orders/users, DynamoDB for personalization, ECS/Fargate for containers.
- **Shopee** flash-sale write-ups are a different stack: Go services, Redis Lua inventory paths, Kafka, TiDB. Do not paste an AWS reference architecture on that name.

Flash sales fail on **hot keys, inventory races, checkout fan-out, and connection pools**. Global Accelerator is optional. It is not the thing that saves you.

## A near-zero portfolio case study

For a demo that should **idle cheap**, skip always-on compute.

```text
CloudFront + S3 -> API Gateway HTTP API -> Lambda -> DynamoDB
                         ↑ Cognito
                         SQS (async work)
```

**$0.00 / month is a usage envelope**, not a promise. Put a billing alarm on day one.

| Piece | What is actually free |
| :--- | :--- |
| CloudFront | Pay-as-you-go Always Free is generous: **1 TB** data out + **10M** requests / month. Flat-rate Free plans are a different product (smaller allowance, some WAF/DNS bundled). |
| S3 | Not magically free forever. Stay inside Always Free / credits / plan storage credits. Use **Origin Access Control**, not a public website bucket. |
| Cognito | **10,000 MAU** on Lite/Essentials. **50,000 MAU is grandfathered** for older user pools (pre-22 Nov 2024). Plus tier has no free MAUs. SMS/email still bill via SNS/SES. |
| API Gateway | **Not Always Free.** Legacy 12-month 1M calls for older accounts. Newer accounts get **credits**, then pay. HTTP APIs are ~$1/million; REST ~$3.50/million. |
| Lambda | **Always Free:** 1M requests + 400,000 GB-seconds / month. |
| DynamoDB | **Always Free on provisioned Standard:** 25 GB + **25 RCU + 25 WCU**. The “~200M requests” line is marketing math from that capacity. **On-demand has no request free tier.** |
| SQS | **Always Free:** 1M requests / month. |
| EventBridge | **Management** events are free. **Custom** events are not “1M free.” Scheduler is a different product with its own free invocations. |

Hidden bills: Route 53 hosted zone, CloudWatch logs, WAF, a NAT if Lambda needs a VPC, and transfer once you leave Always Free.

This shape **scales to zero**. It is not a high-concurrency marketplace. Lambda + DynamoDB will still fall over on hot partitions, burst concurrency, and API/Cognito quotas. Say that in the write-up.

## Recap

- **NAT Gateway** is the first line to delete on a small AWS app. The ALB is not automatically next.
- A public EC2 origin needs CloudFront lock-down. Prefix list **weight 55**, one origin port, origin header, **no naive Fail2ban**. VPC origins if you can.
- **ECS Express Mode** is the right managed-container default for a small HTTPS API. Budget **ALB + Fargate per task**, not “$30 for five services.”
- Serverless is the right **portfolio** default. Treat **$0** as quotas plus an alarm, not as Shopee-scale.

GCP sibling of the same “cut noise and fixed cost before the origin” idea: [Cloud Run cost defense: Armor, CDN, and locked ingress](/ops/cloud-run-cost-defense-armor-cdn).
