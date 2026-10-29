# Runbook: something was committed that should not be public

Use this when a file reaches the repository (or GitHub) that must not be there: secrets, credentials, personal data, private notes, or local tooling such as AI agent instructions.

## 1. Assess what leaked

| Type | Example | Urgency |
| --- | --- | --- |
| Secret | API key, token, password, `.env` | **Critical**: revoke it before anything else |
| Personal data | Phone number, address, client data | High |
| Internal / local files | AI instructions, editor config, notes | Low: cleanup only |

> Removing a commit does **not** un-leak a secret. Anyone (or any bot) may already have copied it. Always **revoke and rotate** the credential first, then clean the history.

## 2. Stop tracking the file

```bash
echo "path/to/file" >> .gitignore
git rm --cached path/to/file   # keeps the file on disk
```

## 3. Back up before rewriting

```bash
cp path/to/file /safe/place/   # rewriting history can delete it from the working tree
git clone --mirror . /safe/place/repo-backup.git
```

## 4. Rewrite history

Preferred tool: [`git filter-repo`](https://github.com/newren/git-filter-repo).

```bash
git filter-repo --invert-paths --path path/to/file
```

Built-in fallback (no extra install):

```bash
git filter-branch --index-filter 'git rm --cached --ignore-unmatch path/to/file' -- main
git for-each-ref --format='%(refname)' refs/original | xargs -n1 git update-ref -d
git reflog expire --expire=now --all && git gc --prune=now
```

Verify it is gone from every commit:

```bash
git log main --name-only --format= | rg path/to/file   # must print nothing
```

## 5. Publish the clean history

```bash
git push --force-with-lease origin main
```

`--force-with-lease` refuses to overwrite the remote if someone pushed in the meantime. Anyone with an old clone must re-clone (or `git fetch && git reset --hard origin/main`).

## 6. Clean what Git cannot reach

- If the repository had forks, pull requests, or cached views of the old commits, ask [GitHub Support](https://support.github.com/) to purge them.
- Check deployed artifacts (for example GitHub Pages builds) do not contain the file.

## 7. Prevent it from happening again

- Create `.gitignore` before the first commit and review `git status` before every commit.
- Keep secrets only in `.env` (ignored) and in GitHub Actions variables or secrets.
- Keep local tooling (AI instructions, `.claude/`, editor folders) ignored.

## Example: AI agent instructions in this repository

`AGENTS.md` and `CLAUDE.md` (local instructions for AI coding agents) were included in the first commits because they were not in `.gitignore`. They contained no secrets, so step 1 was "low urgency". The fix:

1. Backed up both files and mirrored the repository.
2. Rewrote the three existing commits with `git filter-branch` to drop both files.
3. Restored the files locally and added `AGENTS.md`, `CLAUDE.md`, `.claude/` and `.atl/` to `.gitignore`.
4. Pushed with `git push --force-with-lease`.
5. Verified on GitHub that the files no longer appear on `main`.
6. Observed that GitHub still served the old commit when requested directly by its full hash. Unreachable commits stay cached until GitHub garbage-collects them. Because the content was not sensitive, no support request was filed; for a secret, step 6 (GitHub Support purge) would be required, after rotating the secret.
