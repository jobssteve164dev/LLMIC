#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ ! -f "$project_dir/.env" ]]; then
  echo "缺少 .env：请配置 CLOUDFLARE_ACCOUNT_ID 与 CLOUDFLARE_API_TOKEN。" >&2
  exit 1
fi

set -a
source "$project_dir/.env"
set +a

if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" || -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo ".env 缺少必要的 Cloudflare 身份变量。" >&2
  exit 1
fi

cd "$project_dir"
npm run build
npx wrangler deploy
