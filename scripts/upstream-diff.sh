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
echo "══ 关联网络/电商视角卡源页变更（自上次同步 $(grep -oE "上次同步上游: [0-9a-f]+" "$LEDGER" | awk '{print $2}')）══"
LAST=$(grep -oE "上次同步上游: [0-9a-f]+" "$LEDGER" | awk '{print $2}')
if [ -n "$LAST" ] && git cat-file -e "$LAST" 2>/dev/null; then
  for f in $(grep -oE "^    '[^']+\.html': \{" slides/aic-rel.js | grep -oE "[^']+\.html"); do
    [ -f "slides/$f" ] || continue
    git diff --quiet "$LAST" upstream/main -- "slides/$f" || echo "●  $f：源页有上游变更（检查视角卡/关联描述是否仍成立）"
  done
else
  echo "（台账缺少「上次同步上游」锚点，跳过）"
fi
echo
echo "处置口径见 docs/派生台账.md「操作口径」。"
