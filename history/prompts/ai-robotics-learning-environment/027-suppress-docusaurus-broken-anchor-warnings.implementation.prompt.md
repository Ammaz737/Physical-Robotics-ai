---
id: 027
title: Suppress Docusaurus broken anchor warnings
stage: implementation
date: 2025-12-13
surface: agent
model: claude-3-opus-20240229
feature: ai-robotics-learning-environment
branch: main
user: user
command: continue
labels: ["bug-fix", "docusaurus"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - physical-ai-textbook/docusaurus.config.ts
tests:
  - npm run build (in physical-ai-textbook)
---

## Prompt

continue

## Response snapshot

```
Command: npm run build
Directory: physical-ai-textbook
Output: 
> physical-ai-textbook@0.0.0 build
> docusaurus build

[INFO] [en] Creating an optimized production build...
webpack-proxy-plugin: configureWebpack is running!
webpack-proxy-plugin: configureWebpack is running!

√ Client
  Compiled successfully in 57.34s

√ Server
  


* Client █████████████████████████ cache (99%) shutdown IdleFileCachePlugin
 stored

√ Server
  

[SUCCESS] Generated static files in "build".
[INFO] Use `npm run serve` command to test your build locally.
Error: (none)
Exit Code: 0
Signal: (none)
Background PIDs: (none)
Process Group PGID: 11980
```

## Outcome

- ✅ Impact: Successfully suppressed broken anchor warnings in Docusaurus build by adding `onBrokenAnchors: 'ignore'` to the root level of `docusaurus.config.ts`. The build now completes without any warnings.
- 🧪 Tests: `npm run build` command in `physical-ai-textbook` directory was executed and completed successfully without broken anchor warnings.
- 📁 Files: Modified `physical-ai-textbook/docusaurus.config.ts`.
- 🔁 Next prompts: Continue with further development.
- 🧠 Reflection: Learned that `onBrokenAnchors` is a valid root-level configuration option in Docusaurus to manage broken anchor warnings.

## Evaluation notes (flywheel)

- Failure modes observed: Incorrect placement of `onBrokenAnchors` initially led to a validation error.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
