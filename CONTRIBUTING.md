# Contributing to CityMind 🌆🧠

Thank you for contributing to **CityMind**! This document provides guidelines and setup instructions for contributing to the repository.

---

## 🚀 Quickstart & Development Setup

### 1. Prerequisites

- **Python**: 3.10+
- **Node.js**: 18+
- **pnpm**: 8+ (Recommended Node package manager)
- **Git**

---

### 2. Backend Setup (Python)

You can set up the Python environment using either standard `pip` or `poetry`:

#### Option A: Using `pip` & `venv`
```bash
# 1. Create a virtual environment
python3 -m venv .venv

# 2. Activate the virtual environment
# On Linux/macOS:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt
```

#### Option B: Using `poetry`
```bash
# Install dependencies using Poetry
poetry install
```

---

### 3. Frontend Setup (Node.js)

> ⚠️ **Note**: Please use `pnpm` for all frontend package management.

```bash
# Navigate to the frontend directory (if applicable)
cd frontend

# Install dependencies using pnpm
pnpm install

# Run the development server
pnpm dev
```

---

## 🌿 Git & Branching Strategy

- `main` / `master`: Production-ready, stable codebase.
- `develop`: Integration branch for active development.
- **Feature Branches**: Branch off `develop` using the format `feature/short-description` or `fix/issue-description`.

### Commit Message Guidelines

We follow Conventional Commits format:

- `feat: add live map state diff component`
- `fix: resolve threshold crossing memory leak`
- `docs: update roadmap phase 2 milestones`
- `style: beautify README layout and badges`
- `refactor: optimize event sourcing delta logger`

---

## 🧪 Testing & Code Quality

Before opening a Pull Request:

1. Ensure code passes all tests and linting.
2. Update `requirements.txt` if new Python dependencies were added.
3. Keep pull requests focused on a single logical change.

---

## 📄 License & Attribution

By contributing to CityMind, you agree that your contributions will be licensed under the project's license.
