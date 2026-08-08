# PROJECT_MEMORY.md

This file stores stable project facts future agents should reuse. Do not paste run logs, prompts, terminal output, or one-off debugging notes here.

## Project Identity

- Name: LLMIC
- Type: Research / experiment
- Users: 希望直观理解芯片制造的普通读者与学生
- Current stage: 公开生产版已上线

## Stable Decisions

- 首枚主角选择 Intel 4004，采用 18 步完整旅程和 9 步速览。
- 所有教学内容标记为 4004 直接史料、同期工艺还原或教学简化，不补造未公开的量产参数。
- 3D 场景为程序化原创示意，不直接再发布受版权约束的历史图片、掩膜扫描或商标素材。

## Architecture Boundaries

- 前端为 React、TypeScript、Three.js 与 React Three Fiber 的纯静态单页应用。
- 生产使用 Cloudflare Workers Static Assets，自定义域名为 `llmic.szlk.uk`。
- 公开仓库为 `jobssteve164dev/LLMIC`，默认分支为 `main`。
- Cloudflare 凭据只从本地 `.env` 读取；`.env` 与 SoloMap 工作数据不得进入 Git。

## Verification

- Default CI: `.github/workflows/ci.yml`
- Default security checks: `.github/workflows/security.yml`

## Handoff Notes

- 研究与内容依据见 `docs/intel-4004-3d-production-design-report.md`。
- 生产发布入口为 `npm run deploy`，会先构建最终产物再调用 Wrangler。
