---
"@openproject/octicons-angular": patch
---

Fix empty ARIA attributes being rendered on Angular octicon components

- Prevent `aria-label` and `aria-labelledby` attributes from being rendered when not set
- Make `aria-label` and `aria-labelledby` mutually exclusive (aria-labelledby takes precedence)
- Fix `aria-hidden` calculation to consider both `ariaLabel` and `ariaLabelledBy`
- Add `tabindex` alias to `tabIndex` input for consistency with other lowercase attribute names
