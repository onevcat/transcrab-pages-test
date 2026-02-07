---
title: 'Continuous AI in practice: What developers can automate today with agentic CI'
date: '2026-02-07T00:31:09.712Z'
sourceUrl: >-
  https://github.blog/ai-and-ml/generative-ai/continuous-ai-in-practice-what-developers-can-automate-today-with-agentic-ci/
lang: source
---
Software engineering has always included work that’s repetitive, necessary, and historically difficult to automate. This isn’t because it lacks values, but because it resists deterministic rules. 

Continuous integration (CI) solved part of this by handling tests, builds, formatting, and static analysis—anything that can be described with deterministic rules. CI excels when correctness can be expressed unambiguously: a test passes or fails, a build succeeds or doesn’t, a rule is violated or isn’t. 

But CI is intentionally limited to problems that can be reduced to heuristics and rules. 

For most teams, the hardest work isn’t writing code. It’s everything that requires judgment around that code: reviewing changes, keeping documentation accurate, managing dependencies, tracking regressions, maintaining tests, monitoring quality, and responding to issues that only surface after code ships. 

But a lot of engineering work goes into work that requires interpretation, synthesis, and context, rather than deterministic validation. And an increasing share of engineering tasks fall into a category CI was never designed to handle: work that depends on understanding intent. 

“Any task that requires judgment goes beyond heuristics,” says Idan Gazit, head of GitHub Next, which works on research and development initiatives.

> Any time something can’t be expressed as a rule or a flow chart is a place where AI becomes incredibly helpful.
> 
> Idan Gazit, head of GitHub Next

This is why GitHub Next has been exploring a new pattern: [Continuous AI](https://githubnext.com/projects/continuous-ai/), or background agents that operate in your repository the way CI jobs do, but only for tasks that require reasoning instead of rules.

## Why CI isn’t enough anymore

CI isn’t failing. It’s doing exactly what it was designed to do. 

CI is designed for binary outcomes. Tests pass or fail. Builds succeed or don’t. Linters flag well-defined violations. That works well for rule-based automation.

But many of the hardest and most time-consuming parts of engineering are judgment-heavy and context-dependent. 

Consider these scenarios: 

*   A docstring says one thing, but the implementation says another.
*   Text passes accessibility linting but is still confusing to users.
*   A dependency adds a new flag, altering behavior without a major version bump.
*   A regex is compiled inside a loop, tanking performance in subtle ways.
*   UI behavior changes are only visible when interacting with the product.

These problems are about whether intent still holds. 

“The first era of AI for code was about code generation,” Idan explains. “The second era involves cognition and tackling the cognitively heavy chores off of developers.”

This is the gap Continuous AI fills: not more automation, but a different class of automation. CI handles deterministic work. Continuous AI applies where correctness depends on reasoning, interpretation, and intent. 

## What Continuous AI actually means

Continuous AI is not a new product or CI replacement. Traditional CI remains essential. 

Continuous AI is a pattern:

**Continuous AI = natural-language rules + agentic reasoning, executed continuously inside your repository.**

In practice, Continuous AI means expressing in plain language what should be true about your code, especially when that expectation cannot be reduced to rules or heuristics. An agent then evaluates the repository and produces artifacts a developer can review: suggested patches, issues, discussions, or insights.

Developers rarely author agentic workflows in a single pass. In practice, they collaborate with an agent to refine intent, add constraints, and define acceptable outputs. The workflow emerges through iteration, not a single sentence. 

For example: 

*   “Check whether documented behavior matches implementation, explain any mismatches, and propose a concrete fix.”
*   “Generate a weekly report summarizing project activity, emerging bug trends, and areas of increased churn.”
*   “Flag performance regressions in critical paths.”
*   “Detect semantic regressions in user flows.”

These workflows are not defined by brevity. They combine intent, constraints, and permitted outputs to express expectations that would be awkward or impossible to encode as deterministic rules. 

“In the future, it’s not about agents running in your repositories,” Idan says. “It’s about being able to presume you can cheaply define agents for anything you want off your plate permanently.”

> Think about what your work looks like when you can delegate more of it to AI, and what parts of your work you want to retain: your judgment, your taste.
> 
> Idan Gazit, head of GitHub Next

## Guardrails by design: Permissions and Safe Outputs

In our work, we define agentic workflows with safety as a first principle. By default, agents operate with read-only access to repositories. They cannot create issues, open pull requests, or modify content unless explicitly permitted. 

We call this **Safe Outputs**, which provides a deterministic contract for what an agent is allowed to do. When defining a workflow, developers specify exactly which artifacts an agent may produce, such as opening a pull request or filing an issue, and under what constraints. 

Anything outside those boundaries is forbidden. 

This model assumes agents can fail or behave unexpectedly. Outputs are sanitized, permissions are explicit, and all activity is logged and auditable. The blast radius is deterministic. 

This isn’t “AI taking over software development.” It’s AI operating within guardrails developers explicitly define. 

## Why natural language complements YAML

As we’ve developed this, we’ve heard a common question: why not just extend CI with more rules? 

When a problem can be expressed deterministically, extending CI is exactly the right approach. YAML, schemas, and heuristics remain the correct tools for those jobs. 

But many expectations cannot be reduced to rules without losing meaning. 

Idan puts it simply: “**There’s a larger class of chores and tasks we can’t express in heuristics.**”

A rule like “whenever documentation and code diverge, identify and fix it” cannot be expressed in a regex or schema. It requires understanding semantics and intent. A natural-language instruction can express that expectation clearly enough for an agent to reason over it. 

Natural language doesn’t replace YAML, but instead complements it. CI remains the foundation. Continuous AI expands automation into commands CI was never designed to cover. 

## Developers stay in the loop, by design

Agentic workflows don’t make autonomous commits. Instead, they can create the same kinds of artifacts developers would (pull requests, issues, comments, or discussions) depending on what the workflow is permitted to do.

Pull requests remain the most common outputs because they align with how developers already review and reason about change. 

“The PR is the existing noun where developers expect to review work,” Idan says. “It’s the checkpoint everyone rallies around.”

That means:

*   Agents don’t merge code
*   Developers retain full control
*   Everything is visible and reviewable

Developer judgment remains the final authority. Continuous AI helps scale that judgment across a codebase. 

## How GitHub Next is experimenting with these ideas

The [GitHub Next prototype](https://githubnext.github.io/gh-aw/) (or you can find the repository at [gh aw](https://github.com/githubnext/gh-aw)) uses a deliberately simple pattern:

1.  Write an agentic workflow
2.  Compile it into a GitHub Action
3.  Push it
4.  Let an agent run on any GitHub Actions trigger (pull requests, pushes, issues, comments, or schedules) 

Nothing is hidden; everything is transparent and visible.

“You want an action to look for style violations like misplaced brackets, that’s heuristics,” Idan explains. “But when you want deeper intent checks, you need AI.” 

## What Continuous AI can automate today

These aren’t theoretical examples. GitHub Next has tested these patterns in real repositories.

### 1\. Fix mismatches between documentation and behavior

This is one of the hardest problems for CI because it requires understanding *intent*.

An agentic workflow can:

*   Read a function’s docstring
*   Compare it to the implementation
*   Detect mismatches
*   Suggest updates to either the code or the docs
*   Open a pull request

Idan calls this one of the most meaningful categories of work Continuous AI can address: “You don’t want to worry every time you ship code if the documentation is still right. That wasn’t possible to automate before AI.”

### 2\. Generate ongoing project reports with reasoning

Maintainers and managers spend significant time answering the same questions repeatedly: What changed yesterday? Are bugs trending up or down? Which parts of the codebase are most active? 

Agentic workflows can generate recurring reports that pull from multiple data sources (issues, pull requests, commits, and CI results), and apply reasoning on top. 

For example, an agent can: 

*   Summarize daily or weekly activity 
*   Highlight emerging bug trends
*   Correlate recent changes with test failures
*   Surfaces areas of increased churn

The value isn’t the report itself. It’s the synthesis across multiple data sources that would otherwise require manual analysis. 

### 3\. Keep translations up to date automatically

Anyone who has worked with localized applications knows the pattern: Content changes in English, translations fall behind, and teams batch work late in the cycle (often right before a release).

An agent can:

*   Detect when English text changes
*   Re-generate translations for all languages
*   Open a single pull request containing the updates

The workflow becomes continuous, not episodic. Machine translations might not be perfect out of the box, but having a draft translation ready for review in a pull request makes it that much easier to engage help from professional translators or community contributors.

### 4\. Detect dependency drift and undocumented changes

Dependencies often change behavior without changing major versions. New flags appear. Defaults shift. Help output evolves.

In one demo, an agent:

*   Installed dependencies
*   Inspected CLI help text
*   Diffed it against previous days
*   Found an undocumented flag
*   Filed an issue before maintainers even noticed

This requires semantic interpretation, not just diffs, which is why classical CI cannot handle it. 

“This is the first harbinger of the new phase of AI,” Idan says. “We’re moving from generation to reasoning.”

### 5\. Automated test-coverage burn down

In one experiment:

*   Test coverage went from ~5% to near 100%
*   1,400+ tests were written
*   Across 45 days
*   For about ~$80 worth of tokens

And because the agent produced small pull requests daily, developers reviewed changes incrementally.

### 6\. Background performance improvements

Linters and analyzers don’t always catch performance pitfalls that depend on understanding the code’s intent.

Example: compiling a regex inside a function call so it compiles on every invocation.

An agent can:

*   Recognize the inefficiency
*   Rewrite the code to pre-compile the regex
*   Open a pull request with an explanation

Small things add up, especially in frequently called code paths.

### 7\. Automated interaction testing (using agents as deterministic play-testers)

This was one of the more creative demos from Universe: using agents to play a simple platformer game thousands of times to detect UX regressions.

Strip away the game, and the pattern is widely useful:

*   Onboarding flows
*   Multi-step forms
*   Retry loops
*   Input validation
*   Accessibility patterns under interaction

Agents can simulate user behavior at scale and compare variants.

## How to build your first agentic workflow

Developers don’t need a new CI system or separate infrastructure to try this. The GitHub Next prototype (gh aw) uses a simple pattern:

**1\. Write a natural-language rule in a Markdown file**

For example:

```plaintext
---
on: daily
permissions: read
safe-outputs:
  create-issue:
    title-prefix: "[news] "
---
Analyze the recent activity in the repository and:
- create an upbeat daily status report about the activity
- proviate an agentic task description to improve the project based on the activity.
Create an issue with the report.
```

**2\. Compile it into an action**

```plaintext
gh aw compile daily-team-status
```

This generates a GitHub Actions workflow.

**3\. Review the YAML**

Nothing is hidden. You can see exactly what the agent will do.

**4\. Push to your repository**

The agentic workflow begins executing in response to repository events or on a schedule you define, **just like any other action**.

**5\. Review the issue it creates**

## Patterns to watch next

While still early, several trends are already emerging in developer workflows:

**Pattern 1: Natural-language rules will become a part of automation**

Developers will write short English rules that express intent:

*   “Keep translations current”
*   “Flag performance regressions”
*   “Warn on auth patterns that look unsafe”

**Pattern 2: Repositories will begin hosting a fleet of small agents**

Not one general agent, but many small ones with each responsible for one chore, one check, or one rule of thumb.

**Pattern 3: Tests, docs, localization, and cleanup will shift into “continuous” mode**

This mirrors the early CI movement: Not replacing developers, but changing when chores happen from “when someone remembers” to “every day.”

**Pattern 4: Debuggability will win over complexity**

Developers will adopt agentic patterns that are transparent, auditable, and diff-based—not opaque systems that act without visibility.

## What developers should take away

“Custom agents for offline tasks, that’s what Continuous AI is,” Idan says. “Anything you couldn’t outsource before, you now can.”

**More precisely: many judgment-heavy chores that were previously manual can now be made continuous.**

This requires a mental shift, like moving from owning files to streaming music.

“You already had all the music,” Idan says. “But suddenly the player is helping you discover more.”

## Start with one small workflow

Continuous AI is not an all-or-nothing paradigm. You don’t need to overhaul your pipeline. Start with something small:

*   Translate strings
*   Add missing tests
*   Check for docstring drift
*   Detect dependency changes
*   Flag subtle performance issues

Each of these is something agents can meaningfully assist with today.

Identify the recurring judgment-heavy tasks that quietly drain attention, and make those tasks continuous instead of episodic.

If CI automated rule-based work over the past decade, Continuous AI may do the same for select categories of judgment-based work, when applied deliberately and safely.

## Written by

 ![GitHub Staff](https://avatars.githubusercontent.com/u/9919?v=4&s=200)

GitHub is the world's best developer experience and the only AI-powered platform with security incorporated into every step, so you can innovate with confidence.
