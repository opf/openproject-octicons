---
"@openproject/octicons-angular": patch
---

Fix empty ARIA attributes being rendered on Angular octicon components

- Prevent `aria-label` and `aria-labelledby` attributes from being rendered when not set
- Make `aria-label` and `aria-labelledby` mutually exclusive (aria-labelledby takes precedence)
- Fix `aria-hidden` calculation to consider both `ariaLabel` and `ariaLabelledBy`
- Make `role="img"` conditional - only set when icon has accessible label (aria-label or aria-labelledby)
- Ensure `role="img"` and `aria-hidden="true"` are mutually exclusive to prevent accessibility errors
- Remove legacy `focusable` SVG attribute (not supported in modern browsers)
