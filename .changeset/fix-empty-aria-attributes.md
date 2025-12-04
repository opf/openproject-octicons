---
"@openproject/octicons-angular": patch
---

Fix empty ARIA attributes being rendered on Angular octicon components

- Prevent `aria-label`, `aria-labelledby`, and `id` attributes from being rendered when empty
- Make `aria-label` and `aria-labelledby` mutually exclusive (aria-labelledby takes precedence)
- Fix `aria-hidden` calculation to consider both `ariaLabel` and `ariaLabelledBy`
