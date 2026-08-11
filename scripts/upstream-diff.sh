#!/usr/bin/env bash
# upstream-diff.sh —— 派生页脱钩巡检
# 用法：季度 merge 上游后，在仓库根目录跑 `bash scripts/upstream-diff.sh`
# 逻辑：读 docs/派生台账.md 的表格行，对每个派生对检查
#       源页在「派生时版本 → upstream/main」之间是否有变更；有则列出。
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

LEDGER="docs/派生台账.md"
[ -f "$LEDGER" ] || { echo "找不到 $LEDGER"; exit 1; }

echo "拉取 upstream ..."
git fetch upstream --quiet

echo
echo "══ 派生页脱钩巡检（$(git rev-parse --short upstream/main) @ upstream/main）══"
FOUND=0
# 匹配数据行：| aic-d-x.html | src.html | <40位sha> | ... |
grep -E '^\| *aic-d-[^|]+\| *[^|]+\| *[0-9a-f]{40} *\|' "$LEDGER" | while IFS='|' read -r _ derived src sha _rest; do
  derived=$(echo "$derived" | xargs); src=$(echo "$src" | xargs); sha=$(echo "$sha" | xargs)
  if ! git cat-file -e "$sha" 2>/dev/null; then
    echo "⚠️  $derived ← $src：登记的版本 $sha 在本仓找不到，请核对台账"
    continue
  fi
  if git diff --quiet "$sha" upstream/main -- "slides/$src"; then
    echo "✓  $derived ← $src：源页无上游变更"
  else
    FOUND=1
    echo "●  $derived ← $src：源页在上游有变更，评估是否移植——"
    git log --oneline "$sha..upstream/main" -- "slides/$src" | sed 's/^/     /'
  fi
done
echo
echo "处置口径见 docs/派生台账.md「操作口径」。"
