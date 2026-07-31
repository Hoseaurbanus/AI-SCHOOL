# Phase 10: Portfolio — Implementation Plan

## Task Dependency Graph

| Task | Depends On | Reason |
|------|------------|--------|
| Task 1 | None | Types and mock data are foundational |
| Task 2 | Task 1 | Components need types and data |
| Task 3 | Task 1 | Components need types and data |
| Task 4 | Task 1 | Components need types and data |
| Task 5 | Tasks 2, 3, 4 | Page uses all three components |
| Task 6 | Tasks 1-5 | Final verification needs everything complete |

## Parallel Execution Graph

Wave 1 (Start immediately):
└── Task 1: Extend Types and Mock Data (no dependencies)

Wave 2 (After Wave 1 completes):
├── Task 2: Create PortfolioCard Component (depends: Task 1)
├── Task 3: Create SkillsSummary Component (depends: Task 1)
└── Task 4: Create CertificateShowcase Component (depends: Task 1)

Wave 3 (After Wave 2 completes):
└── Task 5: Rewrite Portfolio Page (depends: Tasks 2, 3, 4)

Wave 4 (After Wave 3 completes):
└── Task 6: Final Verification (depends: Tasks 1-5)

Critical Path: Task 1 → Task 2 → Task 5 → Task 6

## Agent Dispatch Summary

- **Wave 1:** 1 agent → Task 1
- **Wave 2:** 3 agents → Tasks 2, 3, 4
- **Wave 3:** 1 agent → Task 5
- **Wave 4:** 1 agent → Task 6

Total: 6 agent dispatches across 4 waves

## Task Details

### Task 1: Extend Types and Mock Data
**Description:** Add PortfolioProject and StudentSkill types to src/types.ts. Add portfolioProjects (4-5) and studentSkills (6-8) mock data arrays to src/data/mockData.ts.

### Task 2: Create PortfolioCard Component
**Description:** Create src/components/portfolio/PortfolioCard.tsx — project card with image, title, course, tags, AI score, status badge. Click to expand with code snippet.

### Task 3: Create SkillsSummary Component
**Description:** Create src/components/portfolio/SkillsSummary.tsx — grid of skills with level indicators (beginner/intermediate/advanced) and endorsement counts.

### Task 4: Create CertificateShowcase Component
**Description:** Create src/components/portfolio/CertificateShowcase.tsx — horizontal scroll of earned certificates with links to certificate page.

### Task 5: Rewrite Portfolio Page
**Description:** Rewrite src/pages/Portfolio.tsx with stats header, certificate showcase, skills summary, and project grid using the new components.

### Task 6: Final Verification
**Description:** Run npx tsc --noEmit and npm run build. Verify all files exist. No commits.
