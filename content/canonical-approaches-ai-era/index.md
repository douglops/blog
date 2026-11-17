+++
title = "cannonical approaches in the ai era"
date = 2026-11-17
authors = ["Douglas"]
[taxonomies]

[extra]
+++

---

Recently I was reading on Heitor Gouvêa’s core takeaway from Nubank - [that security vulnerabilities and maintenance bottlenecks hide in **the cost of variation**](https://www.linkedin.com/pulse/abordagens-can%C3%B4nicas-o-que-aprendi-nubank-sobre-resolver-gouv%C3%AAa-auwae/) - and noticed that it became an existential problem in the AI era. This text are my notes, with a few extra thoughts on how to apply canonical principles to internal AI tooling.

---
Across industries, the recurring pitch among C-level executives is that AI will make employees more productive. But the reality is that AI makes employees more **autonomous**. 

When motivated employees use AI to build internal tools, scripts, and agents ("vibe coding"), variation explodes overnight. Instead of three teams picking different HTTP libraries over a year, fifty people spin up bespoke apps in a weekend, each missing cross-cutting concerns like authentication, secret management, SSRF protection, and audit logging, and worse - they seldom host their code a private repository or document it. The result is a sprawling, unmaintained, and insecure internal AI ecosystem at the mercy of the employee's endpoints security posture, holding organizational data at risk (most of the time).

Banning AI builders only drives usage underground into "Shadow AI." To preserve employee agency while keeping security and tech debt under control, the canonical principle must be applied by turning the central architecture into a **paved road**: make the secure, standardized path the fastest way for both humans and LLMs to ship.

To keep the discussion concrete, I’ll focus on three canonical approaches to internal AI tooling:

## 1. Centralized Architectures (The Paved Road)

Rather than auditing every individual AI-generated app, centralize the infrastructure primitives that every tool has to touch:

* **Unified AI Gateway:** Route all internal LLM traffic through a single proxy (e.g., LiteLLM, Portkey, or Kong AI Gateway). Instead of teams managing raw OpenAI/Anthropic keys, the gateway enforces rate limits, cost attribution, audit logging, and automated PII/secret redaction in one canonical place.
* **Canonical Scaffolding & Repo Context:** Give employees pre-baked starter templates (via Backstage, Cookiecutter, or internal GitHub templates) that already include SSO, database connectors, and structured logging. Pair these templates with organization-wide AI instruction files (`CLAUDE.md`, `.cursorrules`, or Copilot instructions) so that when an employee prompts an AI to "add a new endpoint," the AI automatically generates code using your canonical libraries and security patterns.
* **Governed Tool & MCP Registry:** Employees frequently build brittle glue code to connect AI tools to Slack, Jira, Snowflake, or internal APIs. Provide a centralized registry of vetted connectors or Model Context Protocol (MCP) servers so builders plug into pre-approved, rate-limited integrations rather than writing custom scrapers or API clients.

## 2. Security Guardrails for High-Agency Builders

When non-security engineers - or non-engineers - build tools with AI, security cannot rely on code review alone. Enforce invariants at the runtime layer:

* **Identity-Bound Execution (No Static Secrets):** Never issue shared service-account keys for internal AI tools. Require apps to use OAuth/OIDC "on-behalf-of" flows so every database query or API call executes strictly with the permissions of the human currently using the tool. An AI app cannot leak data the user isn't already authorized to see.
* **Isolated Runtime & Egress Control:** Deploy employee-built tools to a single internal PaaS (like Cloud Run, internal Kubernetes namespaces, or microVM sandboxes like E2B) with strict network egress policies. Blocking arbitrary outbound requests at the network layer neutralizes SSRF and accidental data exfiltration, even if the AI wrote flawed application code.
* **Automated CI/CD Gates:** Treat deployment URLs as a privilege. Even a prototype built in an afternoon should pass automated secret scanning (e.g., Gitleaks), dependency checks, and basic SAST before receiving an internal DNS route.

## 3. Containing Tech Debt: The Tiered Graduation Model

Tech debt happens when a quick AI experiment quietly becomes mission-critical without anyone owning it. Establish explicit lifecycle tiers with built-in expiration dates so experimental code doesn't calcify:

| Lifecycle Tier | Intended Scope | Canonical Requirements | Tech Debt Control |
| --- | --- | --- | --- |
| **Tier 1: Sandbox** | Personal productivity & throwaway prototypes | Runs via AI Gateway; user-scoped OAuth only; zero persistent shared DBs | **30-day TTL:** Infrastructure auto-pauses or deletes unless explicitly renewed |
| **Tier 2: Squad Utility** | Shared workflows within a single team | Must use the canonical starter template, SSO, and central logging; named team owner | **Quarterly ownership check:** Orphaned tools without an active team owner are archived |
| **Tier 3: Canonical** | Cross-org tools or customer-adjacent systems | Full engineering review, SLOs, automated testing, and standard CI/CD | **Consolidation:** Platform/Core teams absorb the prototype and deprecate duplicate clones |

By separating **freedom to prototype** (Tier 1) from **permission to persist** (Tiers 2 and 3), you let employees experiment at full speed while ensuring that only validated, standardized software accumulates in your long-term codebase.

Are you currently trying to rein in internal AI sprawl at your organization, and if so, is the bigger pain point right now security exposure (keys, data access) or unmaintained tool proliferation?

Mapping these canonical approaches to your internal AI strategy can help you answer that question and prioritize the right guardrails.