---
name: deploy-to-github-pages
description: >-
  Deploy and publish static web applications, single-page apps, or documentation sites
  to GitHub Pages completely via command line using git and GitHub CLI (gh). Use when
  the user asks to publish, deploy, or host a web app or project on GitHub Pages,
  create a remote GitHub repository, push code, and configure live HTTPS hosting.
---

# Deploy Web App to GitHub Pages via Command Line

This skill provides an automated, end-to-end workflow to publish static front-end web applications (HTML/CSS/JS, Vite/React builds, documentation, canvas/PWA apps) to **GitHub Pages** entirely through the command line.

---

## 1. Pre-flight Check & Prerequisites

### 1.1 Verify Static Assets & Relative Paths
GitHub Pages sites are served under a repository subdirectory: `https://<owner>.github.io/<repo>/`.
- Ensure all `<link>`, `<script>`, `<img>`, and `fetch()` URLs use **relative paths** (e.g. `assets/icon.png`, `css/style.css`, `./js/app.js`), **not** root-absolute paths (e.g. `/assets/icon.png`).
- Check if any local IP/port references (such as `localhost:8080` or `192.168.x.x`) need dynamic detection (e.g., fallback to `window.location.href` when hosted online).

### 1.2 Create `.gitignore`
Always ensure an appropriate `.gitignore` is present before staging files:
```gitignore
# Python / Node
__pycache__/
*.py[cod]
node_modules/
dist/
.env

# System & IDE
.DS_Store
Thumbs.db
desktop.ini
.vscode/
.idea/
```

### 1.3 Check Tools Installation
Verify Git and GitHub CLI:
```powershell
git --version
gh --version
```
If `gh` is not installed on Windows:
```powershell
winget install --id GitHub.cli --silent --accept-package-agreements --accept-source-agreements
```
*(The binary is placed at `C:\Program Files\GitHub CLI\gh.exe`)*

---

## 2. GitHub Authentication Flow

### 2.1 Check Login Status
```powershell
gh auth status
```

### 2.2 Device Code Login (Web Flow)
If not logged in, initiate the web authentication flow in the background:
```powershell
gh auth login --web --git-protocol https
```
1. Read the output or task log to obtain the 8-character device code: `XXXX-XXXX`.
2. Present the user with the direct link: `https://github.com/login/device` and the code.
3. Once authorized by the user in the browser, the background task completes automatically.

### 2.3 Configure Git Credential Helper (Crucial)
To prevent `fatal: Authentication failed` or password prompts during `git push`:
```powershell
gh auth setup-git
```

---

## 3. Local Repository Setup & Commit

### 3.1 Initialize and Commit
```powershell
# Ensure branch is main
git init -b main

# Ensure git author identity is set locally if not globally configured
if (-not (git config user.name)) { git config user.name "<username>" }
if (-not (git config user.email)) { git config user.email "<username>@users.noreply.github.com" }

git add .
git commit -m "feat: initial commit for GitHub Pages deployment"
```

---

## 4. Remote Repository Creation & Push

### Scenario A: Create New Remote Repo Automatically
```powershell
gh repo create <repo-name> --public --source=. --remote=origin --push
```

### Scenario B: Existing Empty Remote Repo
If the user already created the repo on GitHub:
```powershell
git remote add origin https://github.com/<owner>/<repo-name>.git
git push -u origin main
```

---

## 5. Enable GitHub Pages via API

Enable GitHub Pages using the GitHub REST API through `gh`:
```powershell
gh api --method POST repos/<owner>/<repo-name>/pages `
  -f "build_type=legacy" `
  -f "source[branch]=main" `
  -f "source[path]=/"
```

The API returns a JSON response containing `html_url`:
```json
{
  "html_url": "https://<owner>.github.io/<repo-name>/",
  "status": "building",
  "https_enforced": true
}
```

---

## 6. Verification and Deployment Monitoring

### 6.1 Monitor GitHub Actions Pages Deployment
GitHub Pages builds run via Actions (`pages-build-deployment`):
```powershell
# Check recent workflow runs
gh run list --limit 1

# Optional: Watch build until complete
gh run watch <run-id>
```

### 6.2 Verify HTTP Status
Test that the published site and core assets return HTTP 200:
```powershell
(Invoke-WebRequest -Uri "https://<owner>.github.io/<repo-name>/" -UseBasicParsing).StatusCode
```

---

## 7. Delivery Checklist
Once published:
1. Provide the user with the live site link: `https://<owner>.github.io/<repo-name>/`.
2. Provide the repository link: `https://github.com/<owner>/<repo-name>`.
3. Provide device-specific guidance (e.g. for iPad/iPhone: open in Safari -> "Add to Home Screen" for fullscreen standalone app).
