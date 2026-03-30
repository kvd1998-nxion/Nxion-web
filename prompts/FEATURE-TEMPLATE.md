# Feature Prompt Template
### How to use this file
1. Copy this file to `prompts/features/backlog/feature-{name}.md`
2. Fill in every section — incomplete prompts produce incomplete implementations
3. When approved and scoped, move the file to `prompts/features/ready/`
4. Paste the **Prompt for Claude Code** section directly into Claude Code to implement
5. After implementation is verified, update `requirements.md` with the new/changed FR entries
6. Archive or delete the feature file

---

# Feature: {Feature Name}

## Status
- [ ] Backlog — idea, not yet scoped
- [ ] Ready — scoped and approved, ready to implement
- [ ] Done — implemented and merged into requirements.md

**Requested by:** {name or role}
**Date added:** {YYYY-MM-DD}
**Target:** {release, sprint, or "unscheduled"}

---

## 1. Problem / Why
> What problem does this solve? What breaks or is missing today?
> Be specific — vague "improvements" rarely ship cleanly.

{Describe the user pain or business gap this addresses}

---

## 2. Goal / What Success Looks Like
> One or two sentences. What is true after this ships that isn't true today?

{Define done from the user's perspective}

---

## 3. Scope

### In scope
- {Bullet each thing that will be built or changed}

### Out of scope
- {Bullet each thing explicitly excluded — prevents scope creep}

---

## 4. Affected Features / Requirements
> Which existing Feature Requirements (FRs) in requirements.md does this change or extend?

| FR Reference | Change Type | Description |
|---|---|---|
| FR-{X.Y} | Update / New / Remove | {What changes} |

---

## 5. Affected Files
> List the files Claude Code will need to read and/or modify.
> This prevents the AI from making unguided assumptions.

**Read first (understand before changing):**
- `src/...`

**Create:**
- `src/...`

**Modify:**
- `src/...`

---

## 6. Design & Behaviour Notes
> Anything that isn't obvious from the goal statement.
> Include: UI behaviour, edge cases, data constraints, animation style, error states.

- {Note 1}
- {Note 2}

---

## 7. Acceptance Criteria
> Concrete, testable conditions. If you can't check it, it's not a criterion.

- [ ] {Criterion 1}
- [ ] {Criterion 2}
- [ ] `npm run build` passes with zero errors
- [ ] Feature renders correctly on mobile (320px), tablet (768px), and desktop (1024px)

---

## 8. Prompt for Claude Code
> Copy and paste this block directly into Claude Code when ready to implement.
> Fill in the blanks from the sections above before using.

```
Context:
- Project: nxion-web — static React SPA (Vite + React 19 + Tailwind v4 + Framer Motion)
- Styling: Tailwind v4 with @theme tokens in src/index.css. Key colours: navy #0A192F, electric #64FFDA, slate #8892B0
- All pages are lazy-loaded in src/App.jsx
- Scroll animations use Framer Motion whileInView with viewport={{ once: true }}
- New components go in src/components/ui/ (presentational) or src/components/layout/ (chrome)
- Read the files listed below before writing any code

Goal:
{Paste from Section 2}

Read these files first:
{Paste file list from Section 5}

Build:
{Paste in-scope bullets from Section 3}

Do not:
{Paste out-of-scope bullets from Section 3}

Acceptance criteria:
{Paste checklist from Section 7}

After implementing, run `npm run build` and confirm zero errors before finishing.
```
