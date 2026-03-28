# ADR-0001: Architecture, Data Structures, and Iteration Rules

- Status: Accepted
- Date: 2026-03-28
- Context: `enterprise-demo` (Angular + NgRx + Express API)

## Context

This repository is an enterprise Angular reference implementation. Key goals:

1. Keep architecture scalable (UI, state, domain, transport).
2. Demonstrate advanced Angular usage (signals, control flow, lazy routes, CVA, resolvers).
3. Keep business logic deterministic and testable.
4. Explicitly document **why** each structure (`Array`, `Object`, `Map`, `Set`, `Queue`, `LinkedList`, `Graph`, `Tree`) is used and **how** iteration is chosen.

## Decision (high level)

### 1) Layer boundaries

- **View**: components in `features/*` and `projects/ui`.
- **ViewModel/Orchestration**: facades and VM services.
- **State**: NgRx for long-lived/shared state.
- **Domain**: pure logic in `planning/domain` without Angular coupling.
- **Transport**: API services + interceptors.

### 2) Patterns

- **Facade**: isolates components from NgRx/API complexity.
- **Factory**: `ScenarioFactory` and `StrategyFactory` create domain abstractions.
- **Strategy**: pluggable scoring logic in planning.
- **MVC (backend)**: controllers + services + storage split.
- **MVVM (frontend)**: component + signal/facade view model.

### 3) Angular policy

- Use new control flow (`@if/@for`) as a single style baseline.
- Prefer signals in templates over `| async` where it improves readability and stability.
- Use `OnPush` for presenters/pages where possible.

## Exact data-structure choices and Big O

## A. `Array<T>`

Used for:

- Ordered UI lists (`projects`, `milestones`, table rows).
- Sequential read pipelines in presenters/effects.

Why:

- UI needs order.
- Natural JSON representation.

Iteration rules:

- `for..of` for hot paths and early exit (`break/continue`).
- `map/filter/sort` for pure declarative transformations.
- avoid `forEach` where early exit is required.

Complexity:

- traversal: `O(n)`
- filter/map: `O(n)`
- sort: `O(n log n)`

## B. `Record<string, T>` / `Object`

Used for:

- `itemsById` in planning domain.

Why:

- Fast by-id lookup (`O(1)` amortized).
- JSON-friendly shape.

Iteration rules:

- `Object.values(record)` when keys are not needed.
- `Object.entries(record)` when key + value are both needed.

Note:

- Prefer `Map` for dynamic runtime indexes with frequent mutations.

## C. `Map<K, V>`

Used for:

- runtime indexes (`skillIndex`, `indegree`, `orderById`, `levelById`).

Why:

- explicit dictionary semantics,
- no prototype-key edge cases.

Iteration rules:

- `map.get(key)` for random access.
- `for (const [k, v] of map)` for full traversal.

Complexity:

- `get/set/has`: `O(1)` amortized.

## D. `Set<T>`

Used for:

- membership checks (`scheduledIds`, `focusLinks`, `skills`).

Why:

- avoids linear `includes`.

Iteration rules:

- `set.has(x)` for membership.
- `for..of` for full traversal.

Complexity:

- `has/add/delete`: `O(1)` amortized.

## E. `Queue<T>`

Used for:

- ready-node queue in topological scheduling.

Why:

- FIFO models "ready for execution" semantics.

Operations:

- enqueue/dequeue expected `O(1)`.

## F. `LinkedList<T>`

Used for:

- execution chain construction (append-heavy flow).

Why:

- clear semantics for ordered chain + cheap append.

Operations:

- append: `O(1)` with tail pointer.
- toArray: `O(n)`.

## G. `DirectedGraph`

Used for:

- planning dependencies (`dep -> item`).

Why:

- explicit DAG model + topological planning support.

Complexity:

- Kahn traversal baseline: `O(V + E)`,
- plus per-step ready-chunk sort: `O(R log R)`.

## H. `Tree`

Used for:

- organization hierarchy and capacity distribution.

Why:

- natural representation of nested team structure.

Complexity:

- full DFS/fold traversal: `O(T)` where `T` is node count.

## Mandatory iteration policy

1. **Domain hot path**: prefer `for..of` / `while` with early exit support.
2. **VM transformations**: prefer `map/filter` for readability when no early exit is needed.
3. **Frequent membership checks**: use `Set.has` (not `array.includes`).
4. **Frequent key lookup**: use `Record/Map` (not linear array scan).
5. **Sort once per layer** (avoid repeated sorting in templates).

## Consequences

Pros:

- predictable complexity and behavior,
- clear separation of concerns,
- easier onboarding and explanation of design choices.

Cons:

- more abstractions than a minimal CRUD app,
- requires team discipline to keep boundaries clean.

## Rejected alternatives

1. Fat components without facade/domain:
   - faster initially, harder to evolve/test.
2. Signals-only state for all features:
   - good for small local state, weaker for cross-feature orchestration.
3. Plain object only, no `Map/Set`:
   - simpler syntax, weaker semantics/perf for key membership/index use-cases.

## Revisit criteria

Revisit this ADR when:

- performance/data volume assumptions materially change,
- selected structures no longer provide practical value,
- state management approach changes significantly (e.g., NgRx scope reduction).
