---
name: syncing-primer-fork
description: Use when syncing this OpenProject fork with its upstream Primer repo (primer/octicons or primer/view_components) — pulling new icons/components, merging upstream changes, resolving dependency/lockfile conflicts, or running script/merge-upstream.
---

# Syncing a Primer Fork from Upstream

## Overview

The `@openproject/*` repos (octicons, view_components) are forks of `primer/*`.
Syncing means merging upstream changes onto a `bump/primer-upstream` branch via
`script/merge-upstream`, **one upstream release batch at a time**, stopping just
before each version-bump commit, then resolving dependency conflicts per package
manager.

**Core principle:** Sync the *oldest* unmerged release batch first. Merge the
*parent* of the oldest unmerged version-bump commit whose parent isn't already
in `main` — never a version-bump commit itself, and never skip ahead to the
latest one.

**Why the oldest, not the latest:** a version-bump commit (changesets bot)
*deletes* the `.changeset/*.md` files it consumes. If you jump to the parent of
the *latest* version-bump, every intervening version-bump in that range has
already deleted its changesets — so the fork loses them and can't regenerate
those changelog entries with its own `changeset:version`. Stopping before the
*oldest* unmerged version-bump keeps that batch's changesets intact. Repeat per
batch.

## One-time prerequisite: register the `ours` merge driver

`.gitattributes` marks `yarn.lock` and `CHANGELOG.md` with `merge=ours`, but
that driver is **inert unless registered in git config**. Without it those files
conflict like any other. Run once per clone (or set `--global`):

```bash
git config merge.ours.driver true
```

Verify: `git config merge.ours.driver` prints `true`.

## Procedure

### 1. Pick the SHA — parent of the *oldest* unmerged version-bump commit

Walk the unmerged version-bump commits oldest-first and merge the parent of the
first one whose parent isn't already in `main`. (`main` usually sits exactly at
the previous batch's boundary, i.e. the parent of the *oldest* unmerged
version-bump — that's a no-op, so skip it and take the next.)

- octicons: version-bump commits are titled **`Version Packages`**
- view_components: titled **`Release tracking`**

```bash
git fetch upstream
GREP="Version Packages"   # view_components: "Release tracking"
for vp in $(git log upstream/main --grep="$GREP" --not main --reverse --format=%H); do
  parent=$(git rev-parse "$vp^")
  git merge-base --is-ancestor "$parent" main && continue   # parent already merged → skip
  echo "TARGET: $parent  ($(git log -1 --format='%h %s' "$vp")'s parent)"
  break
done
```

That `TARGET` SHA is what you pass to the script. Each run advances one batch;
re-run after the fork has versioned/released the previous batch.

### 2. Run the merge script

```bash
script/merge-upstream <TARGET> gsed   # the SHA from step 1
```

On macOS pass `gsed` as the 2nd arg (the script auto-detects, but be explicit).
The script: fetches upstream, builds `bump/primer-upstream-ref` (reset to the
SHA) and `bump/primer-upstream` (from `origin/main`), merges with `--no-commit`,
rescopes `@primer/octicons` → `@openproject/octicons` in `.changeset/*.md`,
then runs `yarn install && yarn build`, stages, and stops at an interactive
`git commit`.

**The merge step is conflict-tolerant (`|| true`), but the later `yarn install`
is not.** When a `package.json` conflicts (almost always — fork scope/version vs
upstream), it contains conflict markers → invalid JSON → `yarn install` exits
non-zero → `set -e` aborts the script *before* build/stage/commit. That's
expected: the changeset rescope has already run, and you're left mid-merge.
**Resolve conflicts (step 3) first, then run `yarn install && yarn build`
yourself**, then stage and commit.

### 3. Resolve conflicts by package manager

With the `ours` driver registered (see prerequisite), `.gitattributes` resolves
root `yarn.lock` and `CHANGELOG.md` automatically (fork wins). For the rest:

| Conflict in | Manager | Fix |
|---|---|---|
| `lib/octicons_angular/package.json` + `package-lock.json` | **npm** | Resolve `package.json`, then `cd lib/octicons_angular && npm install` to regenerate `package-lock.json` |
| root / other `package.json` | **yarn** | Resolve `package.json`, then `yarn install` (root) to regenerate `yarn.lock` |
| icon/component source, `.changeset/*.md` | — | Resolve normally; keep upstream's new icons |

In **octicons**, dependency conflicts are rare — npm is only used for
`octicons_angular`. In **view_components**, also expect Ruby: resolve the
`Gemfile`/`*.gemspec`, then `bundle install` to sync the lock. (`bundle install`
does not resolve conflict markers in a `Gemfile.lock` itself — that's `merge=ours`.)

After resolving, re-stage and rebuild if needed:

```bash
git add -A
yarn build          # regenerates lib/build/data.json from merged icons/
git commit          # finishes the deferred merge commit
```

### 4. Audit dependency bumps dropped by `merge=ours`

Because `yarn.lock` is `merge=ours`, any upstream bump made by `yarn upgrade
<pkg>` **alone** — no root `package.json` change, the common shape for a
Dependabot patch or transitive bump — is discarded on merge. The fork silently
stays on the old locked version, and **there is no fallback**: the fork's own
Dependabot (`.github/dependabot.yml`) only watches `/docs` and
`/lib/octicons_angular` npm, *not* the root yarn workspace. The angular
`package-lock.json` is *not* `merge=ours` (it 3-way merges), but `npm install`
re-resolving to that manifest's ranges can still lock a **lower** version than
upstream had — the same "missing bump" failure.

After the merge, before you commit, list what upstream locked that the fork
didn't pick up:

```bash
# root yarn: '+' side is upstream's TARGET, '-' is the fork's merged result
git diff bump/primer-upstream..<TARGET> -- yarn.lock
# angular npm (noisier — scan the "version" lines for shared packages)
git diff bump/primer-upstream..<TARGET> -- lib/octicons_angular/package-lock.json
```

For each bump worth replaying now — **security first** — re-apply it within the
fork's constraints, then re-stage:

```bash
yarn upgrade <pkg>@<version>             # root (yarn classic v1)
npm install <pkg>@<version>             # in lib/octicons_angular
```

If the fork's root `package.json` constraint *forbids* upstream's version, that's
a manifest bump (resolve in step 3), not a lockfile-only replay. Root yarn bumps
have no Dependabot safety net here, so don't defer the security-relevant ones.
These are dependency bumps, so no changeset.

### 5. Audit new icons for missing `keywords.json` entries (octicons only)

Upstream *usually* adds a `keywords.json` entry in the same commit as a new
icon, but not always — and the fork's own resolutions in step 3 don't touch
`keywords.json`, so a gap upstream shipped passes through untouched.
`script/build.js` doesn't fail on a missing entry — it silently falls back to
an empty `keywords` array (`keywords[name] || []`), so nothing in `yarn build`
or the test suite catches it.

After resolving conflicts, check every icon this batch added:

```bash
comm -23 \
  <(git diff --name-only --diff-filter=A main -- 'icons/*.svg' | sed -E 's#icons/(.*)-[0-9]+\.svg#\1#' | sort -u) \
  <(python3 -c "import json; [print(k) for k in json.load(open('keywords.json'))]" | sort)
```

Diff against `main`, not `bump/primer-upstream-ref` — the ref branch is just
upstream's tree at TARGET, so comparing against it flags every fork-only
`op-*` icon as "new" too. `main` is the fork's actual pre-batch state.

Anything printed is a new icon with no `keywords.json` entry. Add one —
follow the file's alphabetical ordering and the terseness of neighboring
entries (2–7 lowercase terms describing what the icon looks like or is used
for, not a restatement of its name).

### 6. If asked to push and open a PR

The SHA is meaningless to a reviewer — title the PR with the upstream package
version the batch reaches instead, read from `package.json` **at TARGET**
(TARGET sits right before the *next* version-bump, so its `version` field is
the last upstream release this batch actually includes):

```bash
git show <TARGET>:package.json | grep '"version"'
```

e.g. TARGET's version `19.25.0` → title `Sync Primer octicons upstream through v19.25.0`,
not `...through 9a7e2146`. The SHA can still go in the PR body for traceability.

## Quick Reference

```bash
git fetch upstream
# TARGET = parent of the OLDEST unmerged version-bump whose parent isn't in main:
for vp in $(git log upstream/main --grep="Version Packages" --not main --reverse --format=%H); do
  p=$(git rev-parse "$vp^"); git merge-base --is-ancestor "$p" main && continue; echo "$p"; break
done
script/merge-upstream <TARGET> gsed
# resolve conflicts: angular→npm install, root→yarn install, others normal
# audit dropped bumps (merge=ours discards upstream yarn.lock-only bumps, no Dependabot fallback):
git diff bump/primer-upstream..<TARGET> -- yarn.lock
# audit new icons for missing keywords.json entries (octicons only, upstream doesn't always add them):
comm -23 <(git diff --name-only --diff-filter=A main -- 'icons/*.svg' | sed -E 's#icons/(.*)-[0-9]+\.svg#\1#' | sort -u) <(python3 -c "import json; [print(k) for k in json.load(open('keywords.json'))]" | sort)
git add -A && git commit
```

## Common Mistakes

- **Jumping to the parent of the *latest* version-bump.** That drags in every
  intervening version-bump, which already deleted its changesets — the fork loses
  them. Sync the *oldest* unmerged batch first (see Core principle).
- **Merging a version-bump commit itself** (e.g. `Version Packages`) instead of
  its parent — pulls upstream's bump and conflicts with the fork's `changeset:version`.
- **Assuming the changeset rename worked.** Upstream changesets use *single*
  quotes (`'@primer/octicons'`); a double-quote-only sed silently no-ops. The
  script matches either quote and protects `@primer/octicons-react` /
  `@primer/styled-octicons` via the trailing `[^-]`. Verify after: no
  `@primer/octicons'` or `@primer/octicons"` remains in `.changeset/`.
- **Running `yarn install` to fix the angular conflict.** `octicons_angular` is
  npm — its `package-lock.json` must be regenerated with `npm install` in that dir.
- **Forgetting `gsed` on macOS.** BSD `sed -i` needs a backup-suffix arg; the
  changeset rename silently misbehaves without a GNU-compatible sed.
- **Trusting hand-merged / rerere-resolved YAML by eye.** Merges in `.github/*.yml`
  (workflows, `dependabot.yml`) easily produce subtly broken YAML — wrong list-item
  indentation, a key dropped to the wrong level, duplicate keys, a mapping/sequence
  mismatch. `rerere` can also replay a resolution from a *different* merge context
  and reintroduce upstream's quirks (e.g. list items flush with their key). Always
  re-validate after resolving: `ruby -ryaml -e 'YAML.load_file(ARGV[0])' <file>`
  (or `yq` / `python3 -c`), and confirm the *structure* parsed as intended — that a
  list is a list and sibling keys sit at the right depth, not just that it loads.
- **Assuming rerere makes the sync reproducible.** `rerere.enabled` is usually set
  *globally* (`~/.gitconfig`), and `.git/rr-cache` is **per-clone and never
  committed** — so the same upstream batch resolves *differently* for different
  people, and every replay lands silently in the working tree (all files, not just
  YAML; with `rerere.autoupdate` it's even auto-staged). Diff every rerere-touched
  hunk before staging; if a replayed resolution looks stale, `git rerere forget
  <path>` and resolve it by hand.
- **Inventing a PR/release flow.** The job ends at the local merge commit on
  `bump/primer-upstream`; release is a separate changeset-driven process.
- **Titling the PR with the merge SHA.** A hex SHA tells a reviewer nothing.
  Use the upstream package version at TARGET instead (see step 6).
- **Assuming upstream always adds keywords with new icons.** It usually does,
  but not always (e.g. upstream PR #1228 shipped three icons with no
  `keywords.json` entries). `script/build.js` silently defaults to `[]` on a
  miss — nothing fails, so it's easy to merge through unnoticed. Check step 5.

## Keeping the two forks aligned

This skill and `script/merge-upstream` are mirrored between octicons and
view_components. When you change one, port the change to the other. The repo
differences to account for:

- **Commit-title grep term:** `Version Packages` (octicons) vs `Release tracking`
  (view_components).
- **Package managers / lockfiles:** octicons uses yarn (root) plus npm (for
  `octicons_angular`); view_components additionally uses Ruby Bundler
  (`Gemfile.lock`).
- **`keywords.json` audit (step 5) is octicons-only.** view_components has no
  equivalent keyword-search file to check.
