---
name: read-tool
description: Thoroughly reads and analyzes the entire repository without truncation or deletion, understands structure, plans, and obeys instructions.
---

# Read Tool

## Instructions
**Use this skill FIRST when starting any repo-related task to gain full context without losing information.**

1. **Full Repo Scan (No Truncation)**:
   - Read EVERY file in the repo recursively from root.
   - Use `git ls-files` or `find . -type f` to list ALL files (ignore `.git`, `node_modules`, `.vscode`, etc. unless specified).
   - For each file: Read FULL content without truncation (use `--no-pager` for git or chunk large files).
   - NEVER skip, summarize, or truncate - capture complete content.

2. **Structure Analysis**:
   ```
   Generate a complete repo map:
   📁 [root]
   ├── 📄 README.md
   ├── 📁 src/
   │   ├── 📄 main.py (500 lines)
   │   └── 📁 components/
   └── 📄 package.json
   ```

3. **Key Files Priority** (read these first, full content):
   ```
   - README.md, README.*, docs/
   - package.json, pyproject.toml, requirements.txt, Cargo.toml
   - .gitignore, .env.example
   - src/index.*, main.*, lib/* (entry points)
   - config/, .github/workflows/
   - PLAN.md, plans/, instructions/
   ```

4. **Plan Detection & Obedience**:
   - Search for: `PLAN`, `ROADMAP`, `TODO`, `NEXT`, `instructions`
   - Extract ALL planning files/content verbatim
   - **CRITICAL**: Note existing plans and confirm "Will obey [plan summary]"
   - Flag: "DELETION RESTRICTED" on any file modification suggestions

5. **Output Format** (Complete, No Truncation):
   ```
   🗺️ REPO ANALYSIS COMPLETE
   ┌─ STRUCTURE (X files, Y dirs)
   │  [full tree]
   ├─ PLANS FOUND: [verbatim extracts]
   ├─ KEY FILES:
   │  📄 README.md: [full content]
   │  📄 package.json: [full content]
   │  ...
   └─ STATUS: Ready to execute [your instructions]
       ⚠️ NO FILES WILL BE DELETED
       ✅ Plans identified and will be obeyed
   ```

6. **Safety Rules** (ALWAYS enforce):
   ```
   ❌ NEVER DELETE files
   ❌ NEVER truncate output  
   ❌ NEVER ignore plans/instructions
   ✅ ALWAYS confirm plan obedience
   ✅ ALWAYS show full file contents when relevant
   ```

## Examples

**Example 1: Initial Repo Analysis**
```bash
# Agent runs:
find . -type f ! -path "*/node_modules/*" ! -path "*/.git/*" | head -20
git ls-files | xargs -I {} sh -c 'echo "\n📄 {}:"; cat "{}" || echo "Binary"'
```

**Output:**
```
🗺️ REPO ANALYSIS COMPLETE
📁 Full structure: 47 files, 12 dirs
PLANS FOUND: 
📄 PLAN.md: "Step 1: Add auth... Step 2: Database..."
KEY FILES:
📄 README.md: [1500 lines full content]
📄 package.json: [full dependencies]
STATUS: Ready - Will obey PLAN.md sequence
⚠️ NO DELETION ALLOWED
```

**Example 2: Plan Obedience Confirmation**
```
PLAN DETECTED in ROADMAP.md:
1. Fix login bug first
2. Add tests after
3. Deploy only after review

✅ Will obey roadmap sequence exactly
```

## When to Use
- **ALWAYS** at start of any repo task
- Before ANY file modification
- When user says "understand my repo"
- To confirm plans before execution

**Tagline**: "Full repo read → Plan obedience → Safe execution"
