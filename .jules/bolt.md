# Bolt's Journal - Critical Learnings

## 2026-09-18 - Batching DOM re-renders and single-pass metrics in vanilla JS apps

**Learning:** In a vanilla JavaScript app rendering dynamic DOM lists from state arrays:
1. Re-building entire table subtrees (`innerHTML = ''` followed by `appendChild` for each row) on every search input `input` event causes excessive DOM thrashing and CPU load when typing rapidly. Debouncing the search filter handler by 150ms reduces DOM builds from 1-per-keystroke to 1-per-pause while remaining imperceptible to the user.
2. Computing UI summary metrics using multiple sequential `.filter()` operations iterates over state arrays multiple times and allocates unnecessary intermediate arrays. Replacing them with a single O(N) pass reduces memory allocations and execution time.

**Action:** Always debounce continuous input events (like search/type-ahead) that trigger DOM table rebuilds, and aggregate array summary stats in a single pass.
