---
id: 1
title: Define Specification for Physical AI Textbook
stage: spec
date: 2025-12-07
surface: agent
model: gemini-pro
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: user
command: /sp.specify
labels: [spec, feature]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-physical-ai-textbook/spec.md
 - specs/001-physical-ai-textbook/checklists/requirements.md
tests:
 - none
---

## Prompt

---
description: Create or update the feature specification from a natural language feature description.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

The text the user typed after `/sp.specify` in the triggering message **is** the feature description. Assume you always have it available in this conversation even if it is not explicitly passed. For example, if the user typed `/sp.specify 