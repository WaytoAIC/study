#!/usr/bin/env bash
# deploy-volc.sh —— 一条命令把当前工作区发布到火山引擎 Pages（IGA）
# 前置：byted-supabase-cli 已登录；项目 5ohsyrm18a 已建并绑定 waytoaic-study 工作区（2026-08-11 初次部署）
# 用法：仓库根目录 `bash scripts/deploy-volc.sh`
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

PROJECT_ID="5ohsyrm18a"
WORKSPACE_ID="spry-birch-b0dc679z"
ZIP="$(mktemp -d)/study-site.zip"

echo "① 打包（排除 .git）..."
zip -qr "$ZIP" . -x '.git/*'
echo "   $(du -h "$ZIP" | cut -f1)"

echo "② 上传..."
RES_ID=$(byted-supabase-cli pages upload "$ZIP" -o json | python3 -c "import json,sys; print(json.load(sys.stdin)['ProjectDeployResourceID'])")
echo "   resource: $RES_ID"

echo "③ 部署..."
byted-supabase-cli pages deploy "$PROJECT_ID" --resource-id "$RES_ID" --yes -o json >/dev/null

echo "④ 等待完成..."
for i in $(seq 1 20); do
  ST=$(byted-supabase-cli pages deploy list "$PROJECT_ID" -o json | python3 -c "import json,sys; print(json.load(sys.stdin)['Deployments'][0]['Status'])")
  echo "   [$i] $ST"
  [ "$ST" = "DeploySuccess" ] && break
  [ "$ST" = "DeployFailed" ] && { echo "部署失败，查控制台"; exit 1; }
  sleep 15
done

rm -f "$ZIP"
echo "⑤ 预览链接（带令牌、短时效，正式域名待备案后在控制台绑定）："
byted-supabase-cli pages binding --workspace-id "$WORKSPACE_ID" -o json | python3 -c "import json,sys; print('   ' + json.load(sys.stdin)['PagesProject']['PreviewDomain'])"
