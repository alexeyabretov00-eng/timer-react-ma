# Plan: Add “Remove Timer”

**Created:** 2026-02-19
**Status:** Ready for Atlas Execution

## Summary

Add a per-timer remove control that deletes a timer card from the list in `App`. Wire the remove event from `Timer` up to `App` where timers are stored, and ensure the `Timer` component clears any pending `setTimeout` when unmounted so removal never triggers “state update on unmounted component” warnings.

## Context & Analysis

**Relevant Files:**
- `src/App.tsx`: Owns the `timers` array; will gain a `removeTimer(id)` handler and pass `onRemove` into each `Timer` instance.
- `src/components/Timer/Timer.tsx`: Will accept an `onRemove` prop, render a remove control, and add unmount cleanup for `setTimeout`.
- `src/components/index.ts`: Will be updated only if a new `RemoveButton` component is exported.
- `src/components/ActionButton/ActionButton.tsx`: Base clickable area used by all icon buttons.

**Key Functions/Classes:**
- `App` in `src/App.tsx`: Creates timers (`onAdd`) and renders them; best place to remove by `id`.
- `Timer` in `src/components/Timer/Timer.tsx`: Runs a `setTimeout` loop while started; needs cleanup on unmount.

**Dependencies:**
- React 17 + `styled-components` 5: buttons are simple components with inline SVG and small styled wrappers.

**Patterns & Conventions:**
- Buttons are implemented as small components under `src/components/*Button/*Button.tsx`, usually wrapping `ActionButton` and an inline SVG.
- Timer cards are rendered as `<Block> ... </Block>`.

## Implementation Phases

### Phase 1: App-level removal handler

**Objective:** Allow the app to remove a timer by `id`.

**Files to Modify:**
- `src/App.tsx`

**Steps:**
1. Add a function `onRemoveTimer(id: string)` that does `setTimers(prev => prev.filter(t => t.id !== id))`.
2. Update the render to pass `onRemove={() => onRemoveTimer(x.id)}` into each `<Timer ... />`.
3. Keep the existing `key={x.id}`.

**Acceptance Criteria:**
- [ ] Removing one timer does not affect the others.
- [ ] Add still works after removals.

---

### Phase 2: Timer prop + remove UI

**Objective:** Expose a per-timer remove action and invoke the callback.

**Files to Modify/Create:**
- `src/components/Timer/Timer.tsx`: accept `onRemove` prop and call it.
- (Option A) Create `src/components/RemoveButton/RemoveButton.tsx` + `index.ts` and export it.
- (Option B) Inline a small “X” button inside `Timer.tsx` without a separate component.

**Steps (recommended Option A for consistency):**
1. Create `RemoveButton` similar to `StartButton`/`StopButton` using `ActionButton` + inline SVG (an “X” icon).
2. Update `src/components/index.ts` only if you want `RemoveButton` available elsewhere; otherwise import via relative path from `Timer`.
3. Update `Timer` signature to `export const Timer: React.FC<{ onRemove: () => void }>`.
4. Render the remove button in the timer card.

**UI Placement Recommendation (minimal + clear):**
- Add a `position: relative` wrapper inside the `Block` and place the remove button `position: absolute; top: 0; right: 0;`.
- Keep fill color consistent with existing UI (`#9E9E9E` at rest).

**Acceptance Criteria:**
- [ ] Each timer card shows a remove control.
- [ ] Clicking remove deletes only that timer.

---

### Phase 3: Timer unmount cleanup (prevent stray timeouts)

**Objective:** Ensure removing a running timer does not leave scheduled callbacks running.

**Files to Modify:**
- `src/components/Timer/Timer.tsx`

**Steps:**
1. Add a `useEffect(() => () => { clearTimeout(intervalId.current); }, [])` cleanup.
2. In the remove click handler, call `clearTimeout(intervalId.current)` (or call the existing `onStop()` first) before invoking `props.onRemove()`.

**Acceptance Criteria:**
- [ ] Removing a started timer causes no console warnings/errors.
- [ ] Removing a paused/idle timer behaves normally.

---

### Phase 4: Manual verification checklist (no test framework present)

**Objective:** Validate behavior end-to-end using `vite` dev server.

**Notes:** This repo currently has no unit test setup (no Vitest/Jest/RTL). Per the workspace guidance, prefer manual verification unless the team explicitly wants to introduce a test stack.

**Manual Checks:**
1. Add 3 timers; start 2 timers; remove the started one; confirm no warnings in console.
2. Remove the paused timer; confirm no warnings.
3. Remove the idle timer; confirm no warnings.
4. Add again after removals; confirm everything renders and buttons work.

## Open Questions

1. **Should removal be allowed while running?**
   - **Option A (simplest):** Yes; removal stops/cleans up internally then removes.
   - **Option B:** Only allow remove when `status === 'idle'` (disable/hide otherwise).
   - **Recommendation:** Option A, with explicit cleanup, for the least surprising UX.

2. **Where should the remove control live?**
   - **Option A:** Top-right “X” in the timer card (clear meaning).
   - **Option B:** Add as a 4th icon in `ButtonsWrapper` (cheapest layout change).
   - **Recommendation:** Option A; it avoids confusion with start/pause/stop actions.

3. **Remove button styling:**
   - **Option A:** Always gray (`#9E9E9E`) like idle text.
   - **Option B:** White when timer started.
   - **Recommendation:** Option A (always gray) unless design wants state-coupled controls.

## Risks & Mitigation

- **Risk:** Scheduled `setTimeout` continues after unmount and calls `setValue`.
  - **Mitigation:** Add unmount cleanup and clear the timeout in the remove handler.

- **Risk:** Introducing `RemoveButton` might slightly shift layout.
  - **Mitigation:** Use absolute positioning in a relative wrapper to avoid affecting existing flex layout.

## Success Criteria

- [ ] User can add multiple timers and remove any timer.
- [ ] Removing a running timer produces no warnings/errors.
- [ ] No regressions to start/pause/stop behaviors.

## Notes for Atlas

- Keep the change minimal: `App` remains the source of truth for the timer list; `Timer` remains self-contained for timing behavior.
- Prefer functional `setTimers(prev => ...)` updates in `App` to avoid stale closures.
- When adding the remove button, match existing button patterns (inline SVG, `ActionButton`, minimal styled wrapper).
