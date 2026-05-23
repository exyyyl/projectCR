# projectCR — Strict LLM Development Rules

All AI coding assistants (including LLM models) modifying this codebase must adhere strictly to the following rules. Regressions or violations of these rules are considered failures.

---

## 1. Architectural Rules

### Rule 1: Component File Size Constraints
- No single React component file (`.tsx`) must exceed **400 lines of code**.
- If a component grows beyond this limit, it MUST be modularly decomposed into smaller stateless sub-components or moved into custom hooks.
- Giant files (like the legacy `PresetsPanel.tsx` monster) are strictly prohibited in new code.

### Rule 2: Reusable UI Kit First (Zero Inline Forms)
- Do NOT write raw styled inline inputs, custom select elements (with absolute ChevronDown pointers), or switch groups.
- All controls must use unified UI components from `src/renderer/src/components/ui/` (e.g., `<InputField>`, `<SelectField>`, `<SwitchGroup>`, `<DashedButton>`, `<CardContainer>`).
- If a new custom control variant is needed, add it to the UI Kit instead of implementing it inline.

### Rule 3: Separation of Logic and Presentation (Hooks First)
- UI components should strictly handle presentational layouts and coordinate sub-components.
- All logic (state management, API integrations, complex calculations, database interactions) must be encapsulated within custom React hooks in `src/renderer/src/hooks/`.

### Rule 4: Type Safety & Zero-Any
- Everything must be typed. `any` is strictly prohibited.
- IPC interfaces, schemas, database rows, and hook return values must be explicitly declared and validated. Use proper TypeScript definitions from `src/renderer/src/types/index.ts`.

---

## 2. Design and Style Rules

Follow the styling guide in [STYLE.md](file:///c:/Users/exyyyl/projects/crosshair-vault/STYLE.md) exactly:
- **AMOLED Dark Theme**: Page background is strictly `#000000`, card surfaces are `#0a0a0a`.
- **Accent Brands**: VALORANT uses `#FF4655` (accent), CS2 uses `#E8A530` (cs). Focus borders use `#FEEF3C` where matching premium Konect screenshots.
- **Sentence Case**: Standard buttons, cancel overlays, and UI texts must be in clean sentence case (e.g. "Save", "Add a setting field") by default unless specified.

---

## 3. Workflow for Code Changes

1. **Incremental Refactoring**: Never write huge changes all at once. Split refactoring steps into small logical modules.
2. **Build Validation**: Always run `npm run build` to verify there are no compilation errors after code modifications.
3. **No Breaking Changes**: Business logic (e.g., SQLite DB fields, crosshair parser, main process APIs, Electron IPC) must not be changed unless explicitly requested.
