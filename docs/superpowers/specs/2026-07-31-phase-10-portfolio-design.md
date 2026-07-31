# Phase 10: Portfolio — Design Spec

## Overview
The portfolio page showcases a student's completed projects, certificates, and skills. Currently it has hardcoded data. This phase makes it dynamic, pulling from assignment submissions, coding lab exercises, and certificates.

## Scope

### New Types
```typescript
export interface PortfolioProject {
  id: string;
  title: string;
  course: string;
  courseId: string;
  description: string;
  tags: string[];
  aiScore: number;
  date: string;
  status: 'completed' | 'in-progress';
  codeSnippet?: string;
  imageUrl?: string;
}

export interface StudentSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  endorsements: number;
}
```

### New Mock Data
- `portfolioProjects`: 4-5 projects from assignments/coding lab
- `studentSkills`: 6-8 skills with levels

### New Components
1. **PortfolioCard** (`src/components/portfolio/PortfolioCard.tsx`)
   - Project card with image, title, course, tags, AI score
   - Click to expand with code snippet
   - Status badge

2. **SkillsSummary** (`src/components/portfolio/SkillsSummary.tsx`)
   - Grid of skills with level indicators
   - Endorsement counts

3. **CertificateShowcase** (`src/components/portfolio/CertificateShowcase.tsx`)
   - Horizontal scroll of earned certificates
   - Links to certificate page

### Page Rewrite
- **Portfolio.tsx**: Dynamic page with:
  - Stats header (total projects, avg score, certificates earned)
  - Certificate showcase section
  - Skills summary section
  - Project grid with PortfolioCard components

## Files to Create/Modify
1. `src/types.ts` — Add PortfolioProject, StudentSkill
2. `src/data/mockData.ts` — Add portfolioProjects and studentSkills arrays
3. `src/components/portfolio/PortfolioCard.tsx` — New
4. `src/components/portfolio/SkillsSummary.tsx` — New
5. `src/components/portfolio/CertificateShowcase.tsx` — New
6. `src/pages/Portfolio.tsx` — Rewrite
