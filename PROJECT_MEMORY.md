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
- 步骤 3 和 14 使用 4004.com 分析器中的五张 1968 × 2706 校正版图；五层保持共同 X/Y 坐标，只做 50% 等比例重采样、透明化和着色。步骤 6 必须保持为尚未形成裸片边界的空白镜面晶圆。
- 公开校正版图包不含钝化层；钝化开窗按金属层实际焊盘位置教学重建，图层垂直间距和厚度均不代表实物比例。
- 历史版图衍生资产集中在 `public/historical/4004`，按 Intel IPNC 与 4004.com CC BY-NC-SA 3.0 的非商业边界单独发布，不纳入根目录 MIT License；其余程序化场景与代码仍按 MIT 发布。
- 页脚法律与合规入口在站内读取 SZLKlaws 的 `llmic` 产品公开接口；通用法律文件及中英文产品补充说明由 SZLKlaws 统一治理，前台只展示已正式发布且具有用户入口的版本。
- LLMIC 当前是免费静态科普网站，不提供账户、表单、支付或用户内容提交；产品补充说明必须明确教学还原边界、历史资产的单独非商业许可，以及与 Intel 无隶属或背书关系。

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
