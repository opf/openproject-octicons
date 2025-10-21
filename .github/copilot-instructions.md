# GitHub Copilot Instructions for OpenProject Octicons

## Repository Overview

This repository is **OpenProject's fork of GitHub's Primer Octicons**, a set of SVG icons. OpenProject extends the original octicons with custom icons specific to OpenProject while maintaining the original GitHub icons.

### Key Characteristics
- **Based on**: GitHub's Primer Octicons
- **Purpose**: Provide SVG icons for OpenProject with additional custom icons
- **Distribution**: Multiple packages for different platforms (Angular, Ruby, Node.js)
- **Main npm Package**: Angular integration library distributed as `@openproject/octicons-angular`

## Project Structure

```
openproject-octicons/
├── icons/                  # SVG icon files (both GitHub and OpenProject custom icons)
│   ├── *-16.svg           # Required 16px variant
│   ├── *-24.svg           # Optional 24px variant
│   └── *-12.svg           # Optional 12px variant
├── lib/                    # Platform-specific libraries
│   ├── octicons_angular/  # Angular component library
│   ├── octicons_node/     # Node.js/JavaScript library
│   ├── octicons_gem/      # Ruby gem
│   ├── octicons_helper/   # Rails helper
│   ├── octicons_react/    # React components (not currently published by OpenProject)
│   └── octicons_styled/   # Styled components (not currently published by OpenProject)
├── script/                 # Build and utility scripts
│   ├── build.js           # Main build script
│   └── version            # Version management
├── tests/                  # Test files
└── keywords.json          # Icon keywords for search/discovery
```

## Technologies Used

### Primary Technologies
- **JavaScript/TypeScript**: Build scripts and Angular library
- **Angular**: Integration library (`@openproject/octicons-angular`)
- **Ruby**: Ruby gem and Rails helper
- **SVG**: Icon format
- **Node.js**: Build system and npm distribution

### Build Tools
- **yarn**: Package manager (version 1.22.1)
- **Changesets**: Version and changelog management
- **SVGO**: SVG optimization
- **AVA**: Testing framework
- **ESLint**: Linting

## Development Workflow

### Initial Setup
```bash
# Install dependencies
yarn install --frozen-lockfile

# Build icon data
npm run build
```

### Building
```bash
# Build icon data from SVG files
npm run build
# This reads icons/**/*.svg and outputs to lib/build/data.json
```

### Testing
```bash
# Run tests
npm test

# Lint code
npm run lint
```

### SVG Optimization
```bash
# Optimize SVG files
npm run svgo
```

## Adding or Updating Icons

### Requirements for New Icons
1. **File naming convention**: Must include size suffix
   - Required: `icon-name-16.svg` (16px variant)
   - Optional: `icon-name-12.svg`, `icon-name-24.svg`
2. **SVG attributes**:
   - Correct `viewBox` attribute matching the size
   - Don't worry about `fill`, `fill-rule`, or `clip-rule` (removed by CI)
3. **Keywords**: Add searchable keywords to `keywords.json`
4. **Changeset**: Create a changeset for release tracking

### Adding a New Icon - Step by Step
1. Add SVG file(s) to `/icons` directory with proper naming
2. Update `/keywords.json` with searchable keywords:
   ```json
   {
     "icon-name": ["keyword1", "keyword2", "keyword3"]
   }
   ```
3. Create a changeset:
   ```bash
   npx changeset
   ```
4. Select version bump type (patch/minor/major)
5. Write release notes
6. Build and test:
   ```bash
   npm run build
   npm test
   ```

### Icon Size Standards
- **12px**: xsmall icons (optional)
- **16px**: small icons (REQUIRED - default size)
- **24px**: medium icons (optional)
- **32px**: rendered from 16px/24px with scaling
- **64px**: rendered from 16px/24px with scaling

## Angular Library (`@openproject/octicons-angular`)

This is the main integration library distributed via npm.

### Usage Pattern
```typescript
import { Component } from '@angular/core';
import { LogIconComponent } from '@openproject/octicons-angular';

@Component({
  imports: [LogIconComponent],
  template: `<svg log-icon></svg>`,
})
export class MyComponent {}
```

### Component Features
- **Standalone components**: Tree-shakeable, import only what you need
- **Inputs**: `size`, `fill`, `verticalAlign`, `aria-label`, `aria-labelledby`, `title`, `id`, `tabIndex`
- **Sizes**: `xsmall` (12px), `small` (16px), `medium` (32px), `large` (64px)
- **Accessibility**: Full ARIA support

### Component Naming Convention
Icon files `icon-name-16.svg` become `IconNameIconComponent` with attribute selector `icon-name-icon`.

## Release Process

### Using Changesets
This project uses [Changesets](https://github.com/changesets/changesets) for version management.

1. **Creating a changeset**: Run `npx changeset` for release-dependent changes
2. **Version bumping**: Merge PR triggers changeset bot to create Release PR
3. **Publishing**: Merging Release PR publishes to npm and RubyGems automatically

### When to Create Changesets
- ✅ Adding/updating icons
- ✅ API changes
- ✅ Bug fixes
- ❌ Documentation-only changes
- ❌ CI/workflow changes

## Code Style and Conventions

### File Naming
- SVG icons: `kebab-case-##.svg` (e.g., `alert-fill-16.svg`)
- TypeScript/JavaScript: Follow existing patterns in each library
- Use ESLint configuration defined in `package.json`

### SVG Guidelines
- Use semantic naming (what it represents, not what it looks like)
- Maintain consistency with existing icon style
- Optimize with SVGO before committing
- Include descriptive keywords in `keywords.json`

### Commit Messages
- Follow conventional commits format
- Be descriptive about what icons were added/changed
- Reference issue numbers when applicable

## Testing

### Test Structure
- Build tests: `tests/build.test.js` - validates SVG structure and build process
- Library tests: Each library has its own test suite
- CI runs on all PRs via GitHub Actions

### What to Test
- SVG file structure (viewBox, width, height attributes)
- File naming conventions
- Build process output
- Generated component code (for Angular/React libraries)

## CI/CD Pipeline

### GitHub Actions Workflows
- **ci.yml**: Run tests and linting on PRs
- **publish.yml**: Publish packages to npm and RubyGems on release
- **release.yml**: Create release PR with changesets
- **optimize.yml**: Run SVGO on icon files
- **codeql.yml**: Security scanning

### Pre-merge Checks
- Tests must pass
- Linting must pass
- Changesets must be present for icon changes
- SVGs must be optimized

## Common Tasks

### Adding a Custom OpenProject Icon
```bash
# 1. Create the SVG file
# Place in icons/my-new-icon-16.svg with proper viewBox

# 2. Add keywords
# Edit keywords.json and add entry

# 3. Create changeset
npx changeset

# 4. Build and test
npm run build
npm test

# 5. Commit and push
git add .
git commit -m "feat: add my-new-icon"
git push
```

### Updating an Existing Icon
```bash
# 1. Modify the SVG file in icons/

# 2. Optimize if needed
npm run svgo

# 3. Create changeset
npx changeset

# 4. Build and test
npm run build
npm test
```

### Syncing with Upstream GitHub Octicons
```bash
# Use the merge-upstream script
./script/merge-upstream
```

## Important Notes for Copilot

1. **This is a fork**: Changes should be compatible with potential upstream merges
2. **Icons are the product**: All code exists to support icon distribution
3. **Changesets are mandatory**: Always remind about changesets for icon changes
4. **Size variants**: Remember 16px is required, 12px and 24px are optional
5. **Keywords matter**: Icons are discovered via keywords - always update `keywords.json`
6. **Accessibility first**: Icons should always support proper ARIA attributes
7. **Tree-shaking**: Angular components are standalone for optimal bundle size
8. **Multiple platforms**: Support Angular, Ruby, and Node.js integrations

## Package Distribution

### npm Packages
- `@openproject/octicons-angular` - Angular components
- Published automatically on release via GitHub Actions

### Ruby Gems
- `openproject-octicons` - Ruby API
- `openproject-octicons_helper` - Rails helper
- Published automatically on release via GitHub Actions

## Documentation Locations

- **General**: `README.md`
- **Contributing**: `CONTRIBUTING.md`
- **Angular Library**: `lib/octicons_angular/README.md`
- **Ruby Gem**: `lib/octicons_gem/README.md`
- **Release Process**: `RELEASE.md`

## Questions to Ask When Contributing

1. Does this icon already exist in the original GitHub octicons?
2. Is the icon size correct (16px, 24px, or 12px)?
3. Does the icon follow the existing design language?
4. Have I added keywords for discoverability?
5. Have I created a changeset?
6. Does this work with the Angular integration?
7. Have I tested the build?

## Repository-Specific Patterns

### Icon Components in Angular
- Export pattern: Named exports for tree-shaking
- Component decorator: Standalone components with inline templates
- Attribute selectors: Match icon filename pattern
- SVG manipulation: Direct template rendering, no external files

### Build System
- Input: SVG files in `icons/`
- Process: Parse, validate, optimize
- Output: `lib/build/data.json` (icon metadata and paths)
- Distribution: Each library builds from this data

### Version Management
- Managed by Changesets
- Synchronized across all packages
- Release notes auto-generated from changeset descriptions
- Publishing triggered by Release PR merge
