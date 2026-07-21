# blog

Personal blog, built with [Zola](https://www.getzola.org/), a static site generator written in Rust.
Deployed as a GitHub Pages project site at https://douglops.github.io/blog/.

## Writing a post

Add a new Markdown file under `content/`, e.g. `content/my-new-post.md`:

```
+++
title = "My New Post"
date = 2026-07-21
+++

Post body in Markdown goes here.
```

## Local development

```
zola serve
```

Opens a local server at http://127.0.0.1:1111 with live reload.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
with Zola and publishes `public/` via GitHub Pages.

One-time setup in the GitHub repo: **Settings → Pages → Source → GitHub Actions**.
