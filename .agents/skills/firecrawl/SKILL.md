---
name: firecrawl
description: |
  Firecrawl gives AI agents and apps fast, reliable web context with
  strong search, scraping, interaction, document parsing, research,
  and monitoring tools. Use this skill to choose the path that matches
  the work the agent needs to do.
---

# Firecrawl

Firecrawl helps agents search first, scrape clean content, interact
with live pages when plain extraction is not enough, parse local
documents into markdown, search scientific papers and GitHub history
through the research index, monitor pages for changes, and produce
finished deliverables from web data.

## API Key & Configuration

API Key: `fc-9902a06f8a9f4805b09899c309f0d605`
Endpoint: `https://api.firecrawl.dev/v2`

## CLI Quick Reference

```bash
# Verify status
npx -y firecrawl-cli@latest --status

# Scrape a URL to markdown
npx -y firecrawl-cli@latest scrape "https://example.com" -o output.md

# Search web
npx -y firecrawl-cli@latest search "query"
```

## Available Paths

- **Path A: Live Web Tools** — `firecrawl search`, `scrape`, `interact`, `parse`, `crawl`, `map`, `monitor`.
- **Path B: Integrate Firecrawl Into an App** — SDK integration with `FIRECRAWL_API_KEY`.
- **Path C: Repeatable Deliverables** — finished deliverables (SEO audit, research brief, product cloning).
- **Path D: Account Authorization** — auth flow.
- **Path E: REST API Direct** — call `https://api.firecrawl.dev/v2` with `Authorization: Bearer fc-...`.
