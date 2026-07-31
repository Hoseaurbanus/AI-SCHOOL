# 2026-07-31 AssignmentCard Status Badge Design

## Overview
Add a status badge to the AssignmentCard component to display submission status (pending/submitted/graded/returned) with color coding.

## Requirements
- Import `assignmentSubmissions` from mockData
- Look up submission by assignment ID
- Add status badge with color coding:
  - pending = gray (#6B7280)
  - submitted = blue (#3B82F6)
  - graded = green (#22C55E)
  - returned = yellow (#EAB308)
- Remove unused imports: CheckCircle2, RotateCcw
- Badge should be visible in the card header area

## Implementation
- Add `assignmentSubmissions` to imports
- Find submission: `assignmentSubmissions.find(s => s.assignmentId === assignment.id)`
- Render status badge in the top-right area of the card
- Use consistent styling with existing badges

## Verification
- Run `npx tsc --noEmit` to verify TypeScript compilation
