# PromptLab Phase 2

PromptLab is now a full-stack AI prompt workspace. Phase 2 moves the project from a frontend-only prompt builder to an API-first SaaS foundation with authentication, project workspaces, prompt versioning, document uploads, JSON-driven templates, provider routing, prompt analysis, and basic compare mode.

This phase intentionally does **not** include billing, subscriptions, teams, or vector search. The codebase is structured so those can be added in Phase 3 without reworking the core domain model.

## Overview

### What works in this skeleton

- SPA auth with Laravel Sanctum personal access tokens
- Prompt projects with create, update, duplicate, archive, compile, and detail workspace
- Prompt versions with restore flow
- JSON-driven prompt templates and template editor
- Document upload library plus parse/chunk pipeline scaffold
- RAG-lite context assembly from attached document chunks
- Provider abstraction for OpenAI, Anthropic, and Gemini
- Structured AI prompt analysis with saved suggestions and rewrite application
- Prompt run history
- Basic compare mode
- Snippet library
- Docker-ready monorepo layout

### Main architecture decisions

- **Laravel 13 API**: Laravel 13 was installed from the current stable skeleton in this environment. The user asked for Laravel 12 preferred; the resulting implementation uses Laravel 13 because that is what Composer resolved locally.
- **Sanctum token auth**: For local SPA development and simple production readiness, the frontend uses bearer tokens instead of session/cookie auth. This avoids CSRF setup complexity in Phase 2.
- **JSON template engine**: Templates live in the database with `schema_json`, `prompt_blocks_json`, and `provider_hints_json`. The frontend renders forms from schema, while the backend compiles prompts from blocks and runtime context.
- **RAG-lite instead of vector DB**: Uploaded documents are parsed and chunked, then ranked with simple keyword matching when compiling prompts.
- **Provider registry**: Models are seeded into `model_registries`, so model labels and IDs are not hardcoded across the UI.
- **Owner-based access control**: Phase 2 assumes a single-user workspace model. Team permissions are intentionally deferred.

## Monorepo Structure

```text
/promptlab-phase2
  /apps
    /frontend        React + TypeScript + Vite SPA
    /backend         Laravel API
  /infra
    docker-compose.yml
    /backend
    /frontend
  /packages
    /shared-types
    /template-schemas
  README.md
```

### Frontend structure

```text
apps/frontend/src
  /app
  /components
    /layout
    /ui
  /features
    /analysis
    /auth
    /builder
    /projects
    /snippets
    /templates
  /lib
    /api
    /template
  /routes
  /stores
  /types
```

### Backend structure

```text
apps/backend
  /app
    /Enums
    /Http
      /Controllers/Api
      /Requests
      /Resources
    /Jobs
    /Models
    /Services
      /AI
      /Documents
      /Prompts
      /Providers
      /Templates
    /Support
  /database
    /migrations
    /seeders
      /Data
  /routes
    api.php
```

## Core Domain

### Main models

- `prompt_projects`
- `prompt_versions`
- `prompt_runs`
- `prompt_templates`
- `documents`
- `document_chunks`
- `project_documents`
- `prompt_analyses`
- `analysis_suggestions`
- `snippets`
- `model_registries`
- `activity_logs`
- `saved_compares`

### Notable services

- `TemplateRenderService`
- `ProjectContextAssemblerService`
- `PromptBuildService`
- `PromptVersionService`
- `DocumentParsingService`
- `ProviderRouterService`
- `PromptAnalysisService`
- `PromptExecutionService`

## Local Setup

### Prerequisites

- Node.js 22+
- npm 10+
- PHP 8.3+
- Composer 2+
- PostgreSQL 16+
- Redis 7+

### 1. Backend setup

```bash
cd apps/backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

Optional queue worker:

```bash
cd apps/backend
php artisan queue:work
```

### 2. Frontend setup

```bash
cd apps/frontend
cp .env.example .env
npm install
npm run dev
```

By default the Vite dev server proxies `/api` requests to `http://localhost:8000`.

### 3. Demo account

- Email: `demo@promptlab.test`
- Password: `PromptLab123`

## Docker Setup

Docker assets live under [`infra/docker-compose.yml`](/Users/dmijic/Desktop/moje aplikacije/Aplikacije/PromptLab/infra/docker-compose.yml).

### Start the stack

```bash
cd infra
docker compose up --build
```

### Containers included

- `app-backend`
- `nginx`
- `frontend`
- `postgres`
- `redis`
- `mailpit`

### Docker follow-up commands

Run backend dependencies and setup inside containers:

```bash
docker compose exec app-backend sh
cd /var/www/apps/backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan queue:work
```

This Docker stack is the intended deployment path for VPS hosting. Shared-hosting/cPanel packaging has been removed from the repo.

## Environment Variables

### Backend

Use [`apps/backend/.env.example`](/Users/dmijic/Desktop/moje aplikacije/Aplikacije/PromptLab/apps/backend/.env.example) as the source of truth.

Important groups:

- App: `APP_URL`, `APP_FRONTEND_URL`
- Database: `DB_*`
- Redis: `REDIS_*`
- Queue/cache: `QUEUE_CONNECTION`, `CACHE_STORE`
- Filesystem: `FILESYSTEM_DISK`
- AI: `AI_DEFAULT_PROVIDER`, `OPENAI_*`, `ANTHROPIC_*`, `GEMINI_*`

### Frontend

Use [`apps/frontend/.env.example`](/Users/dmijic/Desktop/moje aplikacije/Aplikacije/PromptLab/apps/frontend/.env.example).

- `VITE_API_BASE_URL`
- `VITE_API_PROXY_TARGET`
- `VITE_BUILD_BASE`
- `VITE_ROUTER_BASENAME`

## Seed Data

Seeding creates:

- 1 demo user
- 6 system templates
- seeded provider/model registry entries
- reusable snippets
- 2 demo prompt projects
- 3 demo documents with chunks
- prompt versions
- 1 sample analysis
- 1 sample run

Template catalog lives in [`SystemTemplateCatalog.php`](/Users/dmijic/Desktop/moje aplikacije/Aplikacije/PromptLab/apps/backend/database/seeders/Data/SystemTemplateCatalog.php).

## API Surface

Implemented routes include:

- Auth: register, login, logout, me
- Projects: list, create, detail, update, delete, duplicate, archive, compile
- Versions: list, restore
- Templates: list, create, show, update, delete, clone, system list
- Documents: list, upload, show, delete, chunks, project attach/detach/settings
- Analysis: analyze, list, show, apply rewrite
- Runs: run prompt, list runs
- Compare: compare prompt output across two provider/model pairs
- Snippets: list, create, update, delete
- Models: list active models, list providers

## Prompt Template Engine

Templates define:

- `schema_json`
- `prompt_blocks_json`
- `provider_hints_json`

Supported field types in this scaffold:

- `text`
- `textarea`
- `select`
- `multi_select`
- `tags`
- `radio`
- `checkbox`
- `switch`

Supported UI/runtime behaviors:

- defaults
- required flags
- help text
- conditional fields via `show_when`
- prompt block conditions via `enabled_when`
- output format and language support
- provider hints

## Document Parsing

Implemented parser abstraction:

- `TxtParser`
- `MarkdownParser`
- `PdfParser`
- `DocxParser`

Pipeline:

1. upload file
2. store on Laravel public disk
3. dispatch `ParseDocumentJob`
4. parse text
5. normalize and chunk text
6. persist `document_chunks`

## AI Providers

Implemented adapters:

- `OpenAIProvider`
- `AnthropicProvider`
- `GeminiProvider`

Placeholders in the registry are seeded for future support:

- Mistral
- Groq
- Ollama

The provider layer is intentionally centralized under `ProviderRouterService`, so future model-specific adaptation can sit behind the same contract.

## Current Limitations

- Prompt analysis and generation are synchronous HTTP calls for now.
- No billing, subscription, quota, or usage metering.
- No teams, invites, or advanced authorization rules beyond resource ownership.
- No embeddings or vector database yet.
- Template editor is JSON-first, not a visual builder.
- Compare result “best side” is local UI state plus persisted initial compare payload, not a full benchmark workflow.
- Password reset is not fully wired into the SPA UI yet; only the foundation is ready for extension.

## Next Steps

- Move AI analysis and run flows to queued jobs with polling/websocket updates
- Add saved compare review screens
- Persist snippet selections separately from project draft payload
- Add richer template editor UX
- Add test coverage for compile, analyze, and provider routing
- Add billing, usage limits, and provider governance in Phase 3
