---
slug: "aws-cli-named-profiles-multi-iam"
title: "AWS CLI named profiles: switching IAM users without shooting the wrong account"
date: "2026-09-16"
excerpt: "One IAM user, one key pair, one named profile. How AWS_PROFILE works, why leftover env keys win, and the sts habit that stops wrong-account ECR pushes."
tags:
  - AWS
  - AWS CLI
  - IAM
  - Profiles
  - Credentials
  - ECR
  - DevOps
featured: true
---

Working across more than one AWS IAM user is normal: sandbox vs client, personal vs company, read-only vs deploy. The AWS CLI does that with **named profiles**. Most “wrong account” failures are not mysterious AWS behavior - they are a wrong profile, leftover environment keys, or Console and CLI pointing at different places.

The model is simple once you see it:

**one IAM user -> one access key pair -> one named profile -> select with `AWS_PROFILE` or `--profile` -> prove it with `sts get-caller-identity`.**

Region is a separate dial. Confirm that too.

## Why profiles exist

Every CLI call needs three things:

1. **Who you are** - IAM user or role 
2. **Which account** - the 12-digit account ID 
3. **Which region** - e.g. `ap-southeast-1`

IAM users live inside accounts. Each can have access keys. Those keys should not be shared, and you should not overwrite a single global credential every time you change jobs.

A **profile** is a named bundle of credentials plus optional defaults (region, output format). You pick a profile per shell or per command. The CLI signs requests as that identity.

| Profile name | IAM user | Account | Use |
| :--- | :--- | :--- | :--- |
| `default` | personal / sandbox | Account A | casual fallback |
| `cloudsol_devops_engineer` | same name as the user | Account B | client / prod ops |
| `alice_admin` | `alice` | Account C | another team |

Name the profile after the IAM username. Then “who am I?” stays obvious when you stare at `echo $AWS_PROFILE` at 1 a.m.

## Two files under `~/.aws`

### `credentials` - secrets only

Section name equals profile name. No `profile` prefix.

```ini
[default]
aws_access_key_id = AKIA................
aws_secret_access_key = ........................................

[cloudsol_devops_engineer]
aws_access_key_id = AKIA................
aws_secret_access_key = ........................................
```

### `config` - non-secrets

Region, output, SSO, assume-role chains. Named profiles need the `profile` prefix. `default` does not.

```ini
[default]
region = ap-southeast-1
output = json

[profile cloudsol_devops_engineer]
region = ap-southeast-1
output = json

[profile alice_admin]
region = us-east-1
output = json
```

Keep credentials private (`chmod 600` is a good habit). Never commit either file. Never paste secrets into tickets or chat.

## Create a profile for a new IAM user

1. In the **correct** account console: IAM > Users > create user > attach least-privilege policies > Security credentials > Create access key > **CLI**. Save the secret once; you will not see it again.
2. On your laptop:

```bash
aws configure --profile cloudsol_devops_engineer
```

Fill in key, secret, region, output. That writes both files.

3. Confirm:

```bash
aws configure list-profiles
aws configure list --profile cloudsol_devops_engineer
```

## How to select the user

### Session (best for a stretch of work)

```bash
export AWS_PROFILE=cloudsol_devops_engineer
echo "$AWS_PROFILE"
```

Every `aws` command in that shell uses it until you change or unset it.

```bash
unset AWS_PROFILE
```

After unset, the CLI falls back to `default` if that profile exists.

### One command

```bash
aws s3 ls --profile cloudsol_devops_engineer
aws ec2 describe-instances --profile alice_admin --region us-east-1
```

### Two terminals

Leave each shell on a different profile. Profiles are per process. They do not fight.

## The command you should run constantly

```bash
aws sts get-caller-identity
```

```json
{
  "UserId": "AIDAEXAMPLEID",
  "Account": "422766738122",
  "Arn": "arn:aws:iam::422766738122:user/cloudsol_devops_engineer"
}
```

| Field | Read it as |
| :--- | :--- |
| `Arn` | Exact user or role |
| `Account` | Exact account ID |
| `UserId` | Internal principal ID |

Short forms:

```bash
aws sts get-caller-identity --query Arn --output text
aws sts get-caller-identity --query Account --output text
aws sts get-caller-identity --profile cloudsol_devops_engineer
```

**Habit:** before anything that deletes, pushes images, or touches security groups, run `get-caller-identity` and check **both** user and account.

## What wins when several credentials are set

Rough priority, highest first:

1. Env vars: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` if present 
2. Profile: `--profile`, or `AWS_PROFILE` / `AWS_DEFAULT_PROFILE` 
3. The `default` profile in the credentials file 
4. Instance / container / SSO / role chains on servers 

### Trap: leftover env keys

If you once did:

```bash
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
```

those **override** `AWS_PROFILE`. You think you switched. You did not.

```bash
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
export AWS_PROFILE=cloudsol_devops_engineer
aws sts get-caller-identity
aws configure list
```

`aws configure list` shows whether the key and region came from env or from a file. Use it when the story feels wrong.

## Region is independent of identity

Ways to set it:

1. Profile block in `~/.aws/config` 
2. `export AWS_REGION=ap-southeast-1` (or `AWS_DEFAULT_REGION`) 
3. `--region ap-southeast-1` on one command 

```bash
export AWS_PROFILE=cloudsol_devops_engineer
export AWS_REGION=ap-southeast-1
aws ec2 describe-instances
```

Console and CLI must match on **account and region**. Resources in Singapore will not appear if the Console region picker is still on Virginia.

## Day-to-day loop

**Start:**

```bash
export AWS_PROFILE=cloudsol_devops_engineer
export AWS_REGION=ap-southeast-1
aws sts get-caller-identity
```

**Switch:**

```bash
export AWS_PROFILE=alice_admin
aws sts get-caller-identity
```

**One-off without changing the session:**

```bash
aws iam list-users --profile alice_admin
```

**Hygiene at the end of a session (optional):**

```bash
unset AWS_PROFILE
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
```

## Cross-account reality check

An IAM user in account `111111111111` does not become account `222222222222` by changing region. Profiles map to **keys of a specific user in a specific account**.

For two accounts you usually have either:

- two IAM users -> two profiles, or 
- one user that **assumes a role** in the other account (`role_arn` + `source_profile` in config)

For most laptop multi-client setups, **one profile per IAM user** stays the low-drama path.

## Where this bites: Docker + ECR

ECR registries are account-scoped:

```text
<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
```

The login password must come from a principal **in that same account**:

```bash
export AWS_PROFILE=cloudsol_devops_engineer

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
REGION=ap-southeast-1

aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin \
    "${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com"
```

Log in with Profile A (account `9566…`) and push to a registry hostname for account `4227…`, and you get authorization / “no basic auth credentials” errors that look like Docker problems. They are account mismatches.

Align all three:

1. `AWS_PROFILE` 
2. Account from `sts` 
3. Account ID in the ECR hostname 

## Console vs CLI when something “is missing”

| Check | CLI | Console |
| :--- | :--- | :--- |
| Identity | `aws sts get-caller-identity` | Top-right account name / ID |
| Region | profile / `AWS_REGION` / `--region` | Top-right region menu |
| User | ARN ends with `/user/NAME` | Correct IAM login or federated role |

Same account + same region. A correct profile does not help if the browser is still on another account.

## Security habits worth keeping

1. Prefer **named profiles** for anything important. Keep `default` empty, sandbox-only, or clearly labeled. 
2. **One human, one set of keys.** Do not share access keys. 
3. **Rotate** if a key shows up in chat, screenshots, tickets, or git history. 
4. Never commit `~/.aws/credentials`. 
5. Least privilege on the IAM user; split deploy vs read-only when it helps. 
6. Prefer **SSO / temporary credentials** when the org supports it - same profile idea, shorter-lived secrets.

### Optional: SSO profiles

```bash
aws configure sso --profile company_devops
aws sso login --profile company_devops
export AWS_PROFILE=company_devops
aws sts get-caller-identity
```

You still switch with `AWS_PROFILE`. Only how credentials are obtained changes.

## Troubleshooting

| Symptom | Likely cause | Fix |
| :--- | :--- | :--- |
| Wrong account | Wrong profile or env keys overriding | `aws configure list`; unset env keys; set `AWS_PROFILE`; re-run `sts` |
| `Unable to locate credentials` | No profile / empty credentials | `aws configure --profile NAME` |
| Missing in Console | Wrong account or region in the browser | Match account ID + region to CLI |
| `AccessDenied` | Right user, thin IAM policy | Fix permissions for that user |
| ECR push auth errors | Login account ≠ registry account | Login with the profile that owns that account ID |
| Profile “ignored” | `AWS_ACCESS_KEY_ID` still set | Unset access key env vars |

## Cheat sheet

```bash
aws configure --profile MY_USER
aws configure list-profiles

export AWS_PROFILE=MY_USER
export AWS_REGION=ap-southeast-1
aws sts get-caller-identity

aws s3 ls --profile OTHER_USER

unset AWS_PROFILE
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN
aws configure list
```

## Closing

Multi-user CLI work stays boring when you treat identity as a deliberate switch, not ambient luck. Verify before anything that creates, deletes, or pushes. Most mystery failures shrink to: wrong profile, leftover env keys, or Console/CLI account-region mismatch.

Sibling note on AWS cost floors and Express Mode: [AWS cost floors: ALB, NAT, Express Mode, and free-tier traps](/ops/aws-cost-floors-alb-nat-express-mode-free-tier).
