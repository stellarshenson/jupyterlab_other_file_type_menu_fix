<!-- @import /home/lab/workspace/.claude/CLAUDE.md -->

# Project-Specific Configuration

This file imports workspace-level configuration from `/home/lab/workspace/.claude/CLAUDE.md`.
All workspace rules apply. Project-specific rules below strengthen or extend them.

The workspace `/home/lab/workspace/.claude/` directory contains additional instruction files
(MERMAID.md, NOTEBOOK.md, DATASCIENCE.md, GIT.md, and others) referenced by CLAUDE.md.
Consult workspace CLAUDE.md and the .claude directory to discover all applicable standards.

## Mandatory Bans (Reinforced)

The following workspace rules are STRICTLY ENFORCED for this project:

- **No automatic git tags** - only create tags when user explicitly requests
- **No automatic version changes** - only modify version in package.json/pyproject.toml/etc. when user explicitly requests
- **No automatic publishing** - never run `make publish`, `npm publish`, `twine upload`, or similar without explicit user request
- **No manual package installs if Makefile exists** - use `make install` or equivalent Makefile targets, not direct `pip install`/`uv install`/`npm install`
- **No automatic git commits or pushes** - only when user explicitly requests

## Project Context

JupyterLab extension that fixes menu behavior for non-standard file types (e.g. LICENSE, .gitignore). Without this fix, these files lack a standard menu - the context menu doesn't show refresh view, menu items display incorrectly, and hover highlighting is broken.

- **Technology stack**: TypeScript, JupyterLab 4.x extension API, Python packaging with hatchling
- **Package name (npm)**: `jupyterlab_other_file_type_menu_fix`
- **Package name (PyPI)**: `jupyterlab-other-file-type-menu-fix`
- **Build system**: Makefile wrapping jlpm/npm/python-build
- **Version source**: `package.json` (hatch reads from nodejs)

## Strengthened Rules

- Always use `make install` for building and installing - never run `jlpm`, `npm install`, or `pip install` directly
- Always track both `package.json` and `package-lock.json` in git
